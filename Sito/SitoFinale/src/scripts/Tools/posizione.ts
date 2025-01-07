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
                    console.log(`Posizione ottenuta: Latitudine = ${latitudine}, Longitudine = ${longitudine}`); // Stampa la posizione
                    resolve({ latitudine, longitudine });
                },
                () => {
                    console.warn("Impossibile ottenere la posizione, si utilizza la posizione di Trento.");
                    resolve({ latitudine: 46.066667, longitudine: 11.133333 }); // Posizione di Trento come fallback
                }
            );
        } else {
            console.warn("Geolocalizzazione non supportata, si utilizza la posizione di Trento.");
            resolve({ latitudine: 46.066667, longitudine: 11.133333 }); // Posizione di Trento se l'API non è supportata
        }
    });
}