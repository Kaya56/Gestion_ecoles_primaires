// src/pages/classes/ClassList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/class.service';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Container, Typography, CircularProgress, Alert } from '@mui/material';

interface Class {
  id: number;
  name: string;
  level: string;
  section: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  language: 'FRANCOPHONE' | 'ANGLOPHONE';
  academicYear: string;
  maxCapacity: number;
  teacher?: { id: number; firstName: string; lastName: string };
}

const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getAllClasses();
        console.log('Classes reçues:', data);
        setClasses(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des classes.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

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
        Liste des classes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/dashboard/classes/create')}
        sx={{ mb: 2 }}
      >
        Ajouter une classe
      </Button>
      {classes.length === 0 ? (
        <Typography>Aucune classe trouvée.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Année académique</TableCell>
              <TableCell>Enseignant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.id}</TableCell>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.level}</TableCell>
                <TableCell>{classItem.section}</TableCell>
                <TableCell>{classItem.academicYear}</TableCell>
                <TableCell>
                  {classItem.teacher ? `${classItem.teacher.firstName} ${classItem.teacher.lastName}` : 'Aucun'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/dashboard/classes/${classItem.id}`)}
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
  );
};

export default ClassList;