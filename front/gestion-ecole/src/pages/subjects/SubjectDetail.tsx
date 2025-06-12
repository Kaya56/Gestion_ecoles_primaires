// src/pages/subjects/SubjectDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subject.service';
import { Container, Typography, Box, Button, Grid, CircularProgress, Paper, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  section: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  language: 'FRANCOPHONE' | 'ANGLOPHONE';
  level: string;
  credits: number;
  coefficient: number;
  teacher?: { id: number; firstName: string; lastName: string };
}

const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (id) {
          const data = await subjectService.getSubjectById(Number(id));
          console.log('Détails de la matière reçus:', data); // Débogage
          setSubject(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de la matière.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await subjectService.deleteSubject(Number(id));
        console.log('Matière supprimée, redirection vers: /subjects'); // Débogage
        navigate('/subjects');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la matière.');
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

  if (error || !subject) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Matière non trouvée.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/subjects')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Détails de la matière
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Nom :</strong> {subject.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Code :</strong> {subject.code}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Description :</strong> {subject.description || 'Aucune description'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Section :</strong> {subject.section}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Langue :</strong> {subject.language}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Niveau :</strong> {subject.level || 'Non spécifié'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Crédits :</strong> {subject.credits}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Coefficient :</strong> {subject.coefficient}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Enseignant principal :</strong>{' '}
              {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : 'Aucun'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/dashboard/subjects')}>
          Retour à la liste
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/dashboard/subjects/edit/${subject.id}`)}
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
            Êtes-vous sûr de vouloir supprimer la matière {subject.name} ? Cette action est irréversible.
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

export default SubjectDetail;