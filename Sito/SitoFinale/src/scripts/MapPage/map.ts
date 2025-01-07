var map: any;

export const initializeMap = () => {
    // Ottieni la chiave API dalla variabile d'ambiente
    const apikey = import.meta.env.VITE_HERE_API_KEY;

    if (!apikey) {
        console.error("API Key is missing");
        return;
    }

    const platform = new H.service.Platform({
        apikey: apikey
    });



    var defaultLayers = platform.createDefaultLayers({
        tileSize: 256
    });


    map = new H.Map(document.getElementById('map'),
        defaultLayers.vector.normal.map, {
        center: { lat: 46.066667, lng: 11.133333 },
        zoom: 16
    });

    map.getViewModel().setLookAtData({ tilt: 52 });

    map.addEventListener('mapviewchange', function () {
        var zoomLevel = map.getZoom();
        if (zoomLevel < 14) {
            map.setZoom(14);
        }
    });
    window.addEventListener('resize', () => map.getViewPort().resize());

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


    function interleave() {
        var provider = map.getBaseLayer().getProvider();

        var style = provider.getStyle();
        var changeListener = () => {
            if (style.getState() === H.map.Style.State.READY) {
                style.removeEventListener('change', changeListener);
            }
        }
        style.addEventListener('change', changeListener);
    }


    interleave();

};

//mettere i marker 

export interface Posted {
    profileName: string;
    profileImage: string;
    postImage: string;
    description: string;
    dataIndex: number;
    latitudine: number;
    longitudine: number;
    dataType: 'post' | 'textual' | 'party' | 'evento'; // Aggiungiamo 'party' ed 'evento'
}

export async function AggiornaMappa(posteds:any) {
    posteds.forEach((posted: Posted) => {
        if (posted.dataType == "post") {
            aggiungiPost(posted);
        }
        else  if (posted.dataType == "textual") {
            aggiungiMessaggio(posted);
        }
        else  if (posted.dataType == "party") {
            aggiungiParty(posted);
        }
        else  if (posted.dataType == "evento") {
            aggiungiEvento(posted);
        }
    });
}







//GESTIONE AGGIUNTA MARKER E DIVE (POSSIBILITA DI DIVIDERLO IN PIU FILE)

import postImage from '@/assets/post.png';
import partyImage from '@/assets/party.png';
import shopImage from '@/assets/shop.png';
import textImage from '@/assets/text.png';
import { apriPopUpVisualizza } from './PageScript';

async function aggiungiPost(post: any) {
    var punto = new H.geo.Point(post.latitudine, post.longitudine);
    var icona = new H.map.Icon(postImage, {size: {w: 60, h: 60} });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);
    
    
    marker.addEventListener('tap', function (evt: any) {
        //animazione
        apriPopUpVisualizza(post, post.dataType);
    });
    marker.addEventListener('pointerenter', function (evt: any) {
        mostraPopup(evt, post);
    });
    marker.addEventListener('pointerleave', function(evt: any){ chiudiPopup(evt)});
}


async function aggiungiMessaggio(text: any) {
    var punto = new H.geo.Point(text.latitudine, text.longitudine);
    var icona = new H.map.Icon(textImage, {size: {w: 60, h: 60} });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);
    
    marker.addEventListener('pointerenter', function (evt: any) {
        mostraPopupTextual(evt, text);
    });
    marker.addEventListener('pointerleave',  function(evt: any){ chiudiPopup(evt)});
}

async function aggiungiParty(party: any) {
    var punto = new H.geo.Point(party.latitudine, party.longitudine);
    var icona = new H.map.Icon(partyImage, {size: {w: 60, h: 60} });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);

    marker.addEventListener('tap', function (evt: any) {
        apriPopUpVisualizza(party, party.dataType);
    });

}

async function aggiungiEvento(evento: any) {
    var punto = new H.geo.Point(evento.latitudine, evento.longitudine);
    var icona = new H.map.Icon(shopImage, {size: {w: 60, h: 60} });
    var marker = new H.map.Marker(punto, { icon: icona });
    map.addObject(marker);

    marker.addEventListener('tap', function (evt: any) {
        apriPopUpVisualizza(evento, evento.dataType);
    });
}



async function mostraPopup(evt: any, post: any) {
    var marker = evt.target;
    var posizione = marker.getGeometry();

    var contenutoPopup = `
        <div style="text-align:center; max-width: 200px; background: white; border: 1px solid #ccc; border-radius: 10px; padding: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
            <img src="` + post.postImage + `" alt="Foto" style="width:100%; height:auto; border-radius:10px; margin-bottom: 10px;">
            <div style="font-size: 14px; color: #333;">
                <strong>Descrizione:</strong>
                <p>` + post.description + `</p>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 10px;">
                <img src="` + post.profileImage + `" alt="Foto profilo" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:5px;">
                <strong>` + post.profileName + `</strong>
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

async function chiudiPopup(evt: any) {
    if (evt.target.popupMarker) {
        map.removeObject(evt.target.popupMarker);
        evt.target.popupMarker = null;
    }
}


async function mostraPopupTextual(evt: any, text: any) {
    var marker = evt.target;
    var posizione = marker.getGeometry();
    var contenutoPopup = `
        <div style="text-align:center; max-width: 200px; background: white; border: 1px solid #ccc; border-radius: 10px; padding: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
            <div style="font-size: 14px; color: #333;">
                <strong>Descrizione:</strong>
                <p>` + text.description + `</p>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 10px;">
                <img src="` + text.profileImage + `" alt="Foto profilo" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:5px;">
                <strong>` + text.profileName + `</strong>
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


