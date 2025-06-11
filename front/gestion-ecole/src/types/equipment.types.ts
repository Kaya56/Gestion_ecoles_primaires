// equipment types 
export type EquipmentCategory = 'Furniture' | 'Electronics' | 'Sports' | 'Books' | 'Other';

export interface Equipment {
    id: string;
    name: string;
    category: EquipmentCategory;
    quantity: number;
    condition: 'New' | 'Good' | 'Fair' | 'Poor';
    location?: string;
    purchaseDate?: Date;
    description?: string;
}