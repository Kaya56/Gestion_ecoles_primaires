// src/pages/teachers/TeacherList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Container, Typography, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        console.log('Enseignants reçus:', data); // Débogage
        setTeachers(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des enseignants.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleOpenDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeacher(null);
  };

  const handleDelete = async () => {
    try {
      if (selectedTeacher?.id) {
        await teacherService.deleteTeacher(selectedTeacher.id);
        setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id));
        console.log('Enseignant supprimé:', selectedTeacher.id); // Débogage
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'enseignant.');
      console.error('Erreur:', err);
    }
    handleCloseDialog();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des enseignants
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/dashboard/teachers/create')}
        sx={{ mb: 2 }}
      >
        Ajouter un enseignant
      </Button>
      {teachers.length === 0 ? (
        <Typography>Aucun enseignant trouvé.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Spécialisation</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.id}</TableCell>
                <TableCell>{teacher.firstName}</TableCell>
                <TableCell>{teacher.lastName}</TableCell>
                <TableCell>{teacher.specialization}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/dashboard/teachers/${teacher.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Détails
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDialog(teacher)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Boîte de dialogue de confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'enseignant {selectedTeacher?.firstName} {selectedTeacher?.lastName} ? Cette action est irréversible.
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

export default TeacherList;