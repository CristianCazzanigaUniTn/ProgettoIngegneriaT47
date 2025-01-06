
import { ref } from 'vue';
import { estraiDati, Posted } from './EstraiDati.ts';  // Importa estraiDati
import { AggiornaMappa } from './map.ts';


// Logica della mappa e popup
export const showPopupCreaPost = ref(false);
export const showPopupCreaEvento = ref(false);
export const showPopupCreaParty = ref(false);
export const showPopupPost = ref(false);
export const showPopupPartyEvento = ref(false);
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
  if (type === "VisualizzaPartyEvento") showPopupPartyEvento.value = true; 
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
    if (type === "VisualizzaPartyEvento") showPopupPartyEvento.value = false; 
}

//campi post
export var postUserName = ref('');
export var userIdView = ref('');
export var postProfilePicture = ref('');
export var postTime = ref('');
export var postImage = ref('');
export var postDescription = ref('');

//campi party
export var profileNameep = ref('');
export var userIdViewep = ref('');
export var profileImageep = ref('');
export var timeep = ref('');
export var partyImageep = ref('');
export var descriptionep = ref('');
export var currentParticipantsep = ref('');
export var maxParticipantsep = ref('');
export var categoryep = ref('');


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
  else if (dati.dataType == 'party')
  {
    profileNameep = ref(dati.profileName);
    userIdViewep = ref(dati.id);
    profileImageep = ref(dati.profileImage);
    timeep = ref('12 dicembe');
    partyImageep = ref(dati.postImage);
    descriptionep = ref(dati.description);
    currentParticipantsep = ref('12');
    maxParticipantsep = ref('30');
    categoryep = ref('giulia');
    openPopup('VisualizzaPartyEvento');
  }
  else if(dati.dataType == 'evento')
  {
    profileNameep = ref(dati.profileName);
    userIdViewep = ref(dati.id);
    profileImageep = ref(dati.profileImage);
    timeep = ref('12 dicembe');
    partyImageep = ref(dati.postImage);
    descriptionep = ref(dati.description);
    currentParticipantsep = ref('12');
    maxParticipantsep = ref('30');
    categoryep = ref('giulia');
    openPopup('VisualizzaPartyEvento');
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
