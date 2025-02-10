const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

// Definizione del tipo per la card
export interface Posted {
    id: string;
    profileName: string;
    profileImage: string;
    postImage: string;
    description: string;
    dataIndex: string;
    latitudine: number;
    longitudine: number;
    dataType: 'post' | 'textual' | 'party' | 'evento'; // Aggiungiamo 'party' ed 'evento'
}


// Funzione per estrarre i dati dalle API
export async function estraiDati(lat: number, lng: number, rad: number): Promise<Posted[]> {
    const posts: Posted[] = [];
    const eventi: Posted[] = [];
    const textuals: Posted[] = [];
    const parties: Posted[] = [];

    try {
        // Recupera i post, eventi, party
        await Promise.all([
            estraiPostDaFile(lat, lng, rad, posts, textuals),
            estraiEventiDaFile(lat, lng, rad, eventi),
            estraiPartyDaFile(lat, lng, rad, parties),
        ]);

        // Combina tutti i dati estratti in un'unica lista
        return [...posts, ...eventi, ...parties, ...textuals];
    } catch (error) {
        return [];
    }
}

// Funzione per estrarre i party
// Funzione per estrarre i party
async function estraiPartyDaFile(lat: number, lng: number, rad: number, parties: Posted[]) {
    try {
        const payload = { lat, lng, rad };
        const response = await fetch(`${API_BASE_URL}/api/party/ricerca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        for (const party of data) {
            const utente = await estraiUtente(party.Organizzatore); 
            parties.push({
                id: utente.user.id,
                profileName: utente.user.username,
                profileImage: utente.user.foto_profilo,
                postImage: party.foto || 'https://via.placeholder.com/150',
                description: party.descrizione,
                dataIndex: party._id,
                latitudine: party.posizione.latitudine,
                longitudine: party.posizione.longitudine,
                dataType: 'party', // Cambiato da 'post' a 'party'
            });
        }
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}


// Funzione per estrarre i post
async function estraiPostDaFile(lat: number, lng: number, rad: number, posts: Posted[], textuals: Posted[]) {
    try {
        const payload = { lat, lng, rad };
        const response = await fetch(`${API_BASE_URL}/api/Post/ricerca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        for (const post of data) {
            const utente = await estraiUtente(post.utente_id); // Aggiungi informazioni sull'utente
            if (post.contenuto !== 'null') {
                posts.push({
                    id: utente.user.id,
                    profileName: utente.user.username,
                    profileImage: utente.user.foto_profilo,
                    postImage: post.contenuto || '', // Se esiste una foto del post, aggiungila
                    description: post.descrizione,
                    dataIndex: post._id,
                    latitudine: post.posizione.latitudine,
                    longitudine: post.posizione.longitudine,
                    dataType: 'post'
                });
            } else {
                textuals.push({
                    id: utente.user.id,
                    profileName: utente.user.username,
                    profileImage: utente.user.foto_profilo,
                    postImage: '',
                    description: post.descrizione,
                    dataIndex: post._id,
                    latitudine: post.posizione.latitudine,
                    longitudine: post.posizione.longitudine,
                    dataType: 'textual'
                });
            }
        }
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}

// Funzione per estrarre gli eventi
async function estraiEventiDaFile(lat: number, lng: number, rad: number, eventi: Posted[]) {
    try {
        const payload = { lat, lng, rad };
        const response = await fetch(`${API_BASE_URL}/api/eventi/ricerca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        for (const evento of data) {
            const utente = await estraiUtente(evento.Organizzatore); 
            eventi.push({
                id: utente.user.id,
                profileName: utente.user.username,
                profileImage: utente.user.foto_profilo,
                postImage: evento.foto || 'https://via.placeholder.com/150',
                description: evento.descrizione,
                dataIndex: evento._id,
                latitudine: evento.posizione.latitudine,
                longitudine: evento.posizione.longitudine,
                dataType: 'evento' // Cambiato da 'post' a 'evento'
            });
        }
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}

// Funzione per estrarre informazioni sull'utente (supponendo che esista un'API per gli utenti)
async function estraiUtente(userId: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/utenti/${userId}`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero dell'utente: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        return { nome: 'Nome Utente', foto_profilo: 'https://via.placeholder.com/150' }; // Valori di fallback
    }
}

export async function verificaUtente(token:any) {
    try {
        const tokenen = encodeURIComponent(token);
        console.log(`http://localhost:3000/verify?token=${tokenen}`)
        const response = await fetch(`http://localhost:3000/verify?token=${tokenen}`);

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore nella verifica: " + error);
    }
    
}