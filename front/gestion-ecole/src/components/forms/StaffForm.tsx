import React, { useState } from "react";

// StaffForm component 
interface StaffFormProps {
    onSubmit: (data: StaffFormData) => void;
    initialData?: StaffFormData;
}

export interface StaffFormData {
    nom: string;
    prenom: string;
    poste: string;
    email: string;
    telephone: string;
}

const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, initialData }) => {
    const [form, setForm] = useState<StaffFormData>(
        initialData || {
            nom: "",
            prenom: "",
            poste: "",
            email: "",
            telephone: "",
        }
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom:</label>
                <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Prénom:</label>
                <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Poste:</label>
                <input
                    type="text"
                    name="poste"
                    value={form.poste}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Téléphone:</label>
                <input
                    type="tel"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Enregistrer</button>
        </form>
    );
};

export default StaffForm;