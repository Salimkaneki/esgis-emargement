import { useEffect, useState } from 'react';
import { Emargement, SiteStats as SiteStatsType } from '@/types';

interface SiteStatsProps {
  emargements: Emargement[];
}

export default function SiteStats({ emargements }: SiteStatsProps) {
  const [stats, setStats] = useState<SiteStatsType>({
    hebdomadaires: {},
    totaux: {}
  });
  
  useEffect(() => {
    // Fonction pour calculer les statistiques
    const calculerStats = () => {
      // Initialiser les compteurs par site
      const sites = ['Avédji', 'Adidogomé', 'Kodjovikopé'];
      const statsHebdo: Record<string, number> = {};
      const statsTotaux: Record<string, number> = {};
      
      sites.forEach(site => {
        statsHebdo[site] = 0;
        statsTotaux[site] = 0;
      });
      
      // Calculer les heures hebdomadaires (derniers 7 jours)
      const dateActuelle = new Date();
      const debutSemaine = new Date(dateActuelle);
      debutSemaine.setDate(dateActuelle.getDate() - 7);
      
      emargements.forEach(emargement => {
        const dateEmargement = new Date(emargement.timestamp);
        const site = emargement.site;
        
        // Ajouter au total pour ce site
        statsTotaux[site] += emargement.duree;
        
        // Vérifier si dans la semaine en cours
        if (dateEmargement >= debutSemaine) {
          statsHebdo[site] += emargement.duree;
        }
      });
      
      // Mettre à jour l'état
      setStats({
        hebdomadaires: statsHebdo,
        totaux: statsTotaux
      });
    };
    
    calculerStats();
  }, [emargements]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Statistiques par Site</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-lg mb-3">Cumul Hebdomadaire</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(stats.hebdomadaires).map(([site, heures]) => (
              <div key={`hebdo-${site}`} className="border p-4 rounded-md">
                <div className="font-medium text-gray-700">{site}</div>
                <div className="text-2xl font-bold text-blue-600">{heures.toFixed(2)}h</div>
                <div className="mt-2 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-3" 
                    style={{ width: `${Math.min(100, (heures / 40) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((heures / 40) * 100).toFixed(1)}% de l'objectif hebdomadaire
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-3">Cumul Total</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(stats.totaux).map(([site, heures]) => (
              <div key={`total-${site}`} className="border p-4 rounded-md">
                <div className="font-medium text-gray-700">{site}</div>
                <div className="text-2xl font-bold text-green-600">{heures.toFixed(2)}h</div>
                <div className="text-sm text-gray-500 mt-1">
                  Depuis le début de l'utilisation
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-medium text-lg mb-3">Répartition des Heures par Site</h3>
        <div className="h-16 bg-gray-100 rounded-md overflow-hidden flex">
          {Object.entries(stats.totaux).map(([site, heures], index) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
            const total = Object.values(stats.totaux).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? (heures / total) * 100 : 0;
            
            return (
              <div 
                key={`chart-${site}`}
                className={`${colors[index]} h-full`}
                style={{ width: `${percentage}%` }}
                title={`${site}: ${heures.toFixed(2)}h (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
        <div className="flex justify-center mt-2">
          {Object.entries(stats.totaux).map(([site, heures], index) => {
            const colors = ['text-blue-500', 'text-green-500', 'text-purple-500'];
            const total = Object.values(stats.totaux).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? (heures / total) * 100 : 0;
            
            return (
              <div key={`legend-${site}`} className="flex items-center mx-2">
                <div className={`w-3 h-3 ${colors[index].replace('text', 'bg')} rounded-full mr-1`}></div>
                <span className="text-sm">{site} ({percentage.toFixed(1)}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}