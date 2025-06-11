import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import studentService from '../../services/student.service';
import type { Student } from '../../types/student.types';

export const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const results = await studentService.searchStudents(searchTerm);
        setStudents(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadStudents();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      try {
        await studentService.deleteStudent(id);
        setStudents(students.filter(s => s.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'élève');
      }
    }
  };

  const columns = [
    { 
      key: 'firstName', 
      label: 'Prénom',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    { 
      key: 'lastName', 
      label: 'Nom',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    { 
      key: 'section', 
      label: 'Section',
      render: (value: string) => (
        <Badge variant={value === 'PRIMARY' ? 'info' : 'success'}>
          {value === 'PRIMARY' ? 'Primaire' : 'Secondaire'}
        </Badge>
      )
    },
    { 
      key: 'language', 
      label: 'Langue',
      render: (value: string) => (
        <Badge variant="default">
          {value === 'FRENCH' ? 'Français' : 'Anglais'}
        </Badge>
      )
    },
    { 
      key: 'parentPhone', 
      label: 'Tél. Parent',
      render: (value: string) => (
        <span className="text-gray-600">{value}</span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_: any, student: Student) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={(e) => {
              e?.stopPropagation(); // Correction: Utiliser l'opérateur optional chaining
              navigate(`/students/${student.id}`);
            }}
          >
            Voir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation(); // Correction: Utiliser l'opérateur optional chaining
              navigate(`/students/${student.id}/edit`);
            }}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation(); // Correction: Utiliser l'opérateur optional chaining
              handleDelete(student.id);
            }}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Liste des élèves</h1>
        <Button onClick={() => navigate('/students/create')}>
          Ajouter un élève
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button type="submit">Rechercher</Button>
            {searchTerm && (
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  loadStudents();
                }}
              >
                Effacer
              </Button>
            )}
          </div>
        </form>

        <Table
          data={students}
          columns={columns}
          loading={loading}
          emptyMessage="Aucun élève trouvé"
        />
      </Card>
    </div>
  );
};