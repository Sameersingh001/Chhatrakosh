import TeacherDB from "../Models/Teacher/TeacherDB.js";
import StudentDB from "../Models/Student/StudentDB.js";
import LeavesDB from "../Models/Leaves/LeavesDB.js"
import NoticeDB from "../Models/Notice/NoticeDB.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



async function RegisterTeacher(req, res) {
    const { name, email, username, designation, department, qualification, phone, address, collegeName, dateOfJoining, subjects } = req.body;

    // Validate the input
    if (!name || !email || !username || !designation || !department || !qualification || !phone || !address || !collegeName || !dateOfJoining || !subjects) {
        return res.status(400).json({ message: "All fields are required" });
    }


    try {

        const password = name.split(" ")[0].toLowerCase() + phone.slice(-6) + "@";

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the teacher already exists
        const existingTeacher = await TeacherDB.findOne({ email });
        const existingUsername = await TeacherDB.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already taken" });
        }

        if (existingTeacher) {
            return res.status(409).json({ message: "Teacher already exists" });
        }

        // Create a new teacher
        const newTeacher = new TeacherDB({
            name,
            email,
            username,
            password: hashedPassword,
            designation,
            department,
            qualification,
            subjects,
            phone,
            address,
            collegeName,
            dateOfJoining,
            isActive: true

        });
        await newTeacher.save();
        res.status(201).json({ message: "Teacher registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}


const BulkRegisterTeachers = async (req, res) => {
  try {
    const { teachers } = req.body;

    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ message: "No teacher data provided" });
    }

    // Collect emails & usernames from upload
    const emails = teachers.map((t) => t.email);
    const usernames = teachers.map((t) => t.username);

    // Check already existing teachers
    const existingTeachers = await TeacherDB.find({
      $or: [{ email: { $in: emails } }, { username: { $in: usernames } }],
    }).select("email username");

    const existingEmails = new Set(existingTeachers.map((t) => t.email));
    const existingUsernames = new Set(existingTeachers.map((t) => t.username));

    // Filter out duplicates
    const newTeachers = teachers.filter(
      (t) => !existingEmails.has(t.email) && !existingUsernames.has(t.username)
    );

    if (newTeachers.length === 0) {
      return res
        .status(409)
        .json({ message: "All provided teachers already exist ❌" });
    }

    // Format + hash passwords
const formatted = await Promise.all(
  newTeachers.map(async (t) => {
    const phoneStr = t.phone ? String(t.phone) : "";

    const password =
      t.name?.split(" ")[0].toLowerCase() +
      (phoneStr.length >= 6 ? phoneStr.slice(-6) : "000000") +
      "@";

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔑 Fix subjects
// 🔑 Fix subjects
// 🔑 Fix subjects with required fields
let subjects = [];

if (Array.isArray(t.subjects)) {
  subjects = t.subjects.map((s) => {
    if (typeof s === "string") {
      return {
        subjectName: s,
        course: "Unknown",   // ✅ default instead of ""
        semester: "N/A",     // ✅ default instead of ""
      };
    }
    return {
      subjectName: s.subjectName || "Unnamed",
      course: s.course || "Unknown",
      semester: s.semester || "N/A",
    };
  });
} else if (typeof t.subjects === "string" && t.subjects.trim() !== "") {
  try {
    const parsed = JSON.parse(t.subjects);

    if (Array.isArray(parsed)) {
      subjects = parsed.map((s) => ({
        subjectName: s.subjectName || (typeof s === "string" ? s : "Unnamed"),
        course: s.course || "Unknown",
        semester: s.semester || "N/A",
      }));
    } else if (typeof parsed === "object") {
      subjects = [
        {
          subjectName: parsed.subjectName || "Unnamed",
          course: parsed.course || "Unknown",
          semester: parsed.semester || "N/A",
        },
      ];
    } else {
      subjects = [
        { subjectName: String(parsed), course: "Unknown", semester: "N/A" },
      ];
    }
  } catch {
    subjects = [{ subjectName: t.subjects, course: "Unknown", semester: "N/A" }];
  }
} else if (typeof t.subjects === "object" && t.subjects !== null) {
  subjects = [
    {
      subjectName: t.subjects.subjectName || "Unnamed",
      course: t.subjects.course || "Unknown",
      semester: t.subjects.semester || "N/A",
    },
  ];
}



    return {
      ...t,
      phone: phoneStr,
      password: hashedPassword,
      dateOfJoining: t.dateOfJoining ? new Date(t.dateOfJoining) : null,
      subjects,
      isActive: true,
    };
  })
);




    await TeacherDB.insertMany(formatted);

    res.status(201).json({
      message: `Bulk teacher upload successful ✅ (${formatted.length} inserted, ${teachers.length - formatted.length} skipped as duplicates)`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error uploading teachers" });
  }
};


















async function GetAllTeachers(req, res) {
    try {
        const teachers = await TeacherDB.find();
        res.status(200).json(teachers || { message: "issue in found teachers" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}


async function Teacherlogin(req, res) {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }
        const teacher = await TeacherDB.findOne({ email });
        if (!teacher) {
            return res.status(401).json({ message: "❌ Invalid credentials" });
        }

        if (!teacher.isActive) {
            return res.status(403).json({ message: "❌ Account is deactivated. Please contact admin." });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Invalid credentials" });
        }

        const token = jwt.sign({ id: teacher._id, role: teacher.role}, process.env.SECRET_KEY, { expiresIn: "1d" });
        res.cookie("teacherToken", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            message: "Login successful", teacher: {
                id: teacher._id,
                role:teacher.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "❌ Internal server error" });
    }
}


 const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const teacherId = req.params.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // find teacher
    const teacher = await TeacherDB.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // check current password
    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // validate password rules (optional but good practice)
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 chars long and include uppercase, lowercase, number, and special character",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;
    await teacher.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in changePassword:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





async function GetTeacher(req, res) {
    const TeacherID = req.params.id;
    try {
        const Teacher = await TeacherDB.findById(TeacherID)
        if (!Teacher) {
            return res.status(404).json({ message: "❌ Teacher not found" });
        }
        return res.status(200).json({ Teacher });
    } catch (error) {
        return res.status(500).json({ message: " ❌ Internal server error" });
    }
}

async function getStudentsForTeacher(req, res) {
  try {
    const teacher = await TeacherDB.findById(req.user._id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Build all possible classNames from teacher's subjects
    const classNames = teacher.subjects.map(
      (subj) => `${subj.course.trim()}`
    );

    // Find students whose className matches any of those
    const students = await StudentDB.find({
      className: { $in: classNames }
    });

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}






async function UpdateTeacher(req, res) {
    const ID = req.params.id;
    const { name, username, qualification, phone, address } = req.body;

    try {
        let updatedData = { name, username, qualification, phone, address };

        // Handle file upload
        if (req.file) {
            updatedData.image = `/uploads/teacher/${req.file.filename}`;
        }

        // Update teacher
        const updateTeacherData = await TeacherDB.findByIdAndUpdate(
            ID,
            { $set: updatedData },
            { new: true } // return the updated document
        );

        if (!updateTeacherData) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(updateTeacherData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}




async function getLeavesForTeacher(req, res) {
  try {
    // 1️⃣ Get teacher's department
    const teacherID = req.user?._id; // set by TeacherVerifyToken
    // 2️⃣ Find students in teacher's department
    const teacher = await TeacherDB.findById(teacherID)
    const students = await StudentDB.find({ className: teacher.department });
    const studentIds = students.map(s => s._id);

    // 3️⃣ Get leaves for those students
    const leaves = await LeavesDB.find({ studentId: { $in: studentIds } })
                                .populate("studentId", "name rollNo className")
                                .sort({ appliedDate: -1 });
    res.status(200).json(leaves);
  } catch (err) {

    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function UpdateStudentLeaveStatus(req ,res) {
    try {
    const { status } = req.body;
    const leave = await LeavesDB.findByIdAndUpdate(
      req.params.id,
      { teacherStatus: status },
      { new: true }
    ).populate("studentId");

    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}




const getNotices = async (req, res) => {
  try {
    const notices = await NoticeDB.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching notices" });
  }
};

// Create a new notice
const createNotice = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({ error: "Only teachers or admins can create notices" });
    }

    const newNotice = new NoticeDB({
      title,
      description,
      link,
      role: req.user.role,
    });

    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ error: "Server error while creating notice" });
  }
};


const updateTeacherNotice = async (req, res) => {
  try {
    const { id } = req.params;

    // find only if notice is teacher's
    const notice = await NoticeDB.findOne({ _id: id, role: "teacher" });
    if (!notice) {
      return res.status(403).json({ error: "❌ You can only update your own notices" });
    }

    const updatedNotice = await NoticeDB.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "✅ Notice updated", notice: updatedNotice });
  } catch (err) {
    console.error("❌ Error updating notice:", err);
    res.status(500).json({ error: "Server error" });
  }
};



 const deleteTeacherNotice = async (req, res) => {
  try {
    const { id } = req.params;

    // only teacher-created notices can be deleted
    const notice = await NoticeDB.findOne({ _id: id, role: "teacher" });
    if (!notice) {
      return res.status(403).json({ error: "❌ You can only delete your own notices" });
    }

    await NoticeDB.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ Notice deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting notice:", err);
    res.status(500).json({ error: "Server error" });
  }
};



async function TeacherLogout(req, res) {
    res.clearCookie("teacherToken");
    return res.status(200).json({ message: "✅ Logout successful" });
}





export default {
    RegisterTeacher,
    GetAllTeachers,
    Teacherlogin,
    GetTeacher,
    UpdateTeacher,
    TeacherLogout,
    getStudentsForTeacher,
    getLeavesForTeacher,
    UpdateStudentLeaveStatus,
    BulkRegisterTeachers,
    createNotice,
    getNotices,
    deleteTeacherNotice,
    updateTeacherNotice,
    changePassword
    
}