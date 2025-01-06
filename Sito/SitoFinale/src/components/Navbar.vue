<script setup>
import { computed } from 'vue';
import { loggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';

const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const username = computed(() => loggedUser.username);
const userProfilePicture = computed(() => loggedUser.foto_profilo); // Aggiungi questa riga per la foto del profilo

function handleLogout() {
  clearLoggedUser();  
  router.push("/");
}
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
      <input type="text" placeholder="Cerca" class="search-bar" />
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
