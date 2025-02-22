import { useState, useEffect } from 'react';
import Head from 'next/head';
import EmargementForm from '@/components/EmargementForm';
import EmargementHistory from '@/components/EmargementHistory';
import SiteStats from '@/components/SiteStats';
import { Emargement, EmargementFormData } from '@/types';

export default function Home() {
  const [emargements, setEmargements] = useState<Emargement[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'stats'>('form');

  useEffect(() => {
    // Chargement des données depuis localStorage au démarrage
    const storedEmargements = localStorage.getItem('emargements');
    if (storedEmargements) {
      setEmargements(JSON.parse(storedEmargements));
    }
  }, []);

  const saveEmargement = (newEmargement: EmargementFormData) => {
    const emargementComplet: Emargement = {
      ...newEmargement,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      duree: calculateDuration(newEmargement.heureDebut, newEmargement.heureFin)
    };
    
    const updatedEmargements = [...emargements, emargementComplet];
    setEmargements(updatedEmargements);
    localStorage.setItem('emargements', JSON.stringify(updatedEmargements));
  };

  const calculateDuration = (heureDebut: string, heureFin: string): number => {
    if (!heureDebut || !heureFin) return 0;
    
    const [startHour, startMin] = heureDebut.split(':').map(Number);
    const [endHour, endMin] = heureFin.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) return 0;
    
    return (endMinutes - startMinutes) / 60;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Head>
        <title>ESGIS - Émargement des Professeurs</title>
        <meta name="description" content="Application d'émargement pour les professeurs d'ESGIS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-800">
          Système d'Émargement ESGIS
        </h1>
      </header>

      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 ${activeTab === 'form' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Nouvel Émargement
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historique
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistiques par Site
        </button>
      </div>

      <main>
        {activeTab === 'form' && <EmargementForm onSave={saveEmargement} />}
        {activeTab === 'history' && <EmargementHistory emargements={emargements} />}
        {activeTab === 'stats' && <SiteStats emargements={emargements} />}
      </main>
    </div>
  );
}