
import { ref } from 'vue';
import { estraiDati, Posted } from './estraiDati.ts'
import { AggiornaMappa } from './map.ts';
import { estraieventoid, estraiInformazioniEventi, estraiInformazioniPost, estraiPartecipazioniParty, estraipartyid } from './popup';
import { loggedUser } from '../../states/loggedUser.ts';
import { getPosition } from '../tools/posizione';


// Logica della mappa e popup
export const showPopupCreaPost = ref(false);
export const showPopupCreaEvento = ref(false);
export const showPopupCreaParty = ref(false);
export const showPopupPost = ref(false);
export const showPopupPartyEvento = ref(false);



export function CloseAllPopup() {
  showPopupCreaPost.value = false;
  showPopupCreaParty.value = false;
  showPopupCreaEvento.value = false;
  showPopupPost.value = false; // Chiudi il popup del post 
  showPopupPartyEvento.value = false;
}


export const description = 'This is a post description.';
export const location = '12.21341, 48.123143';
export const dateTime = '2024-12-08 14:30';

// Stato per le sideCards
export var sideCards = ref<Posted[]>([]);

export interface FiltriRicerca {
  post: boolean;
  textual: boolean;
  evento: boolean;
  party: boolean;
}

export async function aggiornaTutto(filtri: FiltriRicerca) {
  const posizione = await getPosition();
  const lat = posizione.latitudine; // Latitudine, puoi cambiarla con i dati correnti della mappa
  const lng = posizione.longitudine; // Longitudine, anche qui usa i dati correnti
  const rad = 15;

  // Recupera i dati
  const cards = await estraiDati(lat, lng, rad);
 
  // Filtra i dati in base ai filtri attivi
  const filteredCards = cards.filter((card) => {
    console.log(card.dataType);
    switch (card.dataType) {
      case 'post':
        return filtri.post;
      case 'textual':
        return filtri.textual;
      case 'evento':
        return filtri.evento;
      case 'party':
        return filtri.party;
      default:
        return false; // Ignora tipi non riconosciuti
    }
  });


  // Mescola casualmente i risultati
  const shuffledCards = filteredCards.sort(() => Math.random() - 0.5);

  // Aggiorna la sideBar
  sideCards.value = shuffledCards;

  // Aggiorna la mappa
  AggiornaMappa(shuffledCards);
}

export async function ordinaSidebar(tipo: string = '') {
  var cards = sideCards.value;
  if (!tipo) {
    for (let i = cards.length - 1; i > 0; i--) {
      const shuffledCards = cards.sort(() => Math.random() - 0.5);
      cards=shuffledCards;
    }
  } else {
    cards.sort((a, b) => {
      if (a.dataType === tipo && b.dataType !== tipo) {
        return -1; 
      }
      if (a.dataType !== tipo && b.dataType === tipo) {
        return 1; 
      }
      return 0; 
    });
  }
  sideCards.value = cards;
}



export function openPopup(type:any) {
  CloseAllPopup();
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
        showPopupPost.value = false; 
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
export var partecipa = ref();
export var isParty = ref();
export var idep = ref('');


//campi solo evento
export var faq = ref([]);

//elminare
export async function apriPopUpVisualizza(dati:any) {
  //scatta evento su mappa 
  if (dati.dataType == 'post') {
    const infoPost = await estraiInformazioniPost(dati.dataIndex);
    postUserName = ref(dati.profileName);
    userIdView = ref(dati.id);
    postProfilePicture = ref(dati.profileImage);
    postTime = ref('12 dicembe');
    postImage = ref(dati.postImage);
    postDescription = ref(dati.description);

    console.log("Numero di like: ", infoPost.like.length);

    console.log("Commenti: ", infoPost.commento_like.length);

    if(infoPost.commento_like.length > 0){
      infoPost.commento_like.array.forEach((element: any) => {
        console.log(element.utUsername)
        console.log(element.testocommento, '\t', element.nlike);
      });
    }
    openPopup('VisualizzaPost');
  }
  else if (dati.dataType == 'party')
  {
    const infoParty = await estraiPartecipazioniParty(dati.dataIndex);
    organizza = ref(dati.id === loggedUser.id)
    console.log(infoParty.partecipa)
    partecipa = ref(infoParty.partecipa);
    isParty = ref(true);
    idep = ref(dati.dataIndex);
    const party = await estraipartyid(dati.dataIndex);
    if(party){
      profileNameep = ref(party.profileName);
      userIdViewep = ref(party.id);
      profileImageep = ref(party.profileImage);
      partyImageep = ref(party.postImage);
      descriptionep = ref(party.description);
      currentParticipantsep = ref(infoParty.numero_partecipazioni);
      maxParticipantsep = ref(party.maxpartecipanti);
      categoryep = ref(party.Categoria);
      timeep = ref(party.time);
      openPopup('VisualizzaPartyEvento');}
    }
  else if(dati.dataType == 'evento')
  {
    const infoEvento = await estraiInformazioniEventi(dati.dataIndex);
    organizza = ref(dati.id === loggedUser.id);
    console.log(infoEvento.partecipa)
    partecipa = ref(infoEvento.partecipa);
    isParty = ref(false);
    idep = ref(dati.dataIndex);


    if(infoEvento.faq){
      faq = ref(infoEvento.faq);
    }

    const evento = await estraieventoid(dati.dataIndex);
    if (evento) {
      profileNameep = ref(evento.profileName);
      userIdViewep = ref(evento.id);
      profileImageep = ref(evento.profileImage);
      timeep = ref(evento.time);
      partyImageep = ref(evento.postImage);
      descriptionep = ref(evento.description);
      currentParticipantsep = ref(infoEvento.numero_partecipazioni);
      maxParticipantsep = ref(evento.maxpartecipanti);
      categoryep = ref(evento.Categoria);

      openPopup('VisualizzaPartyEvento');
    }
    
  }
}


export const filtri = ref({
  post: true,
  textual: true,
  evento: true,
  party: true,
});

export const selectedOption = ref(''); 

export function selectOption(option: string) {
  if (selectedOption.value === option) {
    selectedOption.value = ''; 
    ordinaSidebar(); 
  } else {
    selectedOption.value = option; 
    ordinaSidebar(option); 
  }
}


export async function Aggiorna() {
  aggiornaTutto(filtri.value);
  if (selectedOption.value) {
    ordinaSidebar(selectedOption.value);
  }
}