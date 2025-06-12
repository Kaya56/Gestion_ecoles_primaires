import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Discipline } from '../../types/discipline.types';
import { getDisciplines, deleteDiscipline } from '../../services/discipline.service';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import  Pagination  from '../../components/common/Pagination';
import  Loading  from '../../components/common/Loading';

interface DisciplineResponse {
  content: Discipline[] | undefined;
  totalPages: number;
}

const DisciplineList: React.FC = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisciplines();
  }, [currentPage, searchTerm]);

  const fetchDisciplines = async () => {
    setLoading(true);
    try {
      const response = (await getDisciplines({
        page: currentPage,
        size: 10,
        search: searchTerm,
      })) as DisciplineResponse;
      setDisciplines(response.content ?? []);
      setTotalPages(response.totalPages ?? 1);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      alert('Erreur lors du chargement des disciplines');
      setDisciplines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet incident ?')) {
      try {
        await deleteDiscipline(id);
        alert('Incident supprimé avec succès');
        fetchDisciplines();
      } catch (error) {
        console.error('Error deleting discipline:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const columns = [
    { key: 'studentName', label: 'Étudiant' },
    { key: 'type', label: 'Type' },
    {
      key: 'incidentDate',
      label: 'Date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'resolved',
      label: 'Résolu',
      render: (resolved: boolean) => resolved ? 'Oui' : 'Non',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Discipline) => (
        <div className="flex space-x-2">
          <Button variant="primary" onClick={() => navigate(`/disciplines/${row.id}`)}>
            Voir
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/disciplines/${row.id}/edit`)}>
            Modifier
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Disciplines</h1>
        <Button onClick={() => navigate('/disciplines/create')} variant="primary">
          Nouvel Incident
        </Button>
      </div>
      <SearchBar
        value={searchTerm}
        onSearch={handleSearchChange}
        placeholder="Rechercher par nom d'étudiant..."
        className="mb-6"
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <Table data={disciplines ?? []} columns={columns} emptyMessage="Aucun incident disciplinaire trouvé" />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default DisciplineList;