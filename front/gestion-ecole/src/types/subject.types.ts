// subject types 
export interface Subject {
    id: number;
    name: string;
    code: string;
    description?: string;
    coefficient?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateSubjectDto = Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSubjectDto = Partial<Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>> & { id: number };