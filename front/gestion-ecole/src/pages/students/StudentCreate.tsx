// src/pages/students/StudentCreate.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { classService } from '../../services/class.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, Select, InputLabel, FormControl } from '@mui/material';

interface Class {
  id: number;
  name: string;
}

const StudentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    registrationDate: '',
    section: '',
    classId: '',
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getAllClasses();
        setClasses(data);
      } catch (err: any) {
        setError('Erreur lors du chargement des classes');
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentData = {
        ...formData,
        classId: formData.classId ? Number(formData.classId) : null,
      };
      await studentService.createStudent(studentData);
      console.log('Étudiant créé, redirection vers: /dashboard/students');
      navigate('/dashboard/students');
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur:', err);
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
          select
          label="Genre"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          margin="normal"
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
        />
        <TextField
          fullWidth
          label="Nom du parent"
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email du parent"
          name="parentEmail"
          type="email"
          value={formData.parentEmail}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Téléphone du parent"
          name="parentPhone"
          value={formData.parentPhone}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date d'inscription"
          name="registrationDate"
          type="date"
          value={formData.registrationDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          select
          label="Section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="CRECHE">Crèche</MenuItem>
          <MenuItem value="MATERNELLE">Maternelle</MenuItem>
          <MenuItem value="PRIMAIRE">Primaire</MenuItem>
        </TextField>
        <FormControl fullWidth margin="normal">
          <InputLabel>Classe</InputLabel>
          <Select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            label="Classe"
          >
            <MenuItem value="">Aucune</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/dashboard/students')}
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