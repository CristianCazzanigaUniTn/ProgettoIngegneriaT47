
import { ref } from 'vue';
import { estraiDati, Posted } from './estraiDati.ts'
import { AggiornaMappa, chiudiPopUpAnim, apriPopUpAnim } from './map.ts';
import { estraiCategorie, estraieventoid, estraipartyid } from './popup';
import { loggedUser } from '../../states/loggedUser.ts';
import { getPosition } from '../Tools/posizione';


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

// Stato per le sideCards
export var sideCards = ref<Posted[]>([]);
export var categorie = ref([]);

export interface FiltriRicerca {
  post: boolean;
  textual: boolean;
  evento: boolean;
  party: boolean;
}

export async function aggiornaTutto(filtri: FiltriRicerca, latitudine: number, longitudine: number, raggio :number) {
  

  // Recupera i dati
  const cards = await estraiDati(latitudine, longitudine, raggio);
 
  // Filtra i dati in base ai filtri attivi
  const filteredCards = cards.filter((card) => {
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
  categorie.value = await estraiCategorie();

  // Aggiorna la mappa
  await AggiornaMappa(shuffledCards);
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



export function openPopup(type:any, posizione:any) {
  CloseAllPopup();
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

export const isLoading = ref(true);

export async function Aggiorna(lat?: number, lng?: number, rad: number = 15): Promise<void> {
  try {
    // Attiva il loader
    isLoading.value = true;
    console.log("eccomi");
    let posizioneLat: number;
    let posizioneLng: number;

    if (lat !== undefined && lng !== undefined) {
      posizioneLat = lat;
      posizioneLng = lng;
    } else {
      const posizione = await getPosition();
      posizioneLat = posizione.latitudine;
      posizioneLng = posizione.longitudine;
    }

    // Aggiorna i dati
    await aggiornaTutto(filtri.value, posizioneLat, posizioneLng, rad);
    
    // Ordina la sidebar se un'opzione è selezionata
    if (selectedOption.value) {
      await ordinaSidebar(selectedOption.value);
    }
  } catch (error) {
    alert("Errore durante l'aggiornamento: " + error);
  } finally {
    // Disattiva il loader
    isLoading.value = false;
  }
}
