import { abilitaInterazione, disabilitaInterazione } from './map.js';
import {
    fetchProtectedData, estraiPartecipazioniParty, estraiInformazioniEventi,
    eliminaEvento, eliminaParty, partecipaEvento,
    partecipaParty, disinscriviEvento, disinscriviParty
} from './estraiDati.js';


//sezione popup attaccati ai marker evento quando si passa sopra
export function mostraPopupTextual(evt, text, map) {
    var marker = evt.target;
    var posizione = marker.getGeometry();
    var contenutoPopup = `
        <div style="text-align:center; max-width: 200px; background: white; border: 1px solid #ccc; border-radius: 10px; padding: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
            <div style="font-size: 14px; color: #333;">
                <strong>Descrizione:</strong>
                <p>` + text.post.descrizione + `</p>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 10px;">
                <img src="./image/download.png" alt="Foto profilo" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:5px;">
                <strong>` + text.utente.username + `</strong>
            </div>
        </div>
    `;

    var popupMarker = new H.map.DomMarker(posizione, {
        icon: new H.map.DomIcon(contenutoPopup, { anchor: { x: 0, y: 0 } }),
        volatility: true
    });
    map.addObject(popupMarker);
    marker.popupMarker = popupMarker;
}

export function mostraPopup(evt, post, map) {
    var marker = evt.target;
    var posizione = marker.getGeometry();

    var contenutoPopup = `
        <div style="text-align:center; max-width: 200px; background: white; border: 1px solid #ccc; border-radius: 10px; padding: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
            <img src="` + post.post.contenuto + `" alt="Foto" style="width:100%; height:auto; border-radius:10px; margin-bottom: 10px;">
            <div style="font-size: 14px; color: #333;">
                <strong>Descrizione:</strong>
                <p>` + post.post.descrizione + `</p>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 10px;">
                <img src="./image/download.png" alt="Foto profilo" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:5px;">
                <strong>` + post.utente.username + `</strong>
            </div>
        </div>
    `;
    var popupMarker = new H.map.DomMarker(posizione, {
        icon: new H.map.DomIcon(contenutoPopup, { anchor: { x: 0, y: 0 } }),
        volatility: true
    });
    map.addObject(popupMarker);
    marker.popupMarker = popupMarker;
}

export function chiudiPopup(evt, map) {
    if (evt.target.popupMarker) {
        map.removeObject(evt.target.popupMarker);
        evt.target.popupMarker = null;
    }
}
//

export function chiudiPopupDiv(map) {
    chiudiPopUpAnim(map);
    document.getElementById('popupDiv').style.display = 'none';
    map.addEventListener('mapviewchangeend', function () {
        abilitaInterazione();
        
    }, { once: true });

}


export function mostraPopupDiv(post, map) {
    apriPopUpAnim(post.post.posizione, map);
    document.getElementById('chiusura').onclick = function() {
        chiudiPopupDiv(map);
    };
    document.getElementById('popupDiv').style.display = 'none';
    map.addEventListener('mapviewchangeend', function () {
        var popupDiv = document.getElementById('popupDiv');
        document.getElementById('popupImg').src = post.post.contenuto;
        document.getElementById('popupText').textContent = post.post.descrizione;
        document.getElementById('popupFotoProfilo').src = './image/download.png';
        document.getElementById('popupNomeProfilo').textContent = post.utente.username;
        popupDiv.style.display = 'block';
        popupDiv.style.opacity = 0;
        setTimeout(() => popupDiv.style.opacity = 1, 50);
    }, { once: true });
}

function chiudiPopupPartyEventoDiv(map)
{
    chiudiPopUpAnim(map);
    document.getElementById('popupPartyDiv').style.display = 'none';
    map.addEventListener('mapviewchangeend', function () {
        abilitaInterazione();
        
    }, { once: true });
}

export async function apriPopupPartyEvento(cont, map, partyoev) {
    console.log("sososos")
    disabilitaInterazione();
    apriPopUpAnim(cont.cont.posizione, map);
    document.getElementById('chiusuraParty').onclick = function() {
        chiudiPopupPartyEventoDiv(map);
    };

    const utenteid = fetchProtectedData()._id;

    var info;

    if(partyoev == "Party"){
        info = await estraiPartecipazioniParty(cont.cont._id, utenteid);
    } else if (partyoev == "Evento") {
        info = await estraiInformazioniEventi(cont.cont._id, utenteid);
        
    }

    const org = cont.cont.Organizzatore == utenteid;

    document.getElementById('popupPartyDiv').style.display = 'none';
    map.addEventListener('mapviewchangeend', function () {
        document.getElementById('nomeUtenteParty').textContent = cont.utente.username;
        document.getElementById('fotoProfiloParty').src = './image/download.png';
        document.getElementById('immagineParty').src = cont.cont.foto;
        document.getElementById('descrizioneParty').textContent = cont.cont.descrizione;
    
        const categorieContainer = document.querySelector('.categorie');
        categorieContainer.innerHTML = '';

        const span = document.createElement('span');
        span.textContent = `#${cont.cont.Categoria}`;
        categorieContainer.appendChild(span);
        
    
        document.getElementById('partecipantiAttuali').textContent = info.numero_partecipazioni;
        document.getElementById('partecipantiMassimi').textContent = cont.cont.numero_massimo_partecipanti;
    
        const bottone = document.getElementById('azionePartyButton');
        if (!info.partecipa && !org && utenteid) {
            if (partyoev == "Party") {
                bottone.onclick = partecipaParty(cont.cont._id);
            } else if(partyoev == "Evento") {
                bottone.onclick = partecipaEvento(cont.cont._id);
            }
        } else if (info.partecipa && !org) {
            if (partyoev == "Party") {
                bottone.onclick = disinscriviParty(cont.cont._id);
            } else if(partyoev == "Evento") {
                bottone.onclick = disinscriviEvento(cont.cont._id);
            }
        }else if (org) {
            if (partyoev == "Party") {
                bottone.onclick = eliminaParty(cont.cont._id);
            } else if(partyoev == "Evento") {
                bottone.onclick = eliminaEvento(cont.cont._id);
            }
        } else {
            bottone.style.display = 'none';
        }
    
        document.getElementById('popupPartyDiv').style.display = 'block';
    }, { once: true });
   
}


//

//animazione per i popup
export function apriPopUpAnim(posizione, map){
    disabilitaInterazione();
    map.getViewModel().setLookAtData({
        position: {lat: posizione.latitudine, lng: posizione.longitudine},
        zoom: 18,
        tilt: 0
    }, {});
    
}

export function chiudiPopUpAnim(map){
    abilitaInterazione();
    map.getViewModel().setLookAtData({
        zoom: 16,
        tilt: 55
    }, {});
}

//