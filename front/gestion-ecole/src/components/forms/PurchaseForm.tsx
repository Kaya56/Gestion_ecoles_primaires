import React, { useState } from "react";

// PurchaseForm component 
interface PurchaseFormProps {
    onSubmit: (data: PurchaseFormData) => void;
}

export interface PurchaseFormData {
    item: string;
    quantity: number;
    price: number;
    date: string;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit }) => {
    const [form, setForm] = useState<PurchaseFormData>({
        item: "",
        quantity: 1,
        price: 0,
        date: new Date().toISOString().slice(0, 10),
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "price" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
        setForm({
            item: "",
            quantity: 1,
            price: 0,
            date: new Date().toISOString().slice(0, 10),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Article :</label>
                <input
                    type="text"
                    name="item"
                    value={form.item}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Quantité :</label>
                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    min={1}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Prix :</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    min={0}
                    step={0.01}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Date :</label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Enregistrer l'achat</button>
        </form>
    );
};

export default PurchaseForm;