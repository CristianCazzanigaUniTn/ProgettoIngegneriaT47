<script setup>
import { computed, ref, onMounted } from 'vue';
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import { initializeMap } from '../scripts/MapPage/map';
import { inizializeLoader } from '../scripts/MapPage/loader';
import CreaPostPopup from '@/components/mapComponents/CreaPopup/CreaPostPopup.vue';
import CreaPartyPopup from '@/components/mapComponents/CreaPopup/CreaPartyPopup.vue';

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
const showPopupCreaParty = ref(false);
const userName = computed(() => (isAuthenticated.value ? username.value : ''));
const profilePicture = computed(() => (isAuthenticated.value ? userProfilePicture.value : ''));
const Ruolo = computed(() => (isAuthenticated.value ? ruolo.value : ''));
const description = 'This is a post description.';
const location = '12.21341, 48.123143';
const dateTime = '2024-12-08 14:30';

function openPopup(type) {
  if (type === 'post') showPopupCreaPost.value = true;
  if (type === 'party') showPopupCreaParty.value = true;
}

function closePopup(type) {
  if (type === 'post') showPopupCreaPost.value = false;
  if (type === 'party') showPopupCreaParty.value = false;
}

function initMap() {
  initializeMap();
  inizializeLoader();
  console.log("Mappa inizializzata");
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
          <span @click="openPopup('post')" class="text1">Post</span>
          <span @click="openPopup('party')" class="text2">Party</span>
        </div>
        <div v-else-if="Ruolo === 'organizzatore'">
          <span class="text3">Evento</span>
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
        <aside class="sidebar"></aside>
      </div>
      <div class="right">
        <div id="map"></div>
      </div>
    </div>
  </div>

  <!-- Popup per la creazione di Post -->
  <CreaPostPopup v-if="showPopupCreaPost" :isVisible="showPopupCreaPost" :userName="userName"
    :profilePicture="profilePicture" :description="description" :location="location" :dateTime="dateTime"
    @close-popup="closePopup('post')" />

  <!-- Popup per la creazione di Party -->
  <CreaPartyPopup v-if="showPopupCreaParty" :isVisible="showPopupCreaParty" @close-popup="closePopup('party')" />
</template>

<style scoped src="@/styles/mappa.css"></style>
