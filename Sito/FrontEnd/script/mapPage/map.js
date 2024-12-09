import { estraiPartyDaFile, estraiPostDaFile, estraiTextualDaFile } from './estraiDati.js';
import { aggiornaSide } from './sidebar.js';


export function disabilitaInterazione() {
    behavior.disable();
}

export function abilitaInterazione() {
    behavior.enable();
}


var platform = new H.service.Platform({
    apikey: window.apikey
});


var defaultLayers = platform.createDefaultLayers({
    tileSize: 256
});


var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: { lat: 46.066667, lng: 11.133333 },
    zoom: 16
});

map.getViewModel().setLookAtData({ tilt: 52 });

map.addEventListener('mapviewchange', function(evt) {
    var zoomLevel = map.getZoom();
    if (zoomLevel < 14) {
        map.setZoom(14); 
    }
});
window.addEventListener('resize', () => map.getViewPort().resize());

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


function interleave(map) {
    var provider = map.getBaseLayer().getProvider();
    
    var style = provider.getStyle();
    var changeListener = () => {
        if (style.getState() === H.map.Style.State.READY) {
            style.removeEventListener('change', changeListener);
            estraiPostDaFile('./fakedata/post.json', map);
            estraiTextualDaFile('./fakedata/textual.json', map);
            estraiPartyDaFile('./fakedata/party.json', map);
            aggiornaSide();
        }
    }
    style.addEventListener('change', changeListener);
}


interleave(map);
