export interface Discipline {
  id: number;
  studentId?: number;
  studentName: string;
  type: string;
  incidentDate: string;
  description: string;
  action?: string;
  resolved: boolean;
  createdAt: string;
  reportedBy?: string;
}

export interface DisciplineCreateRequest {
  studentId: number;
  type: string;
  incidentDate: string;
  description: string;
  action?: string;
  reportedBy?: string;
  resolved: boolean;
}