import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Discipline } from '../../types/discipline.types';
import { getDisciplineById } from '../../services/discipline.service';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const DisciplineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDiscipline = async () => {
      try {
        const response = await getDisciplineById(Number(id));
        setDiscipline(response);
      } catch (error) {
        showToast('Erreur lors du chargement de l\'incident', 'error');
        navigate('/disciplines');
      } finally {
        setLoading(false);
      }
    };
    fetchDiscipline();
  }, [id, navigate, showToast]);

  if (loading) return <p>Chargement...</p>;
  if (!discipline) return <p>Incident non trouvé</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Détails de l'Incident</h1>
        <p><strong>Étudiant:</strong> {discipline.studentName}</p>
        <p><strong>Type:</strong> {discipline.type}</p>
        <p><strong>Date:</strong> {new Date(discipline.incidentDate).toLocaleDateString()}</p>
        <p><strong>Description:</strong> {discipline.description}</p>
        <p><strong>Action:</strong> {discipline.action || 'Aucune'}</p>
        <p><strong>Signalé par:</strong> {discipline.reportedBy || 'Non spécifié'}</p>
        <p><strong>Résolu:</strong> {discipline.resolved ? 'Oui' : 'Non'}</p>
        <p><strong>Créé le:</strong> {new Date(discipline.createdAt).toLocaleDateString()}</p>
        <div className="flex space-x-2 mt-4">
          <Button onClick={() => navigate(`/disciplines/${id}/edit`)}>Modifier</Button>
          <Button variant="secondary" onClick={() => navigate('/disciplines')}>Retour</Button>
        </div>
      </Card>
    </div>
  );
};

export default DisciplineDetail;