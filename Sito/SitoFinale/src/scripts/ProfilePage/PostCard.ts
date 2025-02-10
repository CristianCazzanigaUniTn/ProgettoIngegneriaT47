const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

export interface Post {
  id: string;  // ID del post
  title: string;  // Titolo del post
  description: string;  // Descrizione del post
  image: string;  // URL dell'immagine del post
}

export interface Event {
  id: string;  // ID dell'evento
  name: string;  // Nome dell'evento
  date: string;  // Data dell'evento
  image: string;  // URL immagine dell'evento
}

export interface Party {
  id: string;  // ID del party
  name: string;  // Nome del party
  description: string;  // Descrizione del party
  image: string;  // URL immagine del party
}

export const getEvents = async (id: string): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/eventi/organizzatore/${id}`);
    
    if (!response.ok) {
      throw new Error('Eventi non trovati');
    }

    const eventData = await response.json();

    // Controlla se la risposta è un array diretto
    if (!Array.isArray(eventData)) {
      throw new Error('La risposta non contiene un array di eventi');
    }

    // Mappa i dati in un formato utilizzabile
    return eventData.map((event: any) => ({
      id: event._id,
      name: event.nome || "Evento dinamico",
      date: event.data_creazione || "Data non disponibile",
      image: event.foto || "/image/default-event.png",
      description: event.descrizione || "Nessuna descrizione disponibile",
      location: event.luogo || "Luogo non specificato",
    }));
  } catch (error: any) {
    return [];
  }
};

export const getParty = async (id: string): Promise<Party[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/party/organizzatore/${id}`);

    if (!response.ok) {
      throw new Error('Party non trovati');
    }

    const partyData = await response.json();

    // Controlla se la risposta è un array diretto
    if (!Array.isArray(partyData)) {
      throw new Error('La risposta non contiene un array di party');
    }

    // Mappa i dati in un formato utilizzabile
    return partyData.map((party: any) => ({
      id: party._id,
      name: party.nome || "Party dinamico",
      description: party.descrizione || "Descrizione dinamica",
      image: party.foto || "/image/default-party.png",
      location: party.luogo || "Luogo non specificato",
      date: party.data_creazione || "Data non disponibile",
    }));
  } catch (error: any) {
    return [];
  }
};

export const getPost = async (id: string): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/post/${id}`);

    if (!response.ok) {
      throw new Error('Post non trovati');
    }

    const postData = await response.json();

    if (!postData.posts || !Array.isArray(postData.posts)) {
      throw new Error('La risposta non contiene un array di post');
    }
    return postData.posts 
      .filter((post: any) => post.contenuto !== "null") 
      .map((post: any) => ({
        id: post.id,  
        title: post.luogo || "Titolo dinamico",  
        description: post.descrizione || "Descrizione dinamica",  
        image: post.contenuto || "/image/default-image.png", 
      }));
  } catch (error: any) {
    return [];  
  }
};
