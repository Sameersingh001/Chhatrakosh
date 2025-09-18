import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Routes, Route } from "react-router-dom";
import StudentHeader from './StudentHeader';
import StudentMenu from './StudenMenu';
import StudentDashboard from './DeshboardStudentData';
import StudentProfile from './StudentProfile';
import StudentLeavePage from './StudentLeaveForm';
import StudentNoticePage from './StudentNoticePage';
import ClassmatesPage from './MyClass';

const StudentDeshboard = () => {

  const [student, setStudent] = useState(null);

useEffect(() => {
  const fetchAdminData = async () => {
    const studentID = localStorage.getItem("SMS_studentId");

    if (!studentID) {
      console.error("⚠️ No admin ID found in local storage");
      window.location.href = "/student/login"; 
      return;
    }

    try {
      const response = await axios.get( `/api/students/${studentID}`, {
        withCredentials: true, // 👈 cookie auto attached
      });
      setStudent(response.data.Student);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("SMS_studentId");
        window.location.href = "/student/login";
      }
    }
  } 
  fetchAdminData();
}, []); 

  return (
    <>
      <StudentHeader studentData={student} />
      <div className='flex'>

        <div className='bg-gradient-to-br from-purple-700 via-indigo-600 to-gray-700 min-h-screen flex'>
          <StudentMenu />
        </div>

         <div className="flex-1 p-8">
        <Routes>
          <Route
            index
            element={<StudentDashboard studentData={student} />}
          />

        <Route path="profile" element={<StudentProfile student={student} />} />
        <Route path='request-leaves' element={<StudentLeavePage student={student} />}></Route>
        <Route path='digital-notice' element={<StudentNoticePage/>}></Route>
        <Route path='my-class-students' element={<ClassmatesPage student={student}/>}></Route>
        


        </Routes>

      </div>
      </div>
    </>
  )
}

export default StudentDeshboard