import { loggedUser } from "../../states/loggedUser";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

//Numero di like ad un commento
async function estraiLikeAiCommenti(id: any) {
    try {
        const l = await fetch(`${API_BASE_URL}/api/commenti/${id}/like`);

        if (l.status === 404) {
            return 0;
        }

        if (!l.ok) {
            throw new Error(`Errore nella richiesta: ${l.status} ${l.statusText}`);
        }
        
        const likes = await l.json();
        return likes.length;
        
    } catch (error){
        return null;
    }
}

async function estraiCategoria(id: any) {
    try {
        const c = await fetch(`${API_BASE_URL}/api/categoria/${id}`);

        if (c.status === 404) {
            return 0;
        }

        if (!c.ok) {
            throw new Error(`Errore nella richiesta: ${c.status} ${c.statusText}`);
        }

        return await c.json();
        
    } catch (error){
        return null;
    }
}

export async function estraipartyid(id: any) {
    try {
        const p = await fetch(`${API_BASE_URL}/api/party/${id}`);

        if (p.status === 404) {
            return;
        }

        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`);
        }

        const party = await p.json();

        const categoria = await estraiCategoria(party.Categoria);
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
            time: party.data_inizio,
            Categoria: categoria.nome

        };

        return res;
        
    } catch (error) {
        alert('Errore durante l\'estrazione dei party: ' + error);
    }
}

export async function estraieventoid(id: any) {
    try {
        const e = await fetch(`${API_BASE_URL}/api/eventi/${id}`);

        if (e.status === 404) {
            return;
        }

        if (!e.ok) {
            throw new Error(`Errore nella richiesta: ${e.status} ${e.statusText}`);
        }


        const evento = await e.json();

        const utente = await estraiUtente(evento.Organizzatore);

        const categoria = await estraiCategoria(evento.Categoria);

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
            time: evento.data_inizio,
            Categoria: categoria.nome
        };

        return res;
        
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}
//Estrai utente da id
async function estraiUtente(id : any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Utenti/${id}`);
        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const ut = await response.json();

        return ut.user;

    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
        return null;
    }
}
//Estrai like (con id e nome utente) e commenti (con id e nome utente, testo e numero di like) di un post
export async function estraiInformazioniPost(id: any) {
    var like: any = [];
    var commento_like: any = [];
    var idLike: any = undefined;
    
    try {
        const l = await fetch(`${API_BASE_URL}/api/like/post/${id}`);
        const c = await fetch(`${API_BASE_URL}/api/commenti/post/${id}`);

        if (l.ok) {
            const likes = await l.json();

            for (const lk of likes) {
                const ut = await estraiUtente(lk.utente_id);
                if (lk.utente_id === loggedUser.id) {
                    idLike = lk._id;
                }
                like.push({ id_utente: ut.id, username: ut.username });
            }
        }

        if (c.ok) {
            const commenti = await c.json();

            for (const cm of commenti) {
                const ut = await estraiUtente(cm.utente_id);
                const nlike = await estraiLikeAiCommenti(cm.utente_id);
                commento_like.push({
                    id_utente: ut.id,
                    img_utente: ut.foto_profilo,
                    username: ut.username,
                    testo: cm.commento,
                    n_like: nlike,
                });
            }
        }

        if (!l.ok) {
            throw new Error(`Errore nella richiesta: ${l.status} ${l.statusText}`);
        }

        if (!c.ok) {
            throw new Error(`Errore nella richiesta: ${c.status} ${c.statusText}`);
        }

        return { like: like, commenti: commento_like, idLike: idLike };

    } catch (error) {
        return { like: like, commenti: commento_like, idLike: idLike };
    }
}


//Ritorna il numero di partecipazioni ad un Party
export async function estraiPartecipazioniParty(id: any){
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Party/${id}`);
        
        var partecipa = false;
        var npart = 0;
        if (response.status === 404) {
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
        return {numero_partecipazioni: 0, partecipa: []};
    }

}

//Ritorna il numero di partecipazioni ad un Evento e le sue faq
export async function estraiInformazioniEventi(id: any) {
    var partecipa = false;
    var npart = 0;
    var faq = [];
    
    try {
        const p = await fetch(`${API_BASE_URL}/api/Partecipazioni/Eventi/${id}`);
        const f = await fetch(`${API_BASE_URL}/api/faqeventi/evento/${id}`);

        if (f.ok){
            faq = await f.json();
        }
        

        if (p.ok){
            const partecipazioni = await p.json();
            npart = partecipazioni.length;

            if(loggedUser.token !== undefined){
                partecipazioni.forEach((part:any) => {
                    if (String(part._id) === String(loggedUser.id)){
                        partecipa = true;
                    }
                });
            }
        }
        if (!f.ok) {
            throw new Error(`Errore nella richiesta: ${f.status} ${f.statusText}`); 
        }

        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`); 
        }
        return {numero_partecipazioni: npart, partecipa: partecipa, faq: faq};
    } catch (error) {
        return {numero_partecipazioni: npart, partecipa: partecipa, faq: faq};
    }

}

export async function partecipaParty(id_party: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Party/${id_party}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            }
        );
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante l'iscrizione: " + error);
    }
}

export async function partecipaEvento(id_evento: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Eventi/${id_evento}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante l'iscrizione: " + error);
    }
}
export async function disinscriviParty(id_party: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Party/${id_party}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante la disicrizione: " + error);
    }
}
export async function disinscriviEvento(id_evento: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Eventi/${id_evento}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante la disicrizione: " + error);
    }
    
}
export async function eliminaParty(id_party: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/party/${id_party}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        alert("Errore durante l'eliminazione: " + error);
    }
}
export async function eliminaEvento(id_evento: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/eventi/${id_evento}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        alert("Errore durante l'eliminazione: " + error);
    }
}

export async function eliminaPost(id_post: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Post/${id_post}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante l'eliminazione: " + error);
    }
}

export async function aggiungiCommento(post_id: any, contenuto: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/commenti`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
            body: JSON.stringify({ post_id, contenuto }) // Cambia i nomi dei campi
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore nell'aggiunta del commento: " + error);
    }
}

export async function aggiungiLikePost(post_id: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/like/${post_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
        });

        if (!response.ok) {
            // Stampa i dettagli per il debug
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
        return undefined
    }
}

export async function eliminaLikePost(like_id: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/like/${like_id}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        alert("Errore nell'elminazione: " + error);
    }
    
}

export async function aggiungiLikeCommenti(commenti_id: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/commenti/${commenti_id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
        });

        if (!response.ok) {
            // Stampa i dettagli per il debug
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }
    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
    }
}

export async function eliminaLikeCommenti(commenti_id: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/commenti/${commenti_id}/like`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore nell'elminazione: " + error);
    }
    
}

export async function aggiungiFaq(id_evento: any, domanda: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/faqeventi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
            body: JSON.stringify({ id_evento, domanda }) // Cambia i nomi dei campi
        });

        if (!response.ok) {      
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
    }
}

export async function rispondiFaq(id: any, risposta: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/faqeventi`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
            body: JSON.stringify({ id: id, risposta: risposta }) // Cambia i nomi dei campi
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
    }
}

// Function to fetch all categories (as per your previous requirement)
export async function estraiCategorie() {
    try {
        const response = await fetch('http://localhost:3000/api/categoria');
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
        
        const categorie = await response.json();
        return categorie; // Return the list of categories
        
    } catch (error) {
        console.error("Errore nell'estrazione delle categorie:", error);
        return [];
    }
}
