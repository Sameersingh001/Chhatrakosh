import express from "express"
import Student_Controller from "../Controllers/Student_Controller.js"
import upload from "../Middlewares/UploadMIddle.js"
import { AdminVerifyToken, StudentVerifyToken } from "../Middlewares/VerifyToken.js"
import { TeacherVerifyToken } from "../Middlewares/VerifyToken.js"

const studentrouter = express.Router()


studentrouter.get("/api/students/:id", StudentVerifyToken, Student_Controller.GetStudent)
studentrouter.get("/api/student/:id/my-leaves", StudentVerifyToken, Student_Controller.GetStudentLeaves)
studentrouter.get("/api/student/notices", StudentVerifyToken, Student_Controller.GetNotices)
studentrouter.get("/api/students/class/:className/:id", StudentVerifyToken, Student_Controller.MyClassStudents)

studentrouter.post("/api/student/request-leaves", StudentVerifyToken, Student_Controller.RequestLeave )

studentrouter.post("/api/students/registration",upload.none(),Student_Controller.StudentRegistration )
studentrouter.post("/api/students/bulk-register",upload.none(),Student_Controller.bulkRegisterStudents )


studentrouter.post("/api/student/login",Student_Controller.StudentLogin )
studentrouter.post('/api/student/logout',StudentVerifyToken, Student_Controller.StudentLogout)
studentrouter.post("/api/student/:id", upload.single('photo'), Student_Controller.UpdateStudent)


studentrouter.get("/api/students/admin/:id",AdminVerifyToken, Student_Controller.GetStudent)

studentrouter.get("/api/students/teacher/:id",TeacherVerifyToken, Student_Controller.GetStudent)





export default studentrouter