<script setup>
import { computed, ref, onMounted } from 'vue';
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import { initializeMap, AggiornaMappa } from '../scripts/MapPage/map';
// import { inizializeLoader } from '../scripts/MapPage/loader';
import CreaPostPopup from '@/components/mapComponents/CreaPopup/CreaPostPopup.vue';
import CreaPartyPopup from '@/components/mapComponents/CreaPopup/CreaPartyPopup.vue';
import CreaEventoPopup from '@/components/mapComponents/CreaPopup/CreaEventoPopup.vue';
import PostPopup from '@/components/mapComponents/ViewPopup/VisualizzaPostPopup.vue';
import SideCard from '@/components/mapComponents/mapElements/SideCard.vue';
import PartyEventoPopup from '@/components/mapComponents/ViewPopup/VisualizzaEventoParty.vue';

import { showPopupPartyEvento, showPopupCreaEvento, showPopupCreaParty, showPopupCreaPost, showPopupPost, aggiornaTutto, sideCards, openPopup, closePopup, apriPopUpVisualizza, postUserName, postProfilePicture, postTime, postImage, postDescription, userIdView } from '@/scripts/MapPage/PageScript.ts';
import { isLoading, filtri, selectedOption, selectOption, Aggiorna, ordinaSidebar, CloseAllPopup, idep, isParty, organizza, profileNameep, profileImageep, partyImageep, descriptionep, timeep, userIdViewep, maxParticipantsep, categoryep } from '@/scripts/MapPage/PageScript.ts';


import { eliminaEvento, eliminaParty, partecipaEvento, partecipaParty, disinscriviEvento, disinscriviParty } from '../scripts/MapPage/popup';

const filtroSinistra = ref(false);
const filtroDestra = ref(false);

// Stato di autenticazione
const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const username = computed(() => loggedUser.username);
const userProfilePicture = computed(() => loggedUser.foto_profilo);
const ruolo = computed(() => loggedUser.ruolo);
const userName = computed(() => (isAuthenticated.value ? username.value : ''));
const profilePicture = computed(() => (isAuthenticated.value ? userProfilePicture.value : ''));
const Ruolo = computed(() => (isAuthenticated.value ? ruolo.value : ''));

CloseAllPopup();
// Logica di logout
function handleLogout() {
  clearLoggedUser();
  router.push("/login");
}




async function initMap() {
  try {
    initializeMap();
    await Aggiorna();
  } catch (error) {
    console.error("Errore durante l'inizializzazione della mappa:", error);
  }
}


onMounted(() => {
  initMap();
});


</script>


<template>
  <div class="contenitoreGenerale">
  <!-- Loader -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <h1>Caricamento...</h1>
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
          <div class="filter-container" @mouseenter="filtroSinistra = true" @mouseleave="filtroSinistra = false">
            <img src="@/assets/filtri.png" alt="Filter Icon" style="cursor:pointer;" />
            <div class="filter-window" v-if="filtroSinistra">
              <h4>Visualizza</h4>
              <div class="filter-options">
                <div>
                  <label><input type="checkbox" v-model="filtri.post" @change="Aggiorna" /> Post</label>
                  <label><input type="checkbox" v-model="filtri.party" @change="Aggiorna" /> Party</label>
                  <label><input type="checkbox" v-model="filtri.evento" @change="Aggiorna" /> Eventi</label>
                  <label><input type="checkbox" v-model="filtri.textual" @change="Aggiorna" /> Text</label>
                </div>
              </div>
            </div>
          </div>


          <div class="filter-container" @mouseenter="filtroDestra = true" @mouseleave="filtroDestra = false">
            <img src="@/assets/ordina.png" alt="Filter Icon" style="cursor:pointer;" />
            <div v-if="filtroDestra" class="filter-window">
              <h4>Ordina</h4>
              <div class="filter-options">
                <div>
                  <label>
                    <input type="checkbox" :checked="selectedOption === 'post'" @change="selectOption('post')" />
                    Post
                  </label>
                  <label>
                    <input type="checkbox" :checked="selectedOption === 'textual'" @change="selectOption('textual')" />
                    Textual
                  </label>
                  <label>
                    <input type="checkbox" :checked="selectedOption === 'party'" @change="selectOption('party')" />
                    Party
                  </label>
                  <label>
                    <input type="checkbox" :checked="selectedOption === 'evento'" @change="selectOption('evento')" />
                    Evento
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>


        <aside class="sidebar">
          <div v-for="(card, index) in sideCards" :key="index">
            <SideCard :profileName="card.profileName" :profileImage="card.profileImage" :postImage="card.postImage"
              :description="card.description" :dataIndex="card.dataIndex" :dataType="card.dataType" :id="card.id" :latitudine="card.latitudine" :longitudine="card.longitudine" />
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
    :profileImage="postProfilePicture" :postImage="postImage" :description="postDescription" :time="postTime"
    :userIdView="userIdView" :organizzaP="organizza" @close-popup="closePopup('VisualizzaPost')" />

  <!-- Popup per la visualizzazione del Party/Evento -->
  <PartyEventoPopup v-if="showPopupPartyEvento" :isVisible="showPopupPartyEvento" :profileNameEP="profileNameep"
    :profileImageEP="profileImageep" :partyImageEP="partyImageep" :descriptionEP="descriptionep" :timeEP="timeep"
    :userIdViewEP="userIdViewep" :maxParticipantsEP="maxParticipantsep"
    :categoryEP="categoryep" :organizzaEP="organizza" :idEP="idep"
    @close-popup="closePopup('VisualizzaPartyEvento')" />

  <!-- Popup per la creazione di Post -->
  <CreaPostPopup v-if="showPopupCreaPost" :isVisible="showPopupCreaPost" :userName="userName"
    :profilePicture="profilePicture" :description="description" :location="location" :dateTime="dateTime"
    @close-popup="closePopup('CreaPost')" />

  <!-- Popup per la creazione di Party -->
  <CreaPartyPopup v-if="showPopupCreaParty" :isVisible="showPopupCreaParty" @close-popup="closePopup('CreaParty')" />
  <!-- Popup per la creazione di Evento -->
  <CreaEventoPopup v-if="showPopupCreaEvento" :isVisible="showPopupCreaEvento"
    @close-popup="closePopup('CreaEvento')" />
  </div>
</template>


<style scoped src="@/styles/mappa.css"></style>
