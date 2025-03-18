'use client';

import { useState, useEffect } from 'react';
import EmargementForm from '@/components/EmargementForm';
import EmargementHistory from '@/components/EmargementHistory';
import SiteStats from '@/components/SiteStats';
import { Emargement, EmargementFormData } from '@/types';

export default function MainContent() {
  const [emargements, setEmargements] = useState<Emargement[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'stats'>('form');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedEmargements = localStorage.getItem('emargements');
    if (storedEmargements) {
      setEmargements(JSON.parse(storedEmargements));
    }

    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-stone-50 min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-stone-200 transition-all duration-300 ease-in-out h-screen fixed lg:static z-30 ${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
                E
              </div>
              <h1 className={`ml-3 font-medium text-stone-800 transition-opacity duration-200 ${!sidebarOpen && 'lg:opacity-0'}`}>
                ESGIS
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-stone-400 hover:text-stone-600 lg:block hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-6 px-3">
            <div className={`mb-4 px-3 ${!sidebarOpen && 'lg:hidden'}`}>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Menu principal</p>
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  className={`flex items-center w-full py-2 px-3 rounded-md transition-colors duration-200 ${
                    activeTab === 'form'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  onClick={() => setActiveTab('form')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className={`ml-3 transition-opacity duration-200 ${!sidebarOpen && 'lg:hidden'}`}>
                    Émargement
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full py-2 px-3 rounded-md transition-colors duration-200 ${
                    activeTab === 'history'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className={`ml-3 transition-opacity duration-200 ${!sidebarOpen && 'lg:hidden'}`}>
                    Historique
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full py-2 px-3 rounded-md transition-colors duration-200 ${
                    activeTab === 'stats'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  onClick={() => setActiveTab('stats')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className={`ml-3 transition-opacity duration-200 ${!sidebarOpen && 'lg:hidden'}`}>
                    Statistiques
                  </span>
                </button>
              </li>
            </ul>
            
            <div className={`mt-8 px-3 ${!sidebarOpen && 'lg:hidden'}`}>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Système</p>
              <ul className="mt-3 space-y-1">
                <li>
                  <button className="flex items-center w-full py-2 px-3 rounded-md text-stone-600 hover:bg-stone-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Paramètres</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center w-full py-2 px-3 rounded-md text-stone-600 hover:bg-stone-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Aide</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          
          {/* User profile */}
          <div className={`mt-auto p-4 border-t border-stone-100 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-stone-700">Administrateur</p>
                <p className="text-xs text-stone-500">Version 1.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 lg:hidden text-stone-500 hover:text-stone-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-stone-800">
              {activeTab === 'form' && 'Nouvel Émargement'}
              {activeTab === 'history' && 'Historique des Émargements'}
              {activeTab === 'stats' && 'Statistiques'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-stone-500 hover:text-stone-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              </button>
            <button className="text-stone-500 hover:text-stone-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="h-6 w-px bg-stone-200"></div>
            <button className="flex items-center text-stone-700 hover:text-stone-900">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                A
              </div>
            </button>
          </div>
        </header>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page title and description */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-stone-900">
                {activeTab === 'form' && 'Nouvel Émargement'}
                {activeTab === 'history' && 'Historique des Émargements'}
                {activeTab === 'stats' && 'Statistiques'}
              </h1>
              <p className="text-stone-500 mt-1">
                {activeTab === 'form' && 'Créez un nouvel enregistrement d\'émargement'}
                {activeTab === 'history' && 'Consultez et recherchez les émargements passés'}
                {activeTab === 'stats' && 'Visualisez les statistiques des émargements'}
              </p>
            </div>

            {/* Content card */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6">
                <div className="transition-all duration-300">
                  {activeTab === 'form' && <EmargementForm onSave={saveEmargement} />}
                  {activeTab === 'history' && <EmargementHistory emargements={emargements} />}
                  {activeTab === 'stats' && <SiteStats emargements={emargements} />}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}