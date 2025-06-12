// src/pages/subjects/SubjectEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subject.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';

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
}

const SubjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (id) {
          const data = await subjectService.getSubjectById(Number(id));
          console.log('Matière à modifier:', data); // Débogage
          setFormData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de la matière.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, [name]: name === 'credits' || name === 'coefficient' ? Number(value) : value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && formData) {
        await subjectService.updateSubject(Number(id), formData);
        console.log('Matière mise à jour, redirection vers: /subjects'); // Débogage
        navigate('/subjects');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la mise à jour de la matière.');
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
          {error || 'Matière non trouvée.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/subjects')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Modifier une matière
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
            Mettre à jour
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/dashboard/subjects')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SubjectEdit;