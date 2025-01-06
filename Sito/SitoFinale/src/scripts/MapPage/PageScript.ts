
import { ref } from 'vue';
import { estraiDati, Posted } from './EstraiDati.ts';  // Importa estraiDati
import { AggiornaMappa } from './map.ts';


// Logica della mappa e popup
export const showPopupCreaPost = ref(false);
export const showPopupCreaEvento = ref(false);
export const showPopupCreaParty = ref(false);
export const showPopupPost = ref(false);

export const description = 'This is a post description.';
export const location = '12.21341, 48.123143';
export const dateTime = '2024-12-08 14:30';

// Stato per le sideCards
export const sideCards = ref<Posted[]>([]);

export async function aggiornaTutto() {
  const lat = 45.0; // Latitudine, puoi cambiarla con i dati correnti della mappa
  const lng = 7.0;  // Longitudine, anche qui usa i dati correnti
  const rad = 100000000000000;
  const cards = await estraiDati(lat, lng, rad);

  //aggiorna sideBar
  sideCards.value = cards;

  //aggiorna mappa
  AggiornaMappa(cards);
}




export function openPopup(type:any) {
  if (type === "CreaPost") showPopupCreaPost.value = true;
  if (type === "CreaParty") showPopupCreaParty.value = true;
  if (type === "CreaEvento") showPopupCreaEvento.value = true;
  if (type === "VisualizzaPost") showPopupPost.value = true; // Apri il popup del post
}

// Funzione per chiudere i popup
export function closePopup(type:any) {
  if (type === "CreaPost") showPopupCreaPost.value = false;
  if (type === "CreaParty") showPopupCreaParty.value = false;
  if (type === "CreaEvento") showPopupCreaEvento.value = false;
  if (type === "VisualizzaPost") 
    {
        showPopupPost.value = false; // Chiudi il popup del post
        //back animation
    }
}

export var postUserName = ref('');
export var userIdView = ref('');
export var postProfilePicture = ref('');
export var postTime = ref('');
export var postImage = ref('');
export var postDescription = ref('');

//elminare
export function apriPopUpVisualizza(dati:any) {
  //scatta evento su mappa 
  if (dati.dataType == 'post') {
    postUserName = ref(dati.profileName);
    console.log(dati.id);
    userIdView = ref(dati.id);
    postProfilePicture = ref(dati.profileImage);
    postTime = ref('12 dicembe');
    postImage = ref(dati.postImage);
    postDescription = ref(dati.description);
    openPopup('VisualizzaPost');
  }

}


// export function apriPopUpVisualizzaV2(tipo:string, id:number) {
//     //scatta evento su mappa 
//     if (tipo == 'post') {
//       postUserName = ref(dati.profileName);
//       postProfilePicture = ref(dati.profileImage);
//       postTime = ref('12 dicembe');
//       postImage = ref(dati.postImage);
//       postDescription = ref(dati.description);
//       openPopup('VisualizzaPost');
//     }
  
//   }
