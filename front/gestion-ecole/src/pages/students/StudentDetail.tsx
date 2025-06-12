// src/pages/students/StudentDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { Container, Typography, Box, Button, Grid, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  birthDate?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  registrationDate?: string;
  section?: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  studentClass?: { id: number; name: string };
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (id) {
          const data = await studentService.getStudentById(Number(id));
          console.log('Étudiant reçu:', data);
          setStudent(data);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await studentService.deleteStudent(Number(id));
        console.log('Étudiant supprimé, redirection vers: /dashboard/students');
        navigate('/dashboard/students');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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
        <Button variant="contained" onClick={() => navigate('/dashboard/students')}>
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
      <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Prénom :</strong> {student.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Nom :</strong> {student.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Email :</strong> {student.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Genre :</strong> {student.gender || 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Date de naissance :</strong> {student.birthDate || 'Non spécifiée'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Nom du parent :</strong> {student.parentName || 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Email du parent :</strong> {student.parentEmail || 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Téléphone du parent :</strong> {student.parentPhone || 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Date d'inscription :</strong> {student.registrationDate || 'Non spécifiée'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Section :</strong> {student.section || 'Non spécifiée'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Classe :</strong> {student.studentClass?.name || 'Aucune'}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/dashboard/students')}>
          Retour à la liste
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/dashboard/students/edit/${student.id}`)}
        >
          Modifier
        </Button>
        <Button variant="contained" color="error" onClick={handleOpenDialog}>
          Supprimer
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'étudiant {student.firstName} {student.lastName} ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentDetail;