// class types 
export interface Classe {
    id: number;
    nom: string;
    niveau: string;
    enseignantId: number;
    anneeScolaire: string;
    effectif: number;
}

export interface NouvelleClasse {
    nom: string;
    niveau: string;
    enseignantId: number;
    anneeScolaire: string;
}

export interface ModifierClasse {
    nom?: string;
    niveau?: string;
    enseignantId?: number;
    anneeScolaire?: string;
    effectif?: number;
}