import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/students/StudentsPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import AddStudentPage from './pages/students/AddStudentPage';
import TeachersPage from './pages/teachers/TeachersPage';
import TeacherDetailPage from './pages/teachers/TeacherDetailPage';
import AddTeacherPage from './pages/teachers/AddTeacherPage';
import ClassesPage from './pages/classes/ClassesPage';
import ClassDetailPage from './pages/classes/ClassDetailPage';
import AddClassPage from './pages/classes/AddClassPage';
import GradesPage from './pages/grades/GradesPage';
import GradesByClassPage from './pages/grades/GradesByClassPage';
import BulletinsPage from './pages/grades/BulletinsPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import AddPaymentPage from './pages/payments/AddPaymentPage';
import DisciplinePage from './pages/discipline/DisciplinePage';
import AddDisciplinePage from './pages/discipline/AddDisciplinePage';
import EquipmentPage from './pages/equipment/EquipmentPage';
import AddEquipmentPage from './pages/equipment/AddEquipmentPage';
import PurchasesPage from './pages/purchases/PurchasesPage';
import AddPurchasePage from './pages/purchases/AddPurchasePage';
import StaffPage from './pages/staff/StaffPage';
import AddStaffPage from './pages/staff/AddStaffPage';
import SubjectsPage from './pages/subjects/SubjectsPage';
import AddSubjectPage from './pages/subjects/AddSubjectPage';
import UsersPage from './pages/users/UsersPage';
import AddUserPage from './pages/users/AddUserPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Students Routes */}
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/add" element={<AddStudentPage />} />
                <Route path="students/:id" element={<StudentDetailPage />} />

                {/* Teachers Routes */}
                <Route path="teachers" element={<TeachersPage />} />
                <Route path="teachers/add" element={<AddTeacherPage />} />
                <Route path="teachers/:id" element={<TeacherDetailPage />} />

                {/* Classes Routes */}
                <Route path="classes" element={<ClassesPage />} />
                <Route path="classes/add" element={<AddClassPage />} />
                <Route path="classes/:id" element={<ClassDetailPage />} />

                {/* Grades Routes */}
                <Route path="grades" element={<GradesPage />} />
                <Route path="grades/class/:classId" element={<GradesByClassPage />} />
                <Route path="bulletins" element={<BulletinsPage />} />

                {/* Payments Routes */}
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="payments/add" element={<AddPaymentPage />} />

                {/* Discipline Routes */}
                <Route path="discipline" element={<DisciplinePage />} />
                <Route path="discipline/add" element={<AddDisciplinePage />} />

                {/* Equipment Routes */}
                <Route path="equipment" element={<EquipmentPage />} />
                <Route path="equipment/add" element={<AddEquipmentPage />} />

                {/* Purchases Routes */}
                <Route path="purchases" element={<PurchasesPage />} />
                <Route path="purchases/add" element={<AddPurchasePage />} />

                {/* Staff Routes */}
                <Route path="staff" element={<StaffPage />} />
                <Route path="staff/add" element={<AddStaffPage />} />

                {/* Subjects Routes */}
                <Route path="subjects" element={<SubjectsPage />} />
                <Route path="subjects/add" element={<AddSubjectPage />} />

                {/* Users Routes */}
                <Route path="users" element={<UsersPage />} />
                <Route path="users/add" element={<AddUserPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;