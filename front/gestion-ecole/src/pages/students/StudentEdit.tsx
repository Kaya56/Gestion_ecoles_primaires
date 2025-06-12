// src/pages/students/StudentEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { classService } from '../../services/class.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, Select, InputLabel, FormControl } from '@mui/material';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  birthDate?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  registrationDate?: string;
  section?: string;
  studentClass?: { id: number; name: string };
}

interface Class {
  id: number;
  name: string;
}

const StudentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const studentData = await studentService.getStudentById(Number(id));
          const classesData = await classService.getAllClasses();
          setFormData({
            firstName: studentData.firstName || '',
            lastName: studentData.lastName || '',
            email: studentData.email || '',
            gender: studentData.gender || '',
            birthDate: studentData.birthDate || '',
            parentName: studentData.parentName || '',
            parentEmail: studentData.parentEmail || '',
            parentPhone: studentData.parentPhone || '',
            registrationDate: studentData.registrationDate || '',
            section: studentData.section || '',
            classId: studentData.studentClass?.id?.toString() || '',
          });
          setClasses(classesData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        const studentData = {
          ...formData,
          classId: formData.classId ? Number(formData.classId) : null,
        };
        await studentService.updateStudent(Number(id), studentData);
        console.log('Étudiant mis à jour, redirection vers: /dashboard/students/${id}');
        navigate(`/dashboard/students/${id}`);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur:', err);
    }
  };

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
        <Button variant="contained" onClick={() => navigate('/dashboard/students')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Modifier l'étudiant
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
            Enregistrer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/dashboard/students/${id}`)}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StudentEdit;