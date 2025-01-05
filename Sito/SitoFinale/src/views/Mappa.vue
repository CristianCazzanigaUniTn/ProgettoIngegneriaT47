<script setup>
import { computed, ref, onMounted } from 'vue';
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import { initializeMap } from '../scripts/MapPage/map';
import { inizializeLoader } from '../scripts/MapPage/loader';
import CreaPostPopup from '@/components/mapComponents/CreaPopup/CreaPostPopup.vue';
import CreaPartyPopup from '@/components/mapComponents/CreaPopup/CreaPartyPopup.vue';
import CreaEventoPopup from '@/components/mapComponents/CreaPopup/CreaEventoPopup.vue';
import { estraiDati } from '@/scripts/MapPage/AggiornaSideBar.ts';  // Importa estraiDati

// Stato di autenticazione
const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const username = computed(() => loggedUser.username);
const userProfilePicture = computed(() => loggedUser.foto_profilo);
const ruolo = computed(() => loggedUser.ruolo);

// Logica di logout
function handleLogout() {
  clearLoggedUser();
  router.push("/");
}

// Logica della mappa e popup
const showPopupCreaPost = ref(false);
const showPopupCreaEvento = ref(false);
const showPopupCreaParty = ref(false);
const userName = computed(() => (isAuthenticated.value ? username.value : ''));
const profilePicture = computed(() => (isAuthenticated.value ? userProfilePicture.value : ''));
const Ruolo = computed(() => (isAuthenticated.value ? ruolo.value : ''));
const description = 'This is a post description.';
const location = '12.21341, 48.123143';
const dateTime = '2024-12-08 14:30';

// Stato per le sideCards
const sideCards = ref([]); // Dichiara la variabile per le cards

function openPopup(type) {
  if (type === 'CreaPost') showPopupCreaPost.value = true;
  if (type === 'CreaParty') showPopupCreaParty.value = true;
  if (type === 'CreaEvento') showPopupCreaEvento.value = true;
}

function closePopup(type) {
  if (type === 'CreaPost') showPopupCreaPost.value = false;
  if (type === 'CreaParty') showPopupCreaParty.value = false;
  if (type === 'CreaEvento') showPopupCreaEvento.value = false;
}

function initMap() {
  initializeMap();
  inizializeLoader();
  console.log("Mappa inizializzata");
  // Carica i dati per le cards al momento della inizializzazione della mappa
  loadSideCards(); 
}

async function loadSideCards() {
  const lat = 45.0; // Latitudine, puoi cambiarla con i dati correnti della mappa
  const lng = 7.0;  // Longitudine, anche qui usa i dati correnti
  const rad = 100000000000000;   // Raggio di ricerca (puoi anche usarlo dinamicamente)

  // Chiamata per estrarre i dati delle cards
  const cards = await estraiDati(lat, lng, rad);
  sideCards.value = cards;  // Popola la lista delle cards
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
          <img src="@/assets/filtri.png" />
          <img src="@/assets/ordina.png" />
        </div>
        <aside class="sidebar">
          <div v-for="(card, index) in sideCards" :key="index" class="card" :data-index="card.dataIndex" :data-type="card.dataType">
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
