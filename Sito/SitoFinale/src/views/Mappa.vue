<script setup>
import { computed, ref, onMounted } from 'vue';
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import { initializeMap, AggiornaMappa } from '../scripts/MapPage/map';
import { inizializeLoader } from '../scripts/MapPage/loader';
import CreaPostPopup from '@/components/mapComponents/CreaPopup/CreaPostPopup.vue';
import CreaPartyPopup from '@/components/mapComponents/CreaPopup/CreaPartyPopup.vue';
import CreaEventoPopup from '@/components/mapComponents/CreaPopup/CreaEventoPopup.vue';
import PostPopup from '@/components/mapComponents/ViewPopup/VisualizzaPostPopup.vue';
import PartyEventoPopup from '@/components/mapComponents/ViewPopup/VisualizzaEventoParty.vue';
import { eliminaEvento, eliminaParty, partecipaEvento, partecipaParty, disinscriviEvento, disinscriviParty } from '../scripts/MapPage/popup';

import { showPopupPartyEvento, showPopupCreaEvento, showPopupCreaParty, showPopupCreaPost, showPopupPost, aggiornaTutto, sideCards, openPopup, closePopup, description, location, dateTime, apriPopUpVisualizza, postUserName, postProfilePicture, postTime, postImage, postDescription, userIdView} from '@/scripts/MapPage/PageScript.ts';
import { idep, isParty, faq, organizza, partecipa, profileNameep, profileImageep, partyImageep, descriptionep, timeep, userIdViewep, currentParticipantsep, maxParticipantsep, categoryep } from '@/scripts/MapPage/PageScript.ts';


// Stato di autenticazione
const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const username = computed(() => loggedUser.username);
const userProfilePicture = computed(() => loggedUser.foto_profilo);
const ruolo = computed(() => loggedUser.ruolo);
const userName = computed(() => (isAuthenticated.value ? username.value : ''));
const profilePicture = computed(() => (isAuthenticated.value ? userProfilePicture.value : ''));
const Ruolo = computed(() => (isAuthenticated.value ? ruolo.value : ''));


// Logica di logout
function handleLogout() {
  clearLoggedUser();
  router.push("/");
}

function initMap() {
  initializeMap();
  inizializeLoader();
  console.log("Mappa inizializzata");
  // Carica i dati per le cards al momento della inizializzazione della mappa
  aggiornaTutto();
}


onMounted(() => {
  initMap();
});


</script>


<template>
  <!-- Loader -->
  <div id="loader" v-if="!isAuthenticated">
    <div class="left-curtain"></div>
    <div class="right-curtain"></div>
    <div class="center-content">
      <h1>Loading..</h1>
      <img src="@/assets/attendi.png" alt="Logoload" class="logoload" />
    </div>
  </div>

  <!-- Contenuto -->
  <div class="content">
    <!-- Pulsante di creazione Post/Party -->
    <div v-if="isAuthenticated">
      <div id="floatingButton">
        <span class="plus">+</span>
        <div v-if="Ruolo === 'utente_base'">
          <span @click="openPopup('CreaPost')" class="text1">Post</span>
          <span @click="openPopup('CreaParty')" class="text2">Party</span>
        </div>
        <div v-else-if="Ruolo === 'organizzatore'">
          <span @click="openPopup('CreaEvento')" class="text3">Evento</span>
        </div>
      </div>
    </div>

    <!-- Box di contenuto con mappa e sidebar -->
    <div class="container-box">
      <div class="left">
        <div class="filtri">
          <!-- Immagine del filtro con azione per aprire il popup -->
          <img src="@/assets/filtri.png" alt="Filtri" @click="apriPopUpVisualizza(1, 'post')" />
          <img src="@/assets/ordina.png" alt="Ordina" />
        </div>
        <aside class="sidebar">
          <div v-for="(card, index) in sideCards" :key="index" class="card" :data-index="card.dataIndex"
            :data-type="card.dataType">
            <div class="card-header">
              <img class="card-img-top" :src="card.profileImage" alt="Foto Profilo">
              <strong>{{ card.profileName }}</strong>
            </div>
            <div class="card-body">
              <img v-if="card.postImage" class="post-image" :src="card.postImage" alt="Foto Post" />
              <p class="card-description">{{ card.description }}</p>
            </div>
          </div>
        </aside>
      </div>
      <div class="right">
        <div id="map"></div>
      </div>
    </div>
  </div>

  <!-- Popup per la visualizzazione del Post -->
  <PostPopup v-if="showPopupPost" :isVisible="showPopupPost" :profileName="postUserName"
    :profileImage="postProfilePicture" :postImage="postImage" :description="postDescription" :time="postTime" :userIdView="userIdView"
    @close-popup="closePopup('VisualizzaPost')" />

 <!-- Popup per la visualizzazione del Party/Evento -->
    <PartyEventoPopup v-if="showPopupPartyEvento" :isVisible="showPopupPartyEvento" :profileNameEP="profileNameep"
    :profileImageEP="profileImageep" :partyImageEP="partyImageep" :descriptionEP="descriptionep" :timeEP="timeep" :userIdViewEP="userIdViewep"
    :currentParticipantsEP="currentParticipantsep" :maxParticipantsEP="maxParticipantsep" :categoryEP="categoryep" :organizzaEP="organizza" :partecipaEP="partecipa" :faq="faq"
    :idEP="idep" @close-popup="closePopup('VisualizzaPartyEvento')" />

  <!-- Popup per la creazione di Post -->
  <CreaPostPopup v-if="showPopupCreaPost" :isVisible="showPopupCreaPost" :userName="userName"
    :profilePicture="profilePicture" :description="description" :location="location" :dateTime="dateTime"
    @close-popup="closePopup('CreaPost')" />

  <!-- Popup per la creazione di Party -->
  <CreaPartyPopup v-if="showPopupCreaParty" :isVisible="showPopupCreaParty" @close-popup="closePopup('CreaParty')" />
  <!-- Popup per la creazione di Evento -->
  <CreaEventoPopup v-if="showPopupCreaEvento" :isVisible="showPopupCreaEvento"
    @close-popup="closePopup('CreaEvento')" />
</template>


<style scoped src="@/styles/mappa.css"></style>