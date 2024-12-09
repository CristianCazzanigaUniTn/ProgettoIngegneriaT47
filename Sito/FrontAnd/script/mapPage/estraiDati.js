import { mostraPopup, mostraPopupDiv, mostraPopupTextual, chiudiPopup, apriPopupPartyEvento} from './popup.js';


//funzioni per aggiungere i marker

function aggiungiPost(posizione, contenuto, profilo, map) {
    var punto = new H.geo.Point(posizione.lat, posizione.long);
    var icona = new H.map.Icon('img/post.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);
    marker.addEventListener('tap', function (evt) {
        mostraPopupDiv(contenuto, profilo, punto, map);
    });
    marker.addEventListener('pointerenter', function (evt) {
        mostraPopup(evt, contenuto, profilo, map);
    });
    marker.addEventListener('pointerleave', function(evt){ chiudiPopup(evt, map)});
}

function aggiungiParty(posizione, contenuto, profilo, map) {
    var punto = new H.geo.Point(posizione.lat, posizione.long);

    var icona = new H.map.Icon('img/party.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    console.log(contenuto);
    marker.addEventListener('tap', function (evt) {
        apriPopupPartyEvento(
            'Mario Rossi',                    
            'https://via.placeholder.com/50',  
            'https://via.placeholder.com/400', 
            'Questo è un party molto divertente, non perdertelo!', 
            ['Divertimento', 'Musica', 'Amici'], 
            2,                               
            contenuto.MaxPersone,                              
            'iscriviti', map, punto)
    });
    map.addObject(marker);

}

function aggiungiMessaggio(posizione, contenuto, profilo, map) {
    var punto = new H.geo.Point(posizione.lat, posizione.long);
    var icona = new H.map.Icon('img/text.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);
    marker.addEventListener('pointerenter', function (evt) {
        mostraPopupTextual(evt, contenuto, profilo, map);
    });
    marker.addEventListener('pointerleave',  function(evt){ chiudiPopup(evt, map)});
}
// //


//funzioni per estrarre i dati dai json
export async function estraiPartyDaFile(file, map) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        data.Parties.forEach(party => {
            aggiungiParty(party.posizione, party.contenuto, party.profilo, map);
        });
    } catch (error) {
        console.error("Errore durante la lettura del file JSON:", error);
    }
}


export async function estraiPostDaFile(file, map) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        data.posts.forEach(post => {
            console.log("Descrizione:", post.contenuto.descrizione);
            console.log("Foto:", post.contenuto.foto);

            aggiungiPost(post.posizione, post.contenuto, post.profilo, map);
        });
    } catch (error) {
        console.error("Errore durante la lettura del file JSON:", error);
    }
}


export async function estraiTextualDaFile(file, map) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        data.textuals.forEach(textual => {
            console.log("Descrizione:", textual.contenuto.descrizione);
            aggiungiMessaggio(textual.posizione, textual.contenuto, textual.profilo, map);
        });
    } catch (error) {
        console.error("Errore durante la lettura del file JSON:", error);
    }
}





