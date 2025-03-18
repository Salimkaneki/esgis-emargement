import { useState } from 'react';
import { EmargementFormData, MessageState } from '@/types';

interface EmargementFormProps {
  onSave: (data: EmargementFormData) => void;
}

export default function EmargementForm({ onSave }: EmargementFormProps) {
  const [formData, setFormData] = useState<EmargementFormData>({
    nomProfesseur: '',
    matiere: '',
    filiere: '',
    heureDebut: '',
    heureFin: '',
    site: 'Avédji'
  });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value as any
    });
  };

  const calculateDuration = (): number => {
    if (!formData.heureDebut || !formData.heureFin) return 0;
    
    const [startHour, startMin] = formData.heureDebut.split(':').map(Number);
    const [endHour, endMin] = formData.heureFin.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) return 0;
    
    return (endMinutes - startMinutes) / 60;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation basique
    if (!formData.nomProfesseur || !formData.matiere || !formData.filiere || 
        !formData.heureDebut || !formData.heureFin) {
      setMessage({ text: 'Veuillez remplir tous les champs obligatoires.', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    const duree = calculateDuration();
    if (duree <= 0) {
      setMessage({ text: 'L\'heure de fin doit être postérieure à l\'heure de début.', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    // Simuler un délai de traitement pour une meilleure UX
    setTimeout(() => {
      // Soumission du formulaire
      onSave(formData);
      
      // Réinitialisation du formulaire
      setFormData({
        nomProfesseur: '',
        matiere: '',
        filiere: '',
        heureDebut: '',
        heureFin: '',
        site: 'Avédji'
      });
      
      setMessage({ text: 'Émargement enregistré avec succès.', type: 'success' });
      setIsSubmitting(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }, 600);
  };

  const estimatedDuration = calculateDuration();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
        <h2 className="text-xl font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Formulaire d'Émargement
        </h2>
        <p className="text-blue-100 mt-1 text-sm">Veuillez remplir tous les champs obligatoires</p>
      </div>
      
      {message.text && (
        <div className={`${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
          } px-6 py-4 mx-6 mt-6 rounded-lg border shadow-sm text-sm animate-fadeIn`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nomProfesseur">
              Nom du Professeur <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="nomProfesseur"
                name="nomProfesseur"
                value={formData.nomProfesseur}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                placeholder="Ex: Dr. Kouassi Amani"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="matiere">
              Matière Enseignée <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <input
                type="text"
                id="matiere"
                name="matiere"
                value={formData.matiere}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                placeholder="Ex: Programmation Web"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="filiere">
              Filière <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <input
                type="text"
                id="filiere"
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                placeholder="Ex: Génie Logiciel"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="site">
              Site ESGIS <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <select
                id="site"
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all appearance-none"
                required
              >
                <option value="Avédji">Avédji</option>
                <option value="Adidogomé">Adidogomé</option>
                <option value="Kodjovikopé">Kodjovikopé</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="heureDebut">
              Heure de Début <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="time"
                id="heureDebut"
                name="heureDebut"
                value={formData.heureDebut}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="heureFin">
              Heure de Fin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="time"
                id="heureFin"
                name="heureFin"
                value={formData.heureFin}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                required
              />
            </div>
          </div>
        </div>
        
        {(formData.heureDebut && formData.heureFin && estimatedDuration > 0) && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm">
            <div className="flex items-center text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Durée estimée du cours: <span className="font-semibold">{estimatedDuration.toFixed(2)} heures</span></span>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-sm shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </span>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Enregistrer l'émargement
              </span>
            )}
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            ESGIS Togo — Système de gestion des émargements © {new Date().getFullYear()}
          </p>
        </div>
      </form>
    </div>
  );
}