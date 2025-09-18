import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true, // Unique ID for each complaint
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true, // Always a student raises the complaint
    },

    target: {
      role: { type: String, enum: ["admin", "teacher"], required: true },
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, 
      // If role = "admin" → id not needed
      // If role = "teacher" → must provide teacherId
    },

    subject: {
      type: String,
      required: true, // Short title of complaint
    },

    description: {
      type: String,
      required: true, // Full complaint details
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },

    response: {
      type: String,
      default: "", // Reply from teacher or admin
    },
  },
  {
    timestamps: true, // ✅ auto-manages createdAt & updatedAt
  }
);

const ComplaintDB = mongoose.model("Complaint", ComplaintSchema);
export default ComplaintDB
