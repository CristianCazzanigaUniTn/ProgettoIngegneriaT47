
import { ref } from 'vue';
import { estraiDati, Posted } from './estraiDati.ts'
import { AggiornaMappa, chiudiPopUpAnim, apriPopUpAnim } from './map.ts';
import { estraieventoid, estraiInformazioniEventi, estraiInformazioniPost, estraiPartecipazioniParty, estraipartyid } from './popup';
import { loggedUser } from '../../states/loggedUser.ts';

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

export function openPopup(type: any, posizione: any) {
  //animaazione
  apriPopUpAnim(posizione);
  if (type === "CreaPost") showPopupCreaPost.value = true;
  if (type === "CreaParty") showPopupCreaParty.value = true;
  if (type === "CreaEvento") showPopupCreaEvento.value = true;
  if (type === "VisualizzaPost") showPopupPost.value = true; // Apri il popup del post
  if (type === "VisualizzaPartyEvento") showPopupPartyEvento.value = true; 
}

// Funzione per chiudere i popup
export function closePopup(type: any) {
  chiudiPopUpAnim();
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
export var idp = ref('');

//campi party ed evento
export var profileNameep = ref('');
export var userIdViewep = ref('');
export var profileImageep = ref('');
export var timeep = ref('');
export var partyImageep = ref('');
export var descriptionep = ref('');
export var currentParticipantsep = ref();
export var maxParticipantsep = ref('');
export var categoryep = ref('');
export var organizza = ref();
export var isParty = ref();
export var idep = ref('');


//elminare
export async function apriPopUpVisualizza(dati:any) {
  //scatta evento su mappa 
  if (dati.dataType == 'post') {
    
    idp = ref(dati.dataIndex);
    organizza = ref(dati.id === loggedUser.id);
    postUserName = ref(dati.profileName);
    userIdView = ref(dati.id);
    postProfilePicture = ref(dati.profileImage);
    postTime = ref('12 dicembe');
    postImage = ref(dati.postImage);
    postDescription = ref(dati.description);

    openPopup('VisualizzaPost', {lat: dati.latitudine, lng: dati.longitudine});
  }
  else if (dati.dataType == 'party')
  {
    organizza = ref(dati.id === loggedUser.id);
    isParty = ref(true);
    idep = ref(dati.dataIndex);
    const party = await estraipartyid(dati.dataIndex);
      if(party){
        profileNameep = ref(party.profileName);
        userIdViewep = ref(party.id);
        profileImageep = ref(party.profileImage);
        partyImageep = ref(party.postImage);
        descriptionep = ref(party.description);
        maxParticipantsep = ref(party.maxpartecipanti);
        categoryep = ref(party.Categoria);
        timeep = ref(party.time);
        openPopup('VisualizzaPartyEvento', { lat: dati.latitudine, lng: dati.longitudine });
      }
    }
  else if(dati.dataType == 'evento')
  {
    organizza = ref(dati.id === loggedUser.id);
    isParty = ref(false);
    idep = ref(dati.dataIndex);

    const evento = await estraieventoid(dati.dataIndex);
      if (evento) {
        profileNameep = ref(evento.profileName);
        userIdViewep = ref(evento.id);
        profileImageep = ref(evento.profileImage);
        timeep = ref(evento.time);
        partyImageep = ref(evento.postImage);
        descriptionep = ref(evento.description);
        maxParticipantsep = ref(evento.maxpartecipanti);
        categoryep = ref(evento.Categoria);

        openPopup('VisualizzaPartyEvento', {lat: dati.latitudine, lng: dati.longitudine});
      }
    
  }
}

