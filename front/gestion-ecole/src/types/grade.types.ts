// grade types 
export interface Grade {
    id: number;
    name: string;
    level: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateGradeDto = Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateGradeDto = Partial<CreateGradeDto>;