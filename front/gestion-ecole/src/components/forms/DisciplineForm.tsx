import React, { useState } from "react";
import type { FormEvent } from "react";

// DisciplineForm component 
interface DisciplineFormProps {
    onSubmit: (data: { nom: string; description: string }) => void;
    initialData?: { nom: string; description: string };
}

const DisciplineForm: React.FC<DisciplineFormProps> = ({ onSubmit, initialData }) => {
    const [nom, setNom] = useState(initialData?.nom || "");
    const [description, setDescription] = useState(initialData?.description || "");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ nom, description });
        setNom("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nom">Nom de la discipline</label>
                <input
                    id="nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Enregistrer</button>
        </form>
    );
};

export default DisciplineForm;