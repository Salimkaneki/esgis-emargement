import { Emargement, EmargementFormData } from '@/types';

// Calcule la durée entre deux heures au format HH:MM
export const calculateDuration = (heureDebut: string, heureFin: string): number => {
  if (!heureDebut || !heureFin) return 0;
  
  const [startHour, startMin] = heureDebut.split(':').map(Number);
  const [endHour, endMin] = heureFin.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  if (endMinutes <= startMinutes) return 0;
  
  return (endMinutes - startMinutes) / 60;
};

// Sauvegarde les données dans le localStorage
export const saveToLocalStorage = (key: string, data: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Récupère les données du localStorage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  const stored = localStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
    return defaultValue;
  }
};

// Crée un émargement complet à partir des données du formulaire
export const createEmargement = (formData: EmargementFormData): Emargement => {
  return {
    ...formData,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    duree: calculateDuration(formData.heureDebut, formData.heureFin)
  };
};

// Calcule les statistiques par site
export const calculateSiteStats = (emargements: Emargement[]) => {
  const sites = ['Avédji', 'Adidogomé', 'Kodjovikopé'];
  const statsHebdo: Record<string, number> = {};
  const statsTotaux: Record<string, number> = {};
  
  sites.forEach(site => {
    statsHebdo[site] = 0;
    statsTotaux[site] = 0;
  });
  
  // Période hebdomadaire (7 derniers jours)
  const dateActuelle = new Date();
  const debutSemaine = new Date(dateActuelle);
  debutSemaine.setDate(dateActuelle.getDate() - 7);
  
  emargements.forEach(emargement => {
    const dateEmargement = new Date(emargement.timestamp);
    const site = emargement.site;
    
    // Cumul total
    statsTotaux[site] += emargement.duree;
    
    // Cumul hebdomadaire
    if (dateEmargement >= debutSemaine) {
      statsHebdo[site] += emargement.duree;
    }
  });
  
  return {
    hebdomadaires: statsHebdo,
    totaux: statsTotaux
  };
};