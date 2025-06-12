// src/pages/classes/ClassEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classService } from '../../services/class.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';

interface Class {
  id: number;
  name: string;
  level: string;
  section: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  language: 'FRANCOPHONE' | 'ANGLOPHONE';
  academicYear: string;
  maxCapacity: number;
}

const ClassEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        if (id) {
          const data = await classService.getClassById(Number(id));
          console.log('Classe à modifier:', data); // Débogage
          setFormData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de la classe.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, [name]: name === 'maxCapacity' ? Number(value) : value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && formData) {
        await classService.updateClass(Number(id), formData);
        console.log('Classe mise à jour, redirection vers: /classes'); // Débogage
        navigate('/classes');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la mise à jour de la classe.');
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
          {error || 'Classe non trouvée.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/classes')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Modifier une classe
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
            Mettre à jour
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/classes')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ClassEdit;