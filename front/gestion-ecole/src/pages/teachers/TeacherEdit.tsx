// src/pages/teachers/TeacherEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';

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

const TeacherEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        if (id) {
          const data = await teacherService.getTeacherById(Number(id));
          console.log('Enseignant à modifier:', data); // Débogage
          setFormData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de l\'enseignant.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && formData) {
        await teacherService.updateTeacher(Number(id), formData);
        console.log('Enseignant mis à jour, redirection vers: /teachers'); // Débogage
        navigate('/teachers');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la mise à jour de l\'enseignant.');
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !formData) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Enseignant non trouvé.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/teachers')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Modifier un enseignant
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Téléphone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          select
          label="Genre"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="MALE">Masculin</MenuItem>
          <MenuItem value="FEMALE">Féminin</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Date de naissance"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="Date d'embauche"
          name="hireDate"
          type="date"
          value={formData.hireDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="Spécialisation"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description des tâches"
          name="taskDescription"
          multiline
          rows={4}
          value={formData.taskDescription}
          onChange={handleChange}
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Mettre à jour
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/teachers')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TeacherEdit;