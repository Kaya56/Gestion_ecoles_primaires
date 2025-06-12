// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboard.service';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Statistics {
  totalClasses: number;
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  classesBySection: {
    creche: number;
    maternelle: number;
    primaire: number;
  };
}

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await dashboardService.getStatistics();
        console.log('Statistiques reçues:', data);
        setStatistics(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des statistiques.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !statistics) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Erreur lors du chargement des statistiques.'}
        </Alert>
      </Container>
    );
  }

  const chartData = [
    { name: 'Crèche', count: statistics.classesBySection.creche },
    { name: 'Maternelle', count: statistics.classesBySection.maternelle },
    { name: 'Primaire', count: statistics.classesBySection.primaire },
  ];

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Statistiques globales
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1976d2', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Classes</Typography>
              <Typography variant="h4">{statistics.totalClasses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#d81b60', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Étudiants</Typography>
              <Typography variant="h4">{statistics.totalStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#388e3c', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Enseignants</Typography>
              <Typography variant="h4">{statistics.totalTeachers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fbc02d', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Matières</Typography>
              <Typography variant="h4">{statistics.totalSubjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Répartition des classes par section
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
};

export default Dashboard;