import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { Container, Typography, Box, Button, Grid, CircularProgress, Paper, Alert } from '@mui/material';

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
  classId?: number; // Ajouté car il peut être renvoyé par l'API
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (id) {
          const data = await studentService.getStudentById(Number(id));
          setStudent(data);
        }
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'étudiant.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !student) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Étudiant non trouvé.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/students')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Détails de l'étudiant
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Prénom :</strong> {student.firstName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Nom :</strong> {student.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Date de naissance :</strong> {new Date(student.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Genre :</strong> {student.gender === 'MALE' ? 'Masculin' : 'Féminin'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Section :</strong> {student.section}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Langue :</strong> {student.language}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Année académique :</strong> {student.academicYear}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Nom du parent :</strong> {student.parentName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Téléphone du parent :</strong> {student.parentPhone}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Email du parent :</strong> {student.parentEmail}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Adresse :</strong> {student.address}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Classe :</strong> {student.className}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Date d'inscription :</strong> {new Date(student.registrationDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate(student.classId ? `/students/class/${student.classId}` : '/students')}
        >
          Retour à la liste
        </Button>
      </Box>
    </Container>
  );
};

export default StudentDetail;