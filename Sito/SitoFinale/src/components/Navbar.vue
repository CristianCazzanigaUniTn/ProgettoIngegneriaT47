<script>
import { computed } from 'vue';
import { authState } from '@/scripts/authstate/authState.js'; // Importa authState

export default {
  name: 'Navbar',
  setup() {
    // Utilizza computed per tenere traccia dello stato di autenticazione e dell'ID dell'utente
    const isAuthenticated = computed(() => authState.isAuthenticated);
    const userId = computed(() => authState.userId);

    return {
      isAuthenticated,
      userId,
    };
  },
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>Evently</h1>
    </div>
    <div class="navbar-center">
      <router-link to="/" id="home">ACCEDI</router-link>
      <router-link to="/mappa" id="mappa">MAPPA</router-link>

      <!-- Link al profilo solo se l'utente è autenticato -->
      <router-link
        v-if="isAuthenticated"
        :to="`/profilo/${userId}`" 
        id="profilo"
      >
        PROFILO
      </router-link>
      
      <!-- Link al profilo disabilitato se non autenticato -->
      <router-link
        v-else
        to="/"
        id="profilo"
        class="profilo-link disabled"
        @click.prevent
      >
        PROFILO
      </router-link>

      <router-link to="/chiSiamo" id="chiSiamo">CHI SIAMO</router-link>
    </div>
    <div class="navbar-right">
      <input type="text" placeholder="Cerca" class="search-bar" />
      <img src="@/assets/imp.png" alt="Impostazioni" class="settings-icon" />
    </div>
  </nav>
</template>

<style scoped>
.profilo-link.disabled {
  color: gray;
  cursor: not-allowed;
}
</style>

<style src="@/styles/navbar.css"></style>
