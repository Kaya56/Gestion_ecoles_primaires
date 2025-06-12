// src/pages/teachers/TeacherCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from '@mui/material';

const TeacherCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    hireDate: '',
    specialization: '',
    taskDescription: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teacherService.createTeacher(formData);
      console.log('Enseignant créé, redirection vers: /teachers'); // Débogage
      navigate('/teachers');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de l\'enseignant.');
      console.error('Erreur:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Ajouter un enseignant
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
            Créer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/dashboard/teachers')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TeacherCreate;