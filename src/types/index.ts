// types/index.ts

export interface EmargementFormData {
  nomProfesseur: string;
  matiere: string;
  filiere: string;
  heureDebut: string;
  heureFin: string;
  site: string;
}

export interface Emargement extends EmargementFormData {
  id: number;
  timestamp: string;
  duree: number;
}

export interface MessageState {
  text: string;
  type: string;
}

export interface SiteStats {
  hebdomadaires: Record<string, number>;
  totaux: Record<string, number>;
}