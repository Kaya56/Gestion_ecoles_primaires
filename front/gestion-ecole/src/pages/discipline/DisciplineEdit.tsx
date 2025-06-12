import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Discipline, DisciplineCreateRequest } from '../../types/discipline.types';
import { getDisciplineById, updateDiscipline } from '../../services/discipline.service';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const DisciplineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<DisciplineCreateRequest | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDiscipline = async () => {
      try {
        const discipline = await getDisciplineById(Number(id));
        setFormData({
          studentId: discipline.studentId || 0,
          type: discipline.type,
          incidentDate: new Date(discipline.incidentDate).toISOString().split('T')[0],
          description: discipline.description,
          action: discipline.action || '',
          reportedBy: discipline.reportedBy || '',
          resolved: discipline.resolved,
        });
      } catch (error) {
        showToast('Erreur lors du chargement de l\'incident', 'error');
        navigate('/disciplines');
      }
    };
    fetchDiscipline();
  }, [id, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      await updateDiscipline(Number(id), formData);
      showToast('Incident mis à jour avec succès', 'success');
      navigate(`/disciplines/${id}`);
    } catch (error) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  if (!formData) return <p>Chargement...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier l'Incident Disciplinaire</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="ID de l'étudiant"
          required
        />
        <Select
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={[
            { value: 'BLAME', label: 'Blâme' },
            { value: 'CONVOCATION', label: 'Convocation' },
          ]}
          required
        />
        <Input
          type="date"
          name="incidentDate"
          value={formData.incidentDate}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <Input
          type="text"
          name="action"
          value={formData.action}
          onChange={handleChange}
          placeholder="Action prise (optionnel)"
        />
        <Input
          type="text"
          name="reportedBy"
          value={formData.reportedBy}
          onChange={handleChange}
          placeholder="Signalé par"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            name="resolved"
            checked={formData.resolved}
            onChange={(e) => setFormData({ ...formData, resolved: e.target.checked })}
            className="mr-2"
          />
          <label>Résolu</label>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" variant="primary">Mettre à jour</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/disciplines')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DisciplineEdit;