// payment types 
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    date: string; // ISO date string
    method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
    status: PaymentStatus;
    reference?: string;
    description?: string;
}

export interface CreatePaymentDto {
    studentId: string;
    amount: number;
    date: string;
    method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
    reference?: string;
    description?: string;
}

export interface UpdatePaymentDto {
    amount?: number;
    date?: string;
    method?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
    status?: PaymentStatus;
    reference?: string;
    description?: string;
}