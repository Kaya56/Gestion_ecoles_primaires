// types/student.types.ts
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  section: 'PRIMARY' | 'SECONDARY';
  language: 'FRENCH' | 'ENGLISH';
  classId?: number;
  parentName: string;
  parentPhone: string;
  address: string;
  enrollmentDate: string;
}

export interface StudentCreateRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  section: 'PRIMARY' | 'SECONDARY';
  language: 'FRENCH' | 'ENGLISH';
  parentName: string;
  parentPhone: string;
  address: string;
}

export interface StudentUpdateRequest extends StudentCreateRequest {
  id: number;
}