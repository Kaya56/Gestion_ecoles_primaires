// src/pages/classes/ClassCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/class.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from '@mui/material';

const ClassCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    section: '',
    language: '',
    academicYear: '',
    maxCapacity: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'maxCapacity' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classService.createClass(formData);
      console.log('Classe créée, redirection vers: /dashboard/classes');
      navigate('/dashboard/classes');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de la classe.');
      console.error('Erreur:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Ajouter une classe
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nom"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Niveau"
          name="level"
          value={formData.level}
          onChange={handleChange}
          margin="normal"
          required
        />
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
          <MenuItem value="CRECHE">Crèche</MenuItem>
          <MenuItem value="MATERNELLE">Maternelle</MenuItem>
          <MenuItem value="PRIMAIRE">Primaire</MenuItem>
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
          label="Capacité maximale"
          name="maxCapacity"
          type="number"
          value={formData.maxCapacity}
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
            onClick={() => navigate('/dashboard/classes')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ClassCreate;