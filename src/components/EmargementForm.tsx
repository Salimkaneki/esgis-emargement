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
    
    // Validation basique
    if (!formData.nomProfesseur || !formData.matiere || !formData.filiere || 
        !formData.heureDebut || !formData.heureFin) {
      setMessage({ text: 'Veuillez remplir tous les champs obligatoires.', type: 'error' });
      return;
    }
    
    const duree = calculateDuration();
    if (duree <= 0) {
      setMessage({ text: 'L\'heure de fin doit être postérieure à l\'heure de début.', type: 'error' });
      return;
    }
    
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
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Formulaire d'Émargement</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="nomProfesseur">
              Nom du Professeur *
            </label>
            <input
              type="text"
              id="nomProfesseur"
              name="nomProfesseur"
              value={formData.nomProfesseur}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="matiere">
              Matière Enseignée *
            </label>
            <input
              type="text"
              id="matiere"
              name="matiere"
              value={formData.matiere}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="filiere">
              Filière *
            </label>
            <input
              type="text"
              id="filiere"
              name="filiere"
              value={formData.filiere}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="site">
              Site ESGIS *
            </label>
            <select
              id="site"
              name="site"
              value={formData.site}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="Avédji">Avédji</option>
              <option value="Adidogomé">Adidogomé</option>
              <option value="Kodjovikopé">Kodjovikopé</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="heureDebut">
              Heure de Début *
            </label>
            <input
              type="time"
              id="heureDebut"
              name="heureDebut"
              value={formData.heureDebut}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="heureFin">
              Heure de Fin *
            </label>
            <input
              type="time"
              id="heureFin"
              name="heureFin"
              value={formData.heureFin}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}