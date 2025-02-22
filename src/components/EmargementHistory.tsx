import { useState } from 'react';
import { Emargement } from '@/types';

interface EmargementHistoryProps {
  emargements: Emargement[];
}

export default function EmargementHistory({ emargements }: EmargementHistoryProps) {
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('');
  
  // Filtrage des émargements
  const filteredEmargements = emargements.filter(item => {
    const matchesSearch = search === '' || 
      item.nomProfesseur.toLowerCase().includes(search.toLowerCase()) || 
      item.matiere.toLowerCase().includes(search.toLowerCase()) ||
      item.filiere.toLowerCase().includes(search.toLowerCase());
    
    const matchesSite = filterSite === '' || item.site === filterSite;
    
    return matchesSearch && matchesSite;
  });
  
  // Trier par date (plus récent d'abord)
  const sortedEmargements = [...filteredEmargements].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Historique des Émargements</h2>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full px-3 py-2 border rounded-md"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div>
          <select 
            className="px-3 py-2 border rounded-md"
            value={filterSite}
            onChange={e => setFilterSite(e.target.value)}
          >
            <option value="">Tous les sites</option>
            <option value="Avédji">Avédji</option>
            <option value="Adidogomé">Adidogomé</option>
            <option value="Kodjovikopé">Kodjovikopé</option>
          </select>
        </div>
      </div>
      
      {sortedEmargements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun émargement trouvé.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">Date</th>
                <th className="p-2 text-left border">Professeur</th>
                <th className="p-2 text-left border">Matière</th>
                <th className="p-2 text-left border">Filière</th>
                <th className="p-2 text-left border">Site</th>
                <th className="p-2 text-left border">Horaire</th>
                <th className="p-2 text-left border">Durée</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmargements.map(emargement => {
                const date = new Date(emargement.timestamp);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                return (
                  <tr key={emargement.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{formattedDate}</td>
                    <td className="p-2 border">{emargement.nomProfesseur}</td>
                    <td className="p-2 border">{emargement.matiere}</td>
                    <td className="p-2 border">{emargement.filiere}</td>
                    <td className="p-2 border">{emargement.site}</td>
                    <td className="p-2 border">{emargement.heureDebut} - {emargement.heureFin}</td>
                    <td className="p-2 border">{emargement.duree.toFixed(2)}h</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}