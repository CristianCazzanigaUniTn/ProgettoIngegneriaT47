import { ref } from 'https://unpkg.com/vue@3.3.4/dist/vue.esm-browser.js';

export async function estraiDati(lat, lng, rad) {
    const posts = ref([]);
    const eventi = ref([]);
    const textuals = ref([]);
    const parties = ref([]);

    try {
        await Promise.all([
            estraiPostDaFile(lat, lng, rad, posts, textuals),
            estraiEventiDaFile(lat, lng, rad, eventi),
            estraiPartyDaFile(lat, lng, rad, parties),
        ]);

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

async function estraiUtente(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/Utenti/${id}`);

        if (response.status === 404) {
            console.warn("Nessun utente trovato.");
            return null;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const ut = await response.json();

        return ut.user;

    } catch (error) {
        console.error("Errore durante l'estrazione dell'utente:", error);
        return null;
    }
}

async function estraiPartyDaFile(lat, lng, rad, parties) {
    try {
        const payload = { lat, lng, rad };

        const response = await fetch('http://localhost:3000/api/party/ricerca', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            console.warn("Nessun party trovato.");
            parties.value = [];
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const temp = await response.json();

        // Itera su tutti i party e aggiungi l'utente
        for (const party of temp) {
            const utente = await estraiUtente(party.Organizzatore); // Assicurati che l'utente sia caricato
            parties.value.push({ party, utente });
        }

    } catch (error) {
        console.error("Errore durante l'estrazione dei party:", error);
        parties.value = [];
    }
}

async function estraiPostDaFile(lat, lng, rad, posts, textuals) {
    try {
        const payload = { lat, lng, rad };

        const response = await fetch('http://localhost:3000/api/Post/ricerca', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            console.warn("Nessun post trovato.");
            posts.value = [];
            textuals.value = [];
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Itera su tutti i post e aggiungi l'utente
        for (const post of data) {
            const utente = await estraiUtente(post.utente_id); // Assicurati che l'utente sia caricato
            if (post.contenuto != "null") {
                posts.value.push({ post, utente });
            } else {
                textuals.value.push({ post, utente });
            }
        }

    } catch (error) {
        console.error("Errore durante l'estrazione dei post:", error);
        posts.value = [];
        textuals.value = [];
    }
}

async function estraiEventiDaFile(lat, lng, rad, eventi) {
    try {
        const payload = { lat, lng, rad };

        const response = await fetch('http://localhost:3000/api/eventi/ricerca', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            console.warn("Nessun evento trovato.");
            eventi.value = [];
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const temp = await response.json();

        // Itera su tutti gli eventi e aggiungi l'utente
        for (const evento of temp) {
            const utente = await estraiUtente(evento.Organizzatore); // Assicurati che l'utente sia caricato
            eventi.value.push({ evento, utente });
        }
        
    } catch (error) {
        console.error("Errore durante l'estrazione degli eventi:", error);
        eventi.value = [];
    }
}
