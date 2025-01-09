const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

export interface userData {
  username: string;
  profileImage: string;
}

export const getUser = async (id: string): Promise<userData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Utenti/${id}`);
    if (!response.ok) {
      throw new Error('Utente non trovato');
    }
    const userdata = await response.json();
    if (userdata && userdata.user && userdata.user.username && userdata.user.foto_profilo) {
      return {
        username: userdata.user.username,
        profileImage: userdata.user.foto_profilo,
      };
    } else {
      throw new Error('Dati utente non validi');
    }
  } catch (error: any) {
    console.error('Errore durante il recupero dell\'utente:', error.message);
    return null;
  }
};
