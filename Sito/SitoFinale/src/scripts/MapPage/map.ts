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


    var map = new H.Map(document.getElementById('map'),
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
