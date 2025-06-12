// teacher types 
export interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    hireDate: string; // ISO date string
    isActive: boolean;
}

export type CreateTeacherDto = Omit<Teacher, 'id' | 'isActive'>;

export type UpdateTeacherDto = Partial<Omit<Teacher, 'id'>>;