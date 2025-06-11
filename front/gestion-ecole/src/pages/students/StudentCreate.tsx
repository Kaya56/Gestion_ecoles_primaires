import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { StudentForm } from '../../components/forms/StudentForm';
import studentService from '../../services/student.service';
import type { StudentCreateRequest } from '../../types/student.types';

export const StudentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: StudentCreateRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validation des données requises
      if (!data.firstName || !data.lastName || !data.dateOfBirth || 
          !data.gender || !data.section || !data.language || 
          !data.parentName || !data.parentPhone || !data.address) {
        throw new Error('Tous les champs obligatoires doivent être renseignés');
      }

      // Validation du format de la date
      const birthDate = new Date(data.dateOfBirth);
      if (isNaN(birthDate.getTime())) {
        throw new Error('Format de date de naissance invalide');
      }

      // Validation de l'âge (exemple: entre 3 et 25 ans)
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 3 || age > 25) {
        throw new Error('L\'âge de l\'élève doit être compris entre 3 et 25 ans');
      }

      // Validation du numéro de téléphone (exemple simple)
      if (!/^[\+]?[0-9\s\-\(\)]{8,15}$/.test(data.parentPhone)) {
        throw new Error('Format de numéro de téléphone invalide');
      }

      await studentService.createStudent(data);
      
      // Notification de succès (vous pouvez remplacer par un toast)
      alert('Élève créé avec succès !');
      
      // Redirection vers la liste des étudiants
      navigate('/students', { replace: true });
      
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      
      // Gestion des erreurs spécifiques
      let errorMessage = "Erreur lors de la création de l'élève";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = "Un élève avec ces informations existe déjà";
      } else if (error.response?.status === 400) {
        errorMessage = "Données invalides. Veuillez vérifier les informations saisies";
      } else if (error.response?.status >= 500) {
        errorMessage = "Erreur serveur. Veuillez réessayer plus tard";
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Confirmation avant annulation si des données ont été saisies
    const confirmCancel = window.confirm(
      'Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.'
    );
    
    if (confirmCancel) {
      navigate('/students');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/students')}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel élève</h1>
        </div>
        
        {/* Indicateur de statut */}
        {loading && (
          <div className="flex items-center text-blue-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Création en cours...
          </div>
        )}
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur lors de la création
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire principal */}
      <Card className="relative">
        {/* Overlay de chargement */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-600">Création de l'élève en cours...</p>
            </div>
          </div>
        )}
        
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </Card>

      {/* Informations d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Informations importantes
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Tous les champs marqués d'un astérisque (*) sont obligatoires</li>
                <li>La date de naissance doit être au format JJ/MM/AAAA</li>
                <li>Le numéro de téléphone du parent doit être valide</li>
                <li>Vérifiez bien les informations avant de soumettre</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};