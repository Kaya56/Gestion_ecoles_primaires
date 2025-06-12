// staff types 
export interface Staff {
    id: number;
    firstName: string;
    lastName: string;
    role: StaffRole;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    hireDate: string;
    isActive: boolean;
}

export type StaffRole = 'DIRECTOR' | 'TEACHER' | 'ADMIN' | 'OTHER';