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

async function estraiLikeAiCommenti(id) {
    try {
        const l = await fetch(`http://localhost:3000/api/commenti/${id}/like`);

        if (f.status === 404) {
            return 0;
        }

        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`);
        }
        
        const likes = await l.json();

        return likes.lenght;
        
    } catch (error){
        console.error("Errore durante l'estrazione dei like:", error);
        return null;
    }
}


async function estraiInformazioniPost(id) {
    const like = [];
    const commento_like = [];
    const res = { like, commento_like};
    
    try {
        const l = await fetch(`http://localhost:3000/api/like/post/${id}`);
        const c = await fetch(`http://localhost:3000/api/commenti/post/${id}`);

        if (l.status === 404) {
            console.warn("Nessuna like trovato.");
        }

        if (!l.ok) {
            throw new Error(`Errore nella richiesta: ${l.status} ${l.statusText}`);
        }

        if (c.status === 404) {
            console.warn("Nessun commento trovato.");
        }

        if (!c.ok) {
            throw new Error(`Errore nella richiesta: ${c.status} ${c.statusText}`);
        }

        const likes = await l.json();
        var ut, utUsername, utId;

        likes.forEach(like => {
            ut = estraiUtente(like.utente_id);
            utUsername = ut.username;
            utId = ut._id;
            like.push({utId, utUsername});
        });

        const commenti = await c.json();
        var nlike, testocommento;

        commenti.forEach(commento => {
            ut = estraiUtente(commento.utente_id);
            utUsername = ut.username;
            utId = ut._id;
            nlike = estraiLikeAiCommenti(commento.utente_id);
            testocommento = commento.commento;
            commento_like.push({ utId, utUsername, testocommento, nlike });
        });

        return res;

    } catch (error) {
        console.error("Errore durante l'estrazione degli eventi:", error);
        return res;
    }

}

async function estraiPartecipazioniParty(id, utente_id){
    try {
        const response = await fetch(`http://localhost:3000/api/Partecipazioni/Party/${id}`);

        if (response.status === 404) {
            console.warn("Nessun partecipante trovato.");
            return 0;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const partecipazioni = await response.json(); 
        const partecipa = false;
        const numero_partecipazioni = partecipazioni.lenght;

        
        partecipazioni.forEach(part => {
            if (part.utente_id == utente_id)
                partecipa = true;
        });

        return {numero_partecipazioni, partecipa};

    } catch (error) {
        console.error("Errore durante l'estrazione delle partecipazioni:", error);
        return null;
    }

}

async function estraiInformazioniEventi(id, utente_id) {
    const partecipazioni = 0;
    const partecipa = false;
    const faq = [];
    const res = { partecipazioni, partecipa, faq};
    
    try {
        const p = await fetch(`http://localhost:3000/api/Partecipazioni/Eventi/${id}`);
        const f = await fetch(`http://localhost:3000/api/faqeventi/evento/${id}`);

        if (f.status === 404) {
            console.warn("Nessuna faq trovata.");
        }

        if (!f.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`);
        }

        if (p.status === 404) {
            console.warn("Nessun partecipante trovato.");
        }

        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`);
        }

        const partecipazioni = await p.json();
        res.faq.value = await f.json();

        res.partecipazioni.value = partecipazioni.lenght;

        partecipazioni.forEach(part => {
            if (part.utente_id == utente_id)
                res.partecipa.value = true;
        });

        return res;

    } catch (error) {
        console.error("Errore durante l'estrazione delle partecipazioni:", error);
        return res;
    }

}