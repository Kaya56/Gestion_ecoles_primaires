import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  section: string;
  language: string;
  academicYear: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  className: string;
  registrationDate: string;
  classId?: number;
}

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        console.log('Données reçues:', data); // Débogage
        setStudents(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des étudiants.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container sx={{ flexGrow: 1 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Liste de tous les étudiants
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/students/create')}
          sx={{ mb: 2 }}
        >
          Ajouter un étudiant
        </Button>
        {students.length === 0 ? (
          <Typography>Aucun étudiant trouvé.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Classe</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default StudentList;