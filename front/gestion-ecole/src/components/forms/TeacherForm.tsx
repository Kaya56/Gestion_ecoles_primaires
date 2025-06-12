import React, { useState } from "react";

// TeacherForm component 
interface TeacherFormProps {
    onSubmit: (teacher: TeacherData) => void;
    initialData?: TeacherData;
}

export interface TeacherData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject?: string;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ onSubmit, initialData }) => {
    const [form, setForm] = useState<TeacherData>({
        firstName: initialData?.firstName || "",
        lastName: initialData?.lastName || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        subject: initialData?.subject || "",
    });

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
                <label>Prénom</label>
                <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Nom</label>
                <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Téléphone</label>
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Matière</label>
                <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Enregistrer</button>
        </form>
    );
};

export default TeacherForm;