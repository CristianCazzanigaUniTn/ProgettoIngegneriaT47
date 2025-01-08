export interface Posizione {
    latitudine: number;
    longitudine: number;
}

export async function getPosition(): Promise<Posizione> {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitudine = position.coords.latitude;
                    const longitudine = position.coords.longitude;
                    resolve({ latitudine, longitudine });
                },
                () => {
                    console.warn("Impossibile ottenere la posizione, si utilizza la posizione di Trento.");
                    resolve({ latitudine: 46.066667, longitudine: 11.133333 });
                }
            );
        } else {
            console.warn("Geolocalizzazione non supportata, si utilizza la posizione di Trento.");
            resolve({ latitudine: 46.066667, longitudine: 11.133333 }); 
        }
    });
}