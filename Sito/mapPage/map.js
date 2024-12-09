import { estraiDati } from './estraiDati.js';
import { aggiungiDati } from './aggiornamappa.js';
import { aggiornaSidebar } from './sidebar.js';


var rad = 1000;
var lat = 46.066667;
var lng = 11.133333;

export function disabilitaInterazione() {
    behavior.disable();
}

export function abilitaInterazione() {
    behavior.enable();
}


var platform = new H.service.Platform({
    apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: { lat: 46.066667, lng: 11.133333 },
    zoom: 16
});
map.getViewModel().setLookAtData({ tilt: 52 });

window.addEventListener('resize', () => map.getViewPort().resize());

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);


function interleave(map) {
    var provider = map.getBaseLayer().getProvider();
    var style = provider.getStyle();
    var changeListener = async () => {
        if (style.getState() === H.map.Style.State.READY) {
            style.removeEventListener('change', changeListener);
            const dati = await estraiDati(lat, lng, rad);

            aggiungiDati(dati, map);

            aggiornaSidebar(dati, map);
        }
    }
    style.addEventListener('change', changeListener);
}

interleave(map);