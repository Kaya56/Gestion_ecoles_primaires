// discipline types 
export interface Discipline {
    id: number;
    nom: string;
    description?: string;
    coefficient?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateDisciplineDto = Omit<Discipline, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateDisciplineDto = Partial<CreateDisciplineDto>;