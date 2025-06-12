// purchase types 
export interface Purchase {
    id: number;
    item: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    purchaseDate: string; // ISO date string
    supplier?: string;
    notes?: string;
}

export type CreatePurchase = Omit<Purchase, 'id' | 'totalPrice'> & {
    totalPrice?: number;
};

export type UpdatePurchase = Partial<Omit<Purchase, 'id'>> & {
    id: number;
};