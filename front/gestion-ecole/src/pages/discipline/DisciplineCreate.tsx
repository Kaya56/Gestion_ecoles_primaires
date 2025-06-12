import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DisciplineCreateRequest } from '../../types/discipline.types';
import { createDiscipline } from '../../services/discipline.service';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

const DisciplineCreate: React.FC = () => {
  const [formData, setFormData] = useState<DisciplineCreateRequest>({
    studentId: 0,
    type: 'BLAME',
    incidentDate: new Date().toISOString().split('T')[0],
    description: '',
    action: '',
    reportedBy: '',
    resolved: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DisciplineCreateRequest, string>>>({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DisciplineCreateRequest, string>> = {};
    if (formData.studentId <= 0) {
      newErrors.studentId = "L'ID de l'étudiant doit être un nombre positif";
    }
    if (!formData.type) {
      newErrors.type = 'Le type est requis';
    }
    if (!formData.incidentDate) {
      newErrors.incidentDate = 'La date est requise';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name: keyof DisciplineCreateRequest) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, resolved: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }
    try {
      await createDiscipline(formData);
      showToast('Incident créé avec succès', 'success');
      navigate('/disciplines');
    } catch (error) {
      showToast('Erreur lors de la création', 'error');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouvel Incident Disciplinaire</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="ID de l'étudiant"
          type="number"
          value={formData.studentId.toString()}
          onChange={handleInputChange('studentId')}
          placeholder="Entrez l'ID de l'étudiant"
          required
          error={errors.studentId}
        />
        <Select
          label="Type d'incident"
          value={formData.type}
          onChange={handleInputChange('type')}
          options={[
            { value: 'BLAME', label: 'Blâme' },
            { value: 'CONVOCATION', label: 'Convocation' },
          ]}
          placeholder="Sélectionnez un type"
          required
          error={errors.type}
        />
        <Input
          label="Date de l'incident"
          type="date"
          value={formData.incidentDate}
          onChange={handleInputChange('incidentDate')}
          required
          error={errors.incidentDate}
        />
        <Input
          label="Description"
          type="text"
          value={formData.description}
          onChange={handleInputChange('description')}
          placeholder="Décrivez l'incident"
          required
          error={errors.description}
        />
        <Input
          label="Action prise"
          type="text"
          value={formData.action}
          onChange={handleInputChange('action')}
          placeholder="Action prise (optionnel)"
        />
        <Input
          label="Signalé par"
          type="text"
          value={formData.reportedBy}
          onChange={handleInputChange('reportedBy')}
          placeholder="Nom de la personne qui a signalé"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="resolved"
            checked={formData.resolved}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">Résolu</label>
        </div>
        <div className="flex space-x-3">
          <Button type="submit" variant="primary" className="flex-1">
            Créer
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/disciplines')}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DisciplineCreate;