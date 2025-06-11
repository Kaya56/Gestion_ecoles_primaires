import React, { useState } from "react";

// ClassForm component 
interface ClassFormProps {
    onSubmit: (data: { name: string; level: string }) => void;
    initialData?: { name: string; level: string };
}

const levels = [
    "CP",
    "CE1",
    "CE2",
    "CM1",
    "CM2"
];

const ClassForm: React.FC<ClassFormProps> = ({ onSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [level, setLevel] = useState(initialData?.level || levels[0]);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Le nom de la classe est requis.");
            return;
        }
        setError("");
        onSubmit({ name, level });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Nom de la classe :
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: Classe A"
                    />
                </label>
            </div>
            <div>
                <label>
                    Niveau :
                    <select value={level} onChange={e => setLevel(e.target.value)}>
                        {levels.map(lvl => (
                            <option key={lvl} value={lvl}>
                                {lvl}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button type="submit">Enregistrer</button>
        </form>
    );
};

export default ClassForm;