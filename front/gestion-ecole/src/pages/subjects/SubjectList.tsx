// src/pages/subjects/SubjectList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subject.service';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Container, Typography, CircularProgress, Alert } from '@mui/material';

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

const SubjectList: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getAllSubjects();
        console.log('Matières reçues:', data); // Débogage
        setSubjects(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des matières.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
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
        Liste des matières
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/dashboard/subjects/create')}
        sx={{ mb: 2 }}
      >
        Ajouter une matière
      </Button>
      {subjects.length === 0 ? (
        <Typography>Aucune matière trouvée.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Enseignant principal</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.id}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.section}</TableCell>
                <TableCell>
                  {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : 'Aucun'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/dashboard/subjects/${subject.id}`)}
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

export default SubjectList;