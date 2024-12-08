import { mostraPopup, mostraPopupDiv, mostraPopupTextual, chiudiPopup, chiudiPopupDiv} from './popUp.js';
//funzioni per aggiungere i marker

export function aggiungiDati(dati, map) {

    dati.textuals.forEach(text => {
        aggiungiMessaggio(text, map)
    });

    dati.posts.forEach(post => {
        aggiungiPost(post, map)
    });

    dati.parties.forEach(party => {
        aggiungiParty(party, map)
    });

    dati.eventi.forEach(evento => {
        aggiungiEvento(evento, map)
    });

}

function aggiungiPost(post, map) {
    var punto = new H.geo.Point(post.post.posizione.latitudine, post.post.posizione.longitudine);
    var icona = new H.map.Icon('./image/post.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);
    marker.addEventListener('tap', function (evt) {
        mostraPopupDiv(post, map);
    });
    marker.addEventListener('pointerenter', function (evt) {
        mostraPopup(evt, post, map);
    });
    marker.addEventListener('pointerleave', function(evt){ chiudiPopup(evt, map)});
}

function aggiungiMessaggio(text, map) {
    var punto = new H.geo.Point(text.post.posizione.latitudine, text.post.posizione.longitudine);
    var icona = new H.map.Icon('./image/text.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);
    marker.addEventListener('pointerenter', function (evt) {
        mostraPopupTextual(evt, text, map);
    });
    marker.addEventListener('pointerleave',  function(evt){ chiudiPopup(evt, map)});
}

function aggiungiParty(party, map) {
    var punto = new H.geo.Point(party.party.posizione.latitudine, party.party.posizione.longitudine);

    var icona = new H.map.Icon('./image/party.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);

}

function aggiungiEvento(evento, map) {
    var punto = new H.geo.Point(evento.evento.posizione.latitudine, evento.evento.posizione.longitudine);

    var icona = new H.map.Icon('./image/shop.png', { size: { w: 60, h: 60 } });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);

}