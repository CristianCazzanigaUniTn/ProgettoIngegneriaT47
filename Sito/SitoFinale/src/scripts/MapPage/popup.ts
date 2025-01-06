import { loggedUser } from "../../states/loggedUser";

//Numero di like ad un commento
async function estraiLikeAiCommenti(id: any) {
    try {
        const l = await fetch(`http://localhost:3000/api/commenti/${id}/like`);

        if (l.status === 404) {
            return 0;
        }

        if (!l.ok) {
            throw new Error(`Errore nella richiesta: ${l.status} ${l.statusText}`);
        }
        
        const likes = await l.json();

        return likes.lenght;
        
    } catch (error){
        console.error("Errore durante l'estrazione dei like:", error);
        return null;
    }
}

export async function estraipartyid(id: any) {
    try {
        const p = await fetch(`http://localhost:3000/api/party/${id}`);

        if (p.status === 404) {
            console.warn('Nessun party trovato.');
            return;
        }

        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`);
        }

        const party = await p.json();

        const utente = await estraiUtente(party.Organizzatore);

        const res = {
            id: utente.id,
            profileName: utente.username,
            profileImage: utente.foto_profilo,
            postImage: party.foto || 'https://via.placeholder.com/150',
            description: party.descrizione,
            dataIndex: party._id,
            latitudine: party.posizione.latitudine,
            longitudine: party.posizione.longitudine,
            dataType: 'party', // Cambiato da 'post' a 'party'
            maxpartecipanti: party.numero_massimo_partecipanti,
            time: party.data_inizio

        };

        return res;
        
    } catch (error) {
        console.error('Errore durante l\'estrazione dei party:', error);
    }
}

export async function estraieventoid(id: any) {
    try {
        const e = await fetch(`http://localhost:3000/api/eventi/${id}`);

        if (e.status === 404) {
            console.warn('Nessun evento trovato.');
            return;
        }

        if (!e.ok) {
            throw new Error(`Errore nella richiesta: ${e.status} ${e.statusText}`);
        }


        const evento = await e.json();

        const utente = await estraiUtente(evento.Organizzatore);

        const res = {
            id: utente.id,
            profileName: utente.username,
            profileImage: utente.foto_profilo,
            postImage: evento.foto || 'https://via.placeholder.com/150',
            description: evento.descrizione,
            dataIndex: evento._id,
            latitudine: evento.posizione.latitudine,
            longitudine: evento.posizione.longitudine,
            dataType: 'evento', 
            maxpartecipanti: evento.numero_massimo_partecipanti,
            time: evento.data_inizio

        };

        return res;
        
    } catch (error) {
        console.error('Errore durante l\'estrazione dell\'evento:', error);
    }
}

//Estrai utente da id
async function estraiUtente(id : any) {
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

//Estrai like (con id e nome utente) e commenti (con id e nome utente, testo e numero di like) di un post
export async function estraiInformazioniPost(id: any) {
    const like:any = [];
    const commento_like:any = [];
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
        var ut: any, utUsername, utId;
        
        if(likes.lenght > 0){
            likes.forEach((like : any) => {
                ut = estraiUtente(like.utente_id);
                utUsername = ut.username;
                utId = ut._id;
                like.push({utId, utUsername});
            });
        }

        const commenti = await c.json();
        var nlike, testocommento;

        if(commenti.lenght > 0){
            commenti.forEach((commento:any) => {
                ut = estraiUtente(commento.utente_id);
                utUsername = ut.username;
                utId = ut._id;
                nlike = estraiLikeAiCommenti(commento.utente_id);
                testocommento = commento.commento;
                commento_like.push({ utId, utUsername, testocommento, nlike });
            });
        }

        return res;

    } catch (error) {
        console.error("Errore durante l'estrazione dei post:", error);
        return res;
    }

}

//Ritorna il numero di partecipazioni ad un Party
export async function estraiPartecipazioniParty(id: any){
    try {
        const response = await fetch(`http://localhost:3000/api/Partecipazioni/Party/${id}`);
        
        var partecipa = false;
        var npart = 0;

        if (response.status === 404) {
            console.warn("Nessun partecipante trovato.");
            return {numero_partecipazioni: npart, partecipa: partecipa};
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const partecipazioni = await response.json(); 

        npart = partecipazioni.length;

        if (loggedUser.token !== undefined) {
            partecipazioni.forEach((part: any) => {
                if (String(part._id) === String(loggedUser.id)){
                    partecipa = true;
                }
            });
        }

        return {numero_partecipazioni: npart, partecipa: partecipa};

    } catch (error) {
        console.error("Errore durante l'estrazione delle partecipazioni:", error);
        return {numero_partecipazioni: 0, partecipa: []};
    }

}

//Ritorna il numero di partecipazioni ad un Evento e le sue faq
export async function estraiInformazioniEventi(id:any) {
    try {
        const p = await fetch(`http://localhost:3000/api/Partecipazioni/Eventi/${id}`);
        const f = await fetch(`http://localhost:3000/api/faqeventi/evento/${id}`);

        var partecipa = false;
        var npart = 0;
        var faq = [];

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
        faq = await f.json();

        npart = partecipazioni.length;

        if(loggedUser.token !== undefined){
            partecipazioni.forEach((part:any) => {
                if (String(part._id) === String(loggedUser.id)){
                    partecipa = true;
                }
            });
        }

        return {numero_partecipazioni: npart, partecipa: partecipa, faq: faq};

    } catch (error) {
        console.error("Errore durante l'estrazione delle partecipazioni:", error);
        return {numero_partecipazioni: 0, partecipa: false, faq: []};
    }

}

export async function partecipaParty(id_party: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/Partecipazioni/Party/${id_party}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const partecipazione = await response.json();

        console.log(partecipazione);

    } catch (error) {
        console.error("Errore durante l'iscrizione:", error);
    }
}

export async function partecipaEvento(id_evento: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/Partecipazioni/Eventi/${id_evento}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const partecipazione = await response.json();

        console.log(partecipazione);

    } catch (error) {
        console.error("Errore durante l'iscrizione:", error);
    }
}

export async function disinscriviParty(id_party: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/Partecipazioni/Party/${id_party}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        console.log("Partecipazione eliminata con successo!");

    } catch (error) {
        console.error("Errore durante l'eliminazione della partecipazione:", error);
    }
}

export async function disinscriviEvento(id_evento: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/Partecipazioni/Eventi/${id_evento}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        console.log("Partecipazione eliminata con successo!");

    } catch (error) {
        console.error("Errore durante l'eliminazione della partecipazione:", error);
    }
    
}

export async function eliminaParty(id_party: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/party/${id_party}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        console.log("Party eliminato con successo!");

    } catch (error) {
        console.error("Errore durante l'eliminazione del party:", error);
    }
}

export async function eliminaEvento(id_evento: any) {
    try {
        const response = await fetch(`http://localhost:3000/api/eventi/${id_evento}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        console.log("Evento eliminato con successo!");

    } catch (error) {
        console.error("Errore durante l'eliminazione dell'evento:", error);
    }
}