import { ref, Ref } from 'vue';

// Interfacce per i dati
interface Posizione {
  latitudine: number;
  longitudine: number;
}

interface Post {
  _id: string;
  contenuto: string | null;
  descrizione: string;
  posizione: Posizione;
  utente_id: string;
}

interface Event {
  _id: string;
  nome: string;
  descrizione: string;
  posizione: Posizione;
  Organizzatore: string;
}

interface Party {
  _id: string;
  nome: string;
  descrizione: string;
  posizione: Posizione;
  Organizzatore: string;
}

interface Textual {
  post: Post;
  utente: {
    _id: string;
    username: string;
  };
}

// Funzione principale per estrarre i dati
export async function estraiDati(lat: number, lng: number, rad: number) {
  const posts: Ref<Post[]> = ref([]);
  const eventi: Ref<Event[]> = ref([]);
  const textuals: Ref<Textual[]> = ref([]);
  const parties: Ref<Party[]> = ref([]);

  try {
    // Utilizzo di Promise.all per eseguire le richieste simultaneamente
    await Promise.all([
      estraiPostDaFile(lat, lng, rad, posts, textuals),
      estraiEventiDaFile(lat, lng, rad, eventi),
      estraiPartyDaFile(lat, lng, rad, parties),
    ]);

    // Restituisce i dati estratti
    return {
      posts: posts.value,
      textuals: textuals.value,
      eventi: eventi.value,
      parties: parties.value,
    };
  } catch (error) {
    console.error("Errore durante l'estrazione dei dati:", error);
    return {
      posts: [],
      textuals: [],
      eventi: [],
      parties: [],
    };
  }
}

// Funzione per estrarre i post dal file
async function estraiPostDaFile(
  lat: number,
  lng: number,
  rad: number,
  posts: Ref<Post[]>,
  textuals: Ref<Textual[]>
): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3000/api/Post/all`);
    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Filtro i post in base alla distanza dalla posizione
    data.forEach((post: Post) => {
      const distanza = calcolaDistanza(lat, lng, post.posizione.latitudine, post.posizione.longitudine);
      if (distanza <= rad) {
        posts.value.push(post);

        // Aggiunge anche i post per la sezione "textuals"
        if (post.contenuto === null) {
          textuals.value.push({ post, utente: { _id: post.utente_id, username: "Utente" } });
        }
      }
    });
  } catch (error) {
    console.error("Errore durante l'estrazione dei post:", error);
  }
}

// Funzione per estrarre gli eventi dal file
async function estraiEventiDaFile(lat: number, lng: number, rad: number, eventi: Ref<Event[]>): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3000/api/Eventi/all`);
    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Filtro gli eventi in base alla distanza dalla posizione
    data.forEach((evento: Event) => {
      const distanza = calcolaDistanza(lat, lng, evento.posizione.latitudine, evento.posizione.longitudine);
      if (distanza <= rad) {
        eventi.value.push(evento);
      }
    });
  } catch (error) {
    console.error("Errore durante l'estrazione degli eventi:", error);
  }
}

// Funzione per estrarre i party dal file
async function estraiPartyDaFile(lat: number, lng: number, rad: number, parties: Ref<Party[]>): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3000/api/Party/all`);
    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Filtro i party in base alla distanza dalla posizione
    data.forEach((party: Party) => {
      const distanza = calcolaDistanza(lat, lng, party.posizione.latitudine, party.posizione.longitudine);
      if (distanza <= rad) {
        parties.value.push(party);
      }
    });
  } catch (error) {
    console.error("Errore durante l'estrazione dei party:", error);
  }
}

// Funzione di supporto per calcolare la distanza tra due punti (in km)
function calcolaDistanza(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Raggio della Terra in km
  const φ1 = lat1 * (Math.PI / 180); // Converte in radianti
  const φ2 = lat2 * (Math.PI / 180); // Converte in radianti
  const Δφ = (lat2 - lat1) * (Math.PI / 180); // Differenza di latitudine in radianti
  const Δλ = (lng2 - lng1) * (Math.PI / 180); // Differenza di longitudine in radianti

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distanza in km
}
