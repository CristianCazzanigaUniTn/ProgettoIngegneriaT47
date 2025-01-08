export interface Posizione {
    latitudine: number;
    longitudine: number;
}


const API_KEY = import.meta.env.VITE_HERE_API_KEY2;

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

export async function fetchCityName(latitude:any, longitude:any) {
  const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${API_KEY}`;
  const response = await fetch(url);
    const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].address.label;
  } else {
    throw new Error('Localizzazione non trovata.');
  }
}