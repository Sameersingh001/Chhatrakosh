import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Routes, Route } from "react-router-dom";
import TeacherHeader from './TeacherHeader';
import TeacherMenu from './TeacherMenu';
import TeacherDashboard from './TeacherDashboard';
import AddStudent from '../../StudentPages/StudentRegistration';
import TeacherProfile from './TeacherProfile';
import StudentsPage from '../../StudentPages/AllStudent';
import StudentDeatailPage from "../../StudentPages/StudentByID"
import TeacherLeavesPage from './StudentLeaves';
import TeacherNoticePage from './TeacherNoticePage';
const Dashboard = () => {

  const [teacher, setTeacher] = useState(null);

useEffect(() => {
  const fetchAdminData = async () => {
    const teacherID = localStorage.getItem("SMS_teacherId");

    if (!teacherID) {
      window.location.href = "/teacher/login"; 
      return;
    }

    try {
      const response = await axios.get( `/api/teacher/${teacherID}`, {
        withCredentials: true, // 👈 cookie auto attached
      });
      setTeacher(response.data.Teacher);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("SMS_teacherId");
        window.location.href = "/teacher/login";
      }
    }
  } 
  fetchAdminData();
}, []);

  return (
    <>
      <TeacherHeader teacherData={teacher} />
      <div className='flex'>

        <div className='bg-gradient-to-br from-purple-700 via-indigo-600 to-gray-700 min-h-screen flex'>
          <TeacherMenu />
        </div>

         <div className="flex-1 p-8">
        <Routes>
          <Route
            index
            element={<TeacherDashboard />}
          />

          <Route path='new-student' element={<AddStudent />}></Route>
          <Route path='profile' element={<TeacherProfile teacher={teacher} />}></Route>
          <Route path='all-Students' element={<StudentsPage role={teacher?.role} />}></Route>
          <Route path='AllStudents/:id' element={<StudentDeatailPage role={"teacher"} />}></Route>
          <Route path='student-leaves' element={<TeacherLeavesPage />}></Route>
          <Route path='notice' element={<TeacherNoticePage teacher={teacher} />}></Route>
        </Routes>



      </div>
      </div>
    </>
  )
}

export default Dashboard