<script setup>
import { computed } from 'vue';
import { onMounted } from 'vue'; 
import { ref } from 'vue'; 
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import { initializeMap } from '../scripts/MapPage/map';
import { inizializeLoader } from '../scripts/MapPage/loader';
import Popup from '@/components/Popup.vue'; // Importa il componente Popup

// Stato di autenticazione
const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const username = computed(() => loggedUser.username);
const userProfilePicture = computed(() => loggedUser.foto_profilo);

// Logica di logout
function handleLogout() {
  clearLoggedUser();  
  router.push("/");
}

// Logica della mappa e popup
const showPopup = ref(false);
const userName = computed(() => (isAuthenticated.value ? username.value : ''));
const profilePicture = computed(() => (isAuthenticated.value ? userProfilePicture.value : ''));
const description = 'This is a post description.';
const location = '12.21341, 48.123143';
const dateTime = '2024-12-08 14:30';

function openPopup() {
  showPopup.value = true;
}

function closePopup() {
  showPopup.value = false;
}

function initMap() {
  initializeMap();
  inizializeLoader();
  console.log("ciao");
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
    <div v-if="isAuthenticated" id="floatingButton">
      <span class="plus">+</span>
      <span @click="openPopup" class="text1">Post</span>
      <span class="text2">Party</span>
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

  <!-- Popup per la creazione di Post/Party -->
  <Popup
    v-if="showPopup"
    :isVisible="showPopup"
    :userName="userName"
    :profilePicture="profilePicture"
    :description="description"
    :location="location"
    :dateTime="dateTime"
    @close-popup="closePopup"
  />
</template>

<style scoped src="@/styles/mappa.css"></style>
