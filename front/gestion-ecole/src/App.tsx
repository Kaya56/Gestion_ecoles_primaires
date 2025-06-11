import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './pages/auth/Login';
// import Dashboard from './pages/Dashboard';
import StudentList from './pages/students/StudentList';
import StudentCreate from './pages/students/StudentCreate';
import StudentDetail from './pages/students/StudentDetail';
import { Typography } from '@mui/material';

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
        <Route path="*" element={<Typography variant="h4">Page non trouvée</Typography>} />
      </Routes>
    </Router>
  );
};

export default App;