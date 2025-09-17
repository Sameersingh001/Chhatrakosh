import React from 'react'
import DesNav from './DesNav'
import AdminHeader from './AdminHeader'
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Routes, Route } from "react-router-dom";
import TeacherRegister from '../../TeacherPages/TeacherRegistration';
import SuccessfullReg from '../../TeacherPages/TeacherSmallCom/SuccessfullReg';
import DashboardStats from './DashboardData';
import AdminProfile from './AdminProfile';
import StudentsPage from '../../StudentPages/AllStudent';
import AddStudent from "../../StudentPages/StudentRegistration"
import TeachersPage from '../../TeacherPages/AllTeachers';
import TeacherDetailPage from '../../TeacherPages/TeacherBYID';
import StudentDetailPage from '../../StudentPages/StudentByID';
import AdminLeavesPage from './AdminLeavePage';
import TeacherByDepartment from './Department';
import NoticePage from './DigitalNotice';


const AdminDeshbord = () => {

  const [admin, setAdmin] = useState(null);

useEffect(() => {
  const fetchAdminData = async () => {
    const adminId = localStorage.getItem("SMS_adminId");

    if (!adminId) {
      console.error("⚠️ No admin ID found in local storage");
      window.location.href = "/admin/login"; 
      return;
    }

    try {
      const response = await axios.get( `/api/admin/${adminId}`, {
        withCredentials: true, // 👈 cookie auto attached
      });
      setAdmin(response.data.admin);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("SMS_adminId");
        window.location.href = "/admin/login";
      }
    }
  } 
  fetchAdminData();
}, []);

  return (
    <>
      <AdminHeader adminData={admin} />
      <div className='flex'>

        <div className='bg-gradient-to-br from-purple-700 via-indigo-600 to-gray-700 min-h-screen flex'>
          <DesNav />
        </div>

         <div className="flex-1 p-8">
        <Routes>
          <Route
            index
            element={<DashboardStats/>}
          />
           <Route path="teachers/register" element={<TeacherRegister />} />
           <Route path="register-teacher" element={<SuccessfullReg />} />
           <Route path="profile" element={<AdminProfile admin={admin} />}  />
           
           <Route path="AllStudents" element={<StudentsPage role={admin?.role}/>}  />
           <Route path="AllStudents/:id" element={<StudentDetailPage role={"admin"}/>}  />

    
           <Route path="Allteachers" element={<TeachersPage/>}  />
           <Route path="student/new-student" element={<AddStudent/>}  />
           <Route path="Allteachers/:id" element={<TeacherDetailPage/>}  />
           <Route path="leave" element={<AdminLeavesPage/>}  />
           <Route path="departments" element={<TeacherByDepartment />}></Route>
           <Route path='digital-notice' element={<NoticePage />}></Route>

           


        </Routes>

      </div>
      </div>
    </>
  )
}

export default AdminDeshbord