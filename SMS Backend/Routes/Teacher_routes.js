import express from "express"
import TeacherController from "../Controllers/Teacher_Controller.js"
import { AdminVerifyToken } from "../Middlewares/VerifyToken.js"
import { TeacherVerifyToken } from "../Middlewares/VerifyToken.js"
import upload from '../Middlewares/UploadMIddle.js'
 
const Teacherrouter = express.Router()


Teacherrouter.get("/api/teacher/students",TeacherVerifyToken, TeacherController.getStudentsForTeacher)
//Post Requests
Teacherrouter.post("/api/teachers/register", AdminVerifyToken, TeacherController.RegisterTeacher)
Teacherrouter.post("/api/teachers/bulk-register", AdminVerifyToken, TeacherController.BulkRegisterTeachers)
Teacherrouter.post('/api/teacher/logout',TeacherVerifyToken, TeacherController.TeacherLogout)
Teacherrouter.get("/api/teacher/leaves",TeacherVerifyToken, TeacherController.getLeavesForTeacher);

Teacherrouter.post("/api/teacher/leaves/:id", TeacherController.UpdateStudentLeaveStatus)
//Get Requests


Teacherrouter.get("/api/teachers",AdminVerifyToken, TeacherController.GetAllTeachers)
Teacherrouter.get("/api/teacher/:id",TeacherVerifyToken, TeacherController.GetTeacher)

//admin veri token routes

Teacherrouter.get("/api/admin/teacher/:id", AdminVerifyToken, TeacherController.GetTeacher); 
Teacherrouter.post('/api/teachers/:id', upload.single('image'), TeacherController.UpdateTeacher)
Teacherrouter.post("/api/teacher/login", TeacherController.Teacherlogin)

    
export default Teacherrouter