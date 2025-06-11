import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from '@mui/material';

const StudentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    section: '',
    language: '',
    academicYear: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    classId: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'classId' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.classId <= 0) {
        throw new Error('Veuillez sélectionner une classe valide.');
      }
      await studentService.createStudent(formData);
      console.log('Étudiant créé, redirection vers: /students'); // Débogage
      navigate('/students');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de l\'étudiant.');
      console.error('Erreur:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Ajouter un étudiant
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
          label="Date de naissance"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
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
          select
          label="Section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="PRIMAIRE">Primaire</MenuItem>
          <MenuItem value="SECONDAIRE">Secondaire</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          label="Langue"
          name="language"
          value={formData.language}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="FRANCOPHONE">Francophone</MenuItem>
          <MenuItem value="ANGLOPHONE">Anglophone</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Année académique"
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nom du parent"
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Téléphone du parent"
          name="parentPhone"
          value={formData.parentPhone}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email du parent"
          name="parentEmail"
          type="email"
          value={formData.parentEmail}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Adresse"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="ID de la classe"
          name="classId"
          type="number"
          value={formData.classId}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/students')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StudentCreate;