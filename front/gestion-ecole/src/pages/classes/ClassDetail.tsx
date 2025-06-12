// src/pages/classes/ClassDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classService } from '../../services/class.service';
import { Container, Typography, Box, Button, Grid, CircularProgress, Paper, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface Class {
  id: number;
  name: string;
  level: string;
  section: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  language: 'FRANCOPHONE' | 'ANGLOPHONE';
  academicYear: string;
  maxCapacity: number;
  teacher?: {
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
  };
  subjects?: { id: number; name: string }[];
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Statistics {
  studentCount: number;
  maxCapacity: number;
  availableSpots: number;
}

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        if (id) {
          const classData = await classService.getClassById(Number(id));
          const studentData = await classService.getClassStudents(Number(id));
          const statsData = await classService.getClassStatistics(Number(id));
          console.log('Détails de la classe reçus:', classData); // Débogage
          console.log('Étudiants reçus:', studentData); // Débogage
          console.log('Statistiques reçues:', statsData); // Débogage
          setClassItem(classData);
          setStudents(studentData);
          setStatistics(statsData);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de la classe.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await classService.deleteClass(Number(id));
        console.log('Classe supprimée, redirection vers: /classes'); // Débogage
        navigate('/classes');
      }
    } catch (err: any) {
      setError(err.message.includes('contient des élèves') ? 'Impossible de supprimer une classe contenant des élèves.' : err.message);
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

  if (error || !classItem) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Classe non trouvée.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/classes')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Détails de la classe
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Nom :</strong> {classItem.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Niveau :</strong> {classItem.level}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Section :</strong> {classItem.section}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Langue :</strong> {classItem.language}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Année académique :</strong> {classItem.academicYear}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Capacité maximale :</strong> {classItem.maxCapacity || 'Non spécifiée'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Enseignant :</strong>{' '}
              {classItem.teacher ? `${classItem.teacher.firstName} ${classItem.teacher.lastName}` : 'Aucun'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Nombre d'étudiants :</strong> {statistics?.studentCount || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Places disponibles :</strong> {statistics?.availableSpots || 'Non applicable'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Matières associées
      </Typography>
      {classItem.subjects && classItem.subjects.length > 0 ? (
        <Table sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classItem.subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.id}</TableCell>
                <TableCell>{subject.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>Aucune matière associée.</Typography>
      )}

      <Typography variant="h5" gutterBottom>
        Étudiants
      </Typography>
      {students.length === 0 ? (
        <Typography>Aucun étudiant dans cette classe.</Typography>
      ) : (
        <Table sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
      
<Button variant="contained" onClick={() => navigate('/dashboard/classes')}>
  Retour à la liste
</Button>
<Button
  variant="contained"
  color="secondary"
  onClick={() => navigate(`/dashboard/classes/edit/${classItem.id}`)}
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la classe {classItem.name} ? Cette action est irréversible.
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

export default ClassDetail;