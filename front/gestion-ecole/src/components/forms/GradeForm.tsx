import React, { useState } from 'react';
import type { FormEvent } from 'react';

// GradeForm component 
interface GradeFormProps {
    initialData?: {
        name: string;
        description?: string;
    };
    onSubmit: (data: { name: string; description?: string }) => void;
    onCancel?: () => void;
}

const GradeForm: React.FC<GradeFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Le nom de la classe est requis.');
            return;
        }
        setError(null);
        onSubmit({ name: name.trim(), description: description.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="grade-form">
            <div>
                <label htmlFor="grade-name">Nom de la classe *</label>
                <input
                    id="grade-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="grade-description">Description</label>
                <textarea
                    id="grade-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            {error && <div className="error">{error}</div>}
            <div style={{ marginTop: 16 }}>
                <button type="submit">Enregistrer</button>
                {onCancel && (
                    <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
};

export default GradeForm;