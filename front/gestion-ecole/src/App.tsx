// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './pages/auth/Login';
// import Dashboard from './pages/Dashboard';
import StudentList from './pages/students/StudentList';
import StudentCreate from './pages/students/StudentCreate';
import StudentDetail from './pages/students/StudentDetail';
import TeacherList from './pages/teachers/TeacherList';
import TeacherCreate from './pages/teachers/TeacherCreate';
import TeacherDetail from './pages/teachers/TeacherDetail';
import TeacherEdit from './pages/teachers/TeacherEdit';
import SubjectList from './pages/subjects/SubjectList';
import SubjectCreate from './pages/subjects/SubjectCreate';
import SubjectDetail from './pages/subjects/SubjectDetail';
import SubjectEdit from './pages/subjects/SubjectEdit';
import ClassList from './pages/classes/ClassList';
import ClassCreate from './pages/classes/ClassCreate';
import ClassDetail from './pages/classes/ClassDetail';
import ClassEdit from './pages/classes/ClassEdit';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/class/:classId" element={<StudentList />} />
        <Route path="/students/create" element={<StudentCreate />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/teachers" element={<TeacherList />} />
        <Route path="/teachers/create" element={<TeacherCreate />} />
        <Route path="/teachers/:id" element={<TeacherDetail />} />
        <Route path="/teachers/edit/:id" element={<TeacherEdit />} />
        <Route path="/subjects" element={<SubjectList />} />
        <Route path="/subjects/create" element={<SubjectCreate />} />
        <Route path="/subjects/:id" element={<SubjectDetail />} />
        <Route path="/subjects/edit/:id" element={<SubjectEdit />} />
        <Route path="/classes" element={<ClassList />} />
        <Route path="/classes/create" element={<ClassCreate />} />
        <Route path="/classes/:id" element={<ClassDetail />} />
        <Route path="/classes/edit/:id" element={<ClassEdit />} />
        {/* <Route path="*" element={<Typography variant="h4">Page non trouvée</Typography>} /> */}
      </Routes>
    </Router>
  );
};

export default App;