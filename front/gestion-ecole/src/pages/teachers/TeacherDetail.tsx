// src/pages/teachers/TeacherDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { Container, Typography, Box, Button, Grid, CircularProgress, Paper, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  hireDate: string;
  specialization: string;
  taskDescription: string;
}

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // Pour la boîte de dialogue

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        if (id) {
          const data = await teacherService.getTeacherById(Number(id));
          console.log('Détails de l\'enseignant reçus:', data); // Débogage
          setTeacher(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de l\'enseignant.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await teacherService.deleteTeacher(Number(id));
        console.log('Enseignant supprimé, redirection vers: /teachers'); // Débogage
        navigate('/dashboard/teachers');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'enseignant.');
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

  if (error || !teacher) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Enseignant non trouvé.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/teachers')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Détails de l'enseignant
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Prénom :</strong> {teacher.firstName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Nom :</strong> {teacher.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Email :</strong> {teacher.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Téléphone :</strong> {teacher.phone || 'Non spécifié'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Genre :</strong> {teacher.gender === 'MALE' ? 'Masculin' : 'Féminin'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Date de naissance :</strong>{' '}
              {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString() : 'Non spécifiée'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Date d'embauche :</strong>{' '}
              {teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString() : 'Non spécifiée'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Spécialisation :</strong> {teacher.specialization}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Description des tâches :</strong>{' '}
              {teacher.taskDescription || 'Aucune description fournie'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/teachers')}>
          Retour à la liste
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/dashboard/teachers/edit/${teacher.id}`)}
        >
          Modifier
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDialog}
        >
          Supprimer
        </Button>
      </Box>

      {/* Boîte de dialogue de confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'enseignant {teacher.firstName} {teacher.lastName} ? Cette action est irréversible.
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

export default TeacherDetail;