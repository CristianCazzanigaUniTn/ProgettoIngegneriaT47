import { abilitaInterazione, disabilitaInterazione } from './map.js';


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
            <img src="./image/super.png" alt="Foto" style="width:100%; height:auto; border-radius:10px; margin-bottom: 10px;">
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
        document.getElementById('popupImg').src = './image/super.png';
        document.getElementById('popupText').textContent = post.post.descrizione;
        document.getElementById('popupFotoProfilo').src = './image/download.png';
        document.getElementById('popupNomeProfilo').textContent = post.utente.username;
        popupDiv.style.display = 'block';
        popupDiv.style.opacity = 0;
        setTimeout(() => popupDiv.style.opacity = 1, 50);
    }, { once: true });
}


//

//animazione per i popup
function apriPopUpAnim(posizione, map){
    disabilitaInterazione();
    map.getViewModel().setLookAtData({
        position: {lat: posizione.latitudine, lng: posizione.longitudine},
        zoom: 18,
        tilt: 0
    }, {});
    
}

function chiudiPopUpAnim(map){
    abilitaInterazione();
    map.getViewModel().setLookAtData({
        zoom: 16,
        tilt: 55
    }, {});
}

//