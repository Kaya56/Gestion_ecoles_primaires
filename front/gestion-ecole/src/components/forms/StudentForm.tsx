// components/forms/StudentForm.tsx
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { StudentCreateRequest } from '../../types/student.types';

interface StudentFormProps {
  initialData?: Partial<StudentCreateRequest>;
  onSubmit: (data: StudentCreateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<StudentCreateRequest>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || 'MALE',
    section: initialData.section || 'PRIMARY',
    language: initialData.language || 'FRENCH',
    parentName: initialData.parentName || '',
    parentPhone: initialData.parentPhone || '',
    address: initialData.address || ''
  });

  const [errors, setErrors] = useState<Partial<StudentCreateRequest>>({});

  const handleChange = (field: keyof StudentCreateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentCreateRequest> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
    if (!formData.parentName.trim()) newErrors.parentName = 'Le nom du parent est requis';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Le téléphone du parent est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Prénom"
          value={formData.firstName}
          onChange={(value) => handleChange('firstName', value)}
          error={errors.firstName}
          required
        />

        <Input
          label="Nom"
          value={formData.lastName}
          onChange={(value) => handleChange('lastName', value)}
          error={errors.lastName}
          required
        />

        <Input
          label="Date de naissance"
          type="date"
          value={formData.dateOfBirth}
          onChange={(value) => handleChange('dateOfBirth', value)}
          error={errors.dateOfBirth}
          required
        />

        <Select
          label="Genre"
          value={formData.gender}
          onChange={(value) => handleChange('gender', value)}
          options={[
            { value: 'MALE', label: 'Masculin' },
            { value: 'FEMALE', label: 'Féminin' }
          ]}
          required
        />

        <Select
          label="Section"
          value={formData.section}
          onChange={(value) => handleChange('section', value)}
          options={[
            { value: 'PRIMARY', label: 'Primaire' },
            { value: 'SECONDARY', label: 'Secondaire' }
          ]}
          required
        />

        <Select
          label="Langue"
          value={formData.language}
          onChange={(value) => handleChange('language', value)}
          options={[
            { value: 'FRENCH', label: 'Français' },
            { value: 'ENGLISH', label: 'Anglais' }
          ]}
          required
        />

        <Input
          label="Nom du parent/tuteur"
          value={formData.parentName}
          onChange={(value) => handleChange('parentName', value)}
          error={errors.parentName}
          required
        />

        <Input
          label="Téléphone du parent"
          value={formData.parentPhone}
          onChange={(value) => handleChange('parentPhone', value)}
          error={errors.parentPhone}
          required
        />
      </div>

      <Input
        label="Adresse"
        value={formData.address}
        onChange={(value) => handleChange('address', value)}
        error={errors.address}
        required
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {initialData.firstName ? 'Modifier' : 'Créer'} l'élève
        </Button>
      </div>
    </form>
  );
};