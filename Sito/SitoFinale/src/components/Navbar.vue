<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router'; // Importa useRoute
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import { teletrasportati } from '@/scripts/MapPage/map';

const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const username = computed(() => loggedUser.username);
const userProfilePicture = computed(() => loggedUser.foto_profilo);

const API_KEY = '_jHN61-qnqIeFE6EWtK6XQXa-FWYuKNGtu2NPEI1bCw';
const searchQuery = ref('');
const suggestions = ref([]);
const result = ref('');
const route = useRoute(); // Usa la route per verificare la rotta corrente

async function fetchSuggestions(query) {
  const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&limit=4&types=city`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items.map(item => ({ name: item.title }));
}

async function fetchCoordinates(cityName) {
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(cityName)}&apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].position;
  } else {
    throw new Error('Coordinate non trovate.');
  }
}

function handleSearchInput() {
  if (searchQuery.value.trim().length > 2) {
    fetchSuggestions(searchQuery.value.trim())
      .then(matches => {
        suggestions.value = matches;
      })
      .catch(error => console.error('Errore durante la chiamata API:', error));
  } else {
    suggestions.value = [];
  }
}

function handleSuggestionClick(city) {
  searchQuery.value = city.name;
  suggestions.value = [];
  fetchCoordinates(city.name)
    .then(coordinates => {
      // andare a queste coordinate
      teletrasportati(coordinates.lat, coordinates.lng);
      console.log(`Coordinate di ${city.name}: Lat ${coordinates.lat}, Lon ${coordinates.lng}`);
    })
    .catch(error => {
      console.error(error);
    });
}

function handleLogout() {
  clearLoggedUser();
  router.push('/');
}

const showSearchBar = computed(() => route.path === '/mappa'); 
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>Evently</h1>
    </div>
    <div class="navbar-center">
      <router-link v-if="isAuthenticated" :to="`/profilo/${userId}`" id="profilo">
        <span class="username">
          <img v-if="userProfilePicture" :src="userProfilePicture" alt="Foto Profilo" class="profile-picture" />
          {{ username }}
        </span>
      </router-link>
      <router-link v-if="!isAuthenticated" to="/" id="home">ACCEDI</router-link>
      <router-link to="/mappa" id="mappa">MAPPA</router-link>
      <router-link v-if="!isAuthenticated" to="/" id="profilo" class="profilo-link disabled" @click.prevent>
        PROFILO
      </router-link>
      <router-link to="/chiSiamo" id="chiSiamo">CHI SIAMO</router-link>
    </div>
    <div class="navbar-right">
      <div v-if="showSearchBar" class="search-container">
        <input 
          type="text" 
          id="search" 
          placeholder="Cerca" 
          class="search-bar" 
          v-model="searchQuery" 
          @input="handleSearchInput" 
          autocomplete="off" 
        />
        <div id="suggestions" class="suggestions">
          <div 
            v-for="(city, index) in suggestions" 
            :key="index" 
            class="suggestion" 
            @click="handleSuggestionClick(city)"
          >
            {{ city.name }}
          </div>
        </div>
      </div>
      <img 
        src="@/assets/imp.png" 
        alt="Impostazioni" 
        class="settings-icon" 
        @click="isAuthenticated ? handleLogout() : null" 
      />
    </div>
  </nav>
</template>

<style scoped src="@/styles/navbar.css"></style>
