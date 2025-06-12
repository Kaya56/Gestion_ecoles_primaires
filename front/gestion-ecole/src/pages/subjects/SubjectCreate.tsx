// src/pages/subjects/SubjectCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subject.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from '@mui/material';

const SubjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    section: '',
    language: '',
    level: '',
    credits: 1,
    coefficient: 1,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'credits' || name === 'coefficient' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subjectService.createSubject(formData);
      console.log('Matière créée, redirection vers: /subjects'); // Débogage
      navigate('/subjects');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de la matière.');
      console.error('Erreur:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Ajouter une matière
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
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          margin="normal"
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
          label="Niveau"
          name="level"
          value={formData.level}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Crédits"
          name="credits"
          type="number"
          value={formData.credits}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Coefficient"
          name="coefficient"
          type="number"
          value={formData.coefficient}
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
            onClick={() => navigate('/subjects')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SubjectCreate;