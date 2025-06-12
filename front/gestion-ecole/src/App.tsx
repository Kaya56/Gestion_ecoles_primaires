import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/auth/Login';
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

import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import DisciplineList from './pages/discipline/DisciplineList';
import DisciplineCreate from './pages/discipline/DisciplineCreate';
import DisciplineDetail from './pages/discipline/DisciplineDetail';
import DisciplineEdit from './pages/discipline/DisciplineEdit';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/students" element={<StudentList />} />
          <Route path="/dashboard/students/class/:classId" element={<StudentList />} />
          <Route path="/dashboard/students/create" element={<StudentCreate />} />
          <Route path="/dashboard/students/:id" element={<StudentDetail />} />
          <Route path="/dashboard/teachers" element={<TeacherList />} />
          <Route path="/dashboard/teachers/create" element={<TeacherCreate />} />
          <Route path="/dashboard/teachers/:id" element={<TeacherDetail />} />
          <Route path="/dashboard/teachers/edit/:id" element={<TeacherEdit />} />
          <Route path="/dashboard/subjects" element={<SubjectList />} />
          <Route path="/dashboard/subjects/create" element={<SubjectCreate />} />
          <Route path="/dashboard/subjects/:id" element={<SubjectDetail />} />
          <Route path="/dashboard/subjects/edit/:id" element={<SubjectEdit />} />
          <Route path="/dashboard/classes" element={<ClassList />} />
          <Route path="/dashboard/classes/create" element={<ClassCreate />} />
          <Route path="/dashboard/classes/:id" element={<ClassDetail />} />
          <Route path="/dashboard/classes/edit/:id" element={<ClassEdit />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/disciplines" element={<DisciplineList />} />
          <Route path="/disciplines/create" element={<DisciplineCreate />} />
          <Route path="/disciplines/:id" element={<DisciplineDetail />} />
          <Route path="/disciplines/:id/edit" element={<DisciplineEdit />} />
          <Route path="*" element={<div className="text-2xl font-bold text-center mt-8">Page non trouvée</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;