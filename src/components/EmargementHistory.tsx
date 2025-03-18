import { useState } from 'react';
import { Emargement } from '@/types';

interface EmargementHistoryProps {
  emargements: Emargement[];
}

export default function EmargementHistory({ emargements }: EmargementHistoryProps) {
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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
  
  // Pagination
  const totalPages = Math.ceil(sortedEmargements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmargements = sortedEmargements.slice(startIndex, startIndex + itemsPerPage);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calcul du total des heures
  const totalHeures = sortedEmargements.reduce((total, emargement) => total + emargement.duree, 0);
  
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historique des Émargements
        </h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-3 py-2 pl-9 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div>
            <select 
              className="px-3 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm transition-colors"
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
        
        <div className="flex justify-between items-center text-sm mb-4">
          <div className="text-gray-600">
            <span className="font-medium">{sortedEmargements.length}</span> émargements trouvés
          </div>
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total : <span className="font-medium ml-1">{totalHeures.toFixed(2)}h</span>
          </div>
        </div>
        
        {sortedEmargements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base">Aucun émargement trouvé</p>
            <p className="text-xs mt-1 text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Date</th>
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Professeur</th>
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Matière</th>
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Filière</th>
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Site</th>
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Horaire</th>
                    <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedEmargements.map((emargement) => {
                    const date = new Date(emargement.timestamp);
                    const formattedDate = date.toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    const formattedTime = date.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <tr 
                        key={emargement.id} 
                        className="hover:bg-gray-50 text-sm"
                      >
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-800">{formattedDate}</div>
                          <div className="text-xs text-gray-500">{formattedTime}</div>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">{emargement.nomProfesseur}</td>
                        <td className="px-6 py-3 text-gray-600">{emargement.matiere}</td>
                        <td className="px-6 py-3 text-gray-600">{emargement.filiere}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            emargement.site === 'Avédji' ? 'bg-blue-50 text-blue-700' :
                            emargement.site === 'Adidogomé' ? 'bg-green-50 text-green-700' :
                            'bg-purple-50 text-purple-700'
                          }`}>
                            {emargement.site}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-gray-600">
                            {emargement.heureDebut}
                            <span className="mx-1 text-gray-400">→</span>
                            {emargement.heureFin}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">{emargement.duree.toFixed(2)}h</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
                <div>
                  Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedEmargements.length)} sur {sortedEmargements.length}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1 rounded ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    // Afficher seulement les 5 pages autour de la page courante
                    if (
                      i === 0 || // Première page
                      i === totalPages - 1 || // Dernière page
                      (i >= currentPage - 2 && i <= currentPage + 2) // Pages autour de la page courante
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => goToPage(i + 1)}
                          className={`w-6 h-6 flex items-center justify-center rounded ${
                            currentPage === i + 1
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (
                      (i === currentPage - 3 && currentPage > 3) ||
                      (i === currentPage + 3 && currentPage < totalPages - 3)
                    ) {
                      // Afficher des points de suspension
                      return (
                        <span key={i} className="w-6 h-6 flex items-center justify-center">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}