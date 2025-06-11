import React, { useState } from "react";

// PaymentForm component 
interface PaymentFormProps {
    onSubmit: (data: PaymentFormData) => void;
    initialData?: PaymentFormData;
}

export interface PaymentFormData {
    amount: number;
    date: string;
    studentName: string;
    paymentMethod: string;
    notes?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, initialData }) => {
    const [form, setForm] = useState<PaymentFormData>({
        amount: initialData?.amount || 0,
        date: initialData?.date || "",
        studentName: initialData?.studentName || "",
        paymentMethod: initialData?.paymentMethod || "",
        notes: initialData?.notes || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div>
                <label>Nom de l'élève</label>
                <input
                    type="text"
                    name="studentName"
                    value={form.studentName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Montant</label>
                <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    min={0}
                    required
                />
            </div>
            <div>
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Méthode de paiement</label>
                <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    required
                >
                    <option value="">Sélectionner</option>
                    <option value="cash">Espèces</option>
                    <option value="card">Carte</option>
                    <option value="bank">Virement bancaire</option>
                </select>
            </div>
            <div>
                <label>Notes</label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Enregistrer le paiement</button>
        </form>
    );
};

export default PaymentForm;