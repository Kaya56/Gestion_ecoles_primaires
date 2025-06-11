import React, { useState } from "react";
import type { FormEvent } from "react";

// SubjectForm component 
interface SubjectFormProps {
    onSubmit: (data: { name: string; description: string }) => void;
    initialData?: { name: string; description: string };
    submitLabel?: string;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
    onSubmit,
    initialData = { name: "", description: "" },
    submitLabel = "Enregistrer",
}) => {
    const [name, setName] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    return (
        <form onSubmit={handleSubmit} className="subject-form">
            <div>
                <label htmlFor="subject-name">Nom de la matière</label>
                <input
                    id="subject-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="subject-description">Description</label>
                <textarea
                    id="subject-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            <button type="submit">{submitLabel}</button>
        </form>
    );
};

export default SubjectForm;