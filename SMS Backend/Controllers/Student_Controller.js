import StudentDB from "../Models/Student/StudentDB.js";
import LeavesDB from "../Models/Leaves/LeavesDB.js";
import NoticeDB from "../Models/Notice/NoticeDB.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// Student Registration Controller

export async function StudentRegistration(req, res) {
  try {
    const {
      name,
      email,
      rollNo,
      className,
      semester,
      phone,
      address,
      dob,
      gender,
      parentName,
      parentPhone,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !rollNo || !className || !semester || !phone) {
      return res.status(400).json({ message: "⚠️ All required fields must be filled" });
    }

    // ✅ Check if student already exists by email or roll number
    const existingStudent = await StudentDB.findOne({
      $or: [{ email }, { rollNo }],
    });

    if (existingStudent) {
      return res.status(409).json({ message: "⚠️ Student with this Email or Roll No already exists" });
    }

    // ✅ Generate a default password
    const firstName = name.split(" ")[0]?.toLowerCase() || "student";
    const rollSuffix = rollNo.slice(-4) || "0000";
    const phoneSuffix = phone.slice(-4) || "0000";
    const rawPassword = `${firstName}${rollSuffix}${phoneSuffix}@`;

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // ✅ Create new student document
    const newStudent = new StudentDB({
      name,
      email,
      rollNo,
      className,
      semester,
      phone,
      address,
      dob,
      gender,
      parentName,
      parentPhone,
      password: hashedPassword,
      isActive: true,
    });

    await newStudent.save();

    res.status(201).json({
      message: "✅ Student registered successfully",
      studentId: newStudent._id,
      defaultPassword: rawPassword, // Optional: Only return if you want to give it to admin
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "❌ Internal server error" });
  }
}

const bulkRegisterStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || students.length === 0) {
      return res.status(400).json({ message: "No student data provided" });
    }

    const requiredFields = [
      "name", "email", "rollNo", "className", "semester",
      "phone", "dob", "gender", "address", "parentName", "parentPhone"
    ];

    // Validate each student
    for (const [index, student] of students.entries()) {
      for (const field of requiredFields) {
        if (!student[field]) {
          return res.status(400).json({
            message: `Row ${index + 1}: Missing required field "${field}"`,
          });
        }
      }
    }

    // Check for duplicates in DB
    const emails = students.map(s => s.email);
    const rollNos = students.map(s => s.rollNo);

    const existing = await StudentDB.find({
      $or: [{ email: { $in: emails } }, { rollNo: { $in: rollNos } }]
    });

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Duplicate email or rollNo found",
        existing: existing.map(e => ({ email: e.email, rollNo: e.rollNo }))
      });
    }

    // Generate passwords and hash them for each student
    const studentsToInsert = await Promise.all(students.map(async (student) => {
      const firstName = student.name.split(" ")[0]?.toLowerCase() || "student";

      // Convert rollNo and phone to string
      const rollStr = String(student.rollNo);
      const phoneStr = String(student.phone);

      const rollSuffix = rollStr.slice(-4) || "0000";
      const phoneSuffix = phoneStr.slice(-4) || "0000";

      const rawPassword = `${firstName}${rollSuffix}${phoneSuffix}@`;

      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      return {
        ...student,
        password: hashedPassword,
        isActive: true,
      };
    }));
    // Insert all students
    const inserted = await StudentDB.insertMany(studentsToInsert);

    res.status(201).json({
      message: `${inserted.length} students uploaded successfully`,
      students: inserted.map(s => ({
        name: s.name,
        email: s.email,
        rollNo: s.rollNo,
      }))
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};





async function StudentLogin(req, res) {
  const { rollNo, email, password } = req.body;

  try {
    if (!rollNo || !email || !password) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }
    const student = await StudentDB.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    const roll = await StudentDB.findOne({ rollNo });
    if (!roll) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    if (student.status != "active") {
      return res.status(401).json({ message: "❌ Your Acount is Inactive Contact Your Admin" });
    }

    const token = jwt.sign({ id: student._id, role: student.role }, process.env.SECRET_KEY, { expiresIn: "1d" });
    res.cookie("studentToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      message: "Login successful", student: {
        id: student._id,
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "❌ Internal server error" });
  }
}




//Change password Controller 



const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const studentId = req.params.id;

    // 1️⃣ Find student
    const student = await StudentDB.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Compare current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 3️⃣ Check confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 4️⃣ Validate password strength (optional but recommended)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      });
    }

    // 5️⃣ Hash and save new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};











async function GetStudent(req, res) {
  const StudentID = req.params.id;
  try {
    const Student = await StudentDB.findById(StudentID)
    if (!Student) {
      return res.status(404).json({ message: "❌ Student not found" });
    }
    return res.status(200).json({ Student });
  } catch (error) {
    return res.status(500).json({ message: " ❌ Internal server error" });
  }
}






async function UpdateStudent(req, res) {
  const ID = req.params.id;
  const { name, phone, address, parentName, parentPhone } = req.body;

  try {

    let updatedData = { name, phone, parentName, parentPhone, address };

    // Handle file upload
    if (req.file) {
      updatedData.photo = `/uploads/student/${req.file.filename}`;
    }

    // Update teacher
    const UpdateStudent = await StudentDB.findByIdAndUpdate(
      ID,
      { $set: updatedData },
      { new: true } // return the updated document
    );

    if (!UpdateStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(UpdateStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}



const RequestLeave = async (req, res) => {
  try {
    const { studentId, reason, startDate, endDate } = req.body;

    // Validate fields
    if (!studentId || !reason || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId" });
    }

    // Verify student exists
    const student = await StudentDB.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create leave
    const leave = new LeavesDB({
      studentId: student._id,
      reason,
      startDate,
      endDate,
    });

    await leave.save();

    res.status(201).json({ message: "Leave request submitted", leave });
  } catch (error) {
    console.error("❌ Error creating leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};


async function GetStudentLeaves(req, res) {
  try {
    const studentId = req.params.id;

    const leaves = await LeavesDB.find({ studentId }).sort({ appliedDate: -1 });

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("❌ Error fetching student leaves:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching leaves",
    });
  }
}

const DeleteLeaves = async (req, res) => {
  const { leaveId } = req.params;

  try {
    const leave = await LeavesDB.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // Only allow deletion if leave is still pending
    if (leave.teacherStatus !== "Pending" || leave.adminStatus !== "Pending") {
      return res.status(403).json({ message: "Cannot delete approved/recommended leave" });
    }

    await LeavesDB.findByIdAndDelete(leaveId);
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (err) {
    console.error("Error deleting leave:", err);
    res.status(500).json({ message: "Error deleting leave" });
  }
};


async function GetNotices(req, res) {
  try {
    const Notices = await NoticeDB.find().sort({ createdAt: -1 }); // latest first

    if (Notices.length === 0) {
      return res.status(404).json({ message: "No notices found" });
    }

    return res.status(200).json({
      notices: Notices,
      message: "✅ Notices fetched successfully",
    });
  } catch (err) {
    console.error("❌ Error fetching notices:", err);
    return res.status(500).json({ message: "Server error, please try again" });
  }
}



async function MyClassStudents(req, res) {
  const { id, className } = req.params;
  // Check if id is provided and valid
  if (!id || !className) {
    return res.status(400).json({ message: "Student ID and className are required." });
  }

  try {
    // Ensure id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
    // Fetch classmates except the current student
    const students = await StudentDB.find({
      className: className,
      _id: { $ne: id }
    }).select("-password"); // exclude sensitive fields

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No other students found in this class." });
    }

    return res.status(200).json({ students, message: "Students fetched successfully." });
  } catch (err) {
    console.error("Error fetching class students:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}





async function StudentLogout(req, res) {
  res.clearCookie("studentToken");
  return res.status(200).json({ message: "✅ Logout successful" });
}




export default {
  StudentRegistration,
  StudentLogin,
  GetStudent,
  StudentLogout,
  UpdateStudent,
  RequestLeave,
  GetStudentLeaves,
  bulkRegisterStudents,
  GetNotices,
  MyClassStudents,
  changePassword,
  DeleteLeaves
}