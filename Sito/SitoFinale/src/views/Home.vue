<script setup>
import { ref } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:3000`;
const API_URL = HOST + `/api/v1`;

const username = ref('');
const password = ref('');
const email = ref('');
const isLoginForm = ref(true);

const emit = defineEmits(['login']);


function login() {
  fetch(API_URL + '/authentications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value }),
  })
    .then((resp) => resp.json())
    .then(function (data) {
      setLoggedUser(data);
      emit('login', loggedUser);
      if (loggedUser.token) {
        router.push("/mappa");
      }
      return;
    })
    .catch((error) => console.error(error));
}


function register() {

}

// Funzione di logout
function logout() {
  clearLoggedUser();
}
</script>

<template>
  <div class="contenitoreGenerale">
  <form>
    <span v-if="loggedUser.token">
      Welcome <a :href="HOST + '/' + loggedUser.self">{{ loggedUser.username }}</a>
      <button type="button" @click="logout">LogOut</button>
    </span>

    <span v-if="!loggedUser.token">
      <div class="login-box">
        <p class="small-text">IL SOCIAL NETWORK DI CUI HAI BISOGNO</p>
        <h1 class="title">EVENTLY</h1>
        <p class="sub-text">ENTRA e partecipa ad EVENTI</p>

        <form v-if="isLoginForm" class="login-form">
          <input v-model="username" type="text" placeholder="Email, Username o Telefono" class="input-field" />
          <input v-model="password" type="password" placeholder="Password" class="input-field" />
          <div class="buttons">
            <button type="button" class="btn access" @click="login">LogIn</button>
            <button type="button" class="btn register" @click="isLoginForm = false">Registrati</button>
          </div>
        </form>

        <form v-if="!isLoginForm" class="login-form">
          <input v-model="username" type="text" placeholder="Username" class="input-field" />
          <input v-model="email" type="email" placeholder="Email" class="input-field" />
          <input v-model="password" type="password" placeholder="Password" class="input-field" />
          <select v-model="role" class="input-field">
            <option value="utente_base">Utente Base</option>
            <option value="organizzatore">Organizzatore</option>
          </select>
          <div class="buttons">
            <button type="button" class="btn access" @click="register">Registrati</button>
            <button type="button" class="btn register" @click="isLoginForm = true">Hai già un account? Accedi</button>
          </div>
        </form>

        <div class="google-login">
          <img src="@/assets/goog.png" alt="Accedi con Google" class="google-icon" />
        </div>
      </div>
    </span>
  </form>
  </div>
</template>

<style scoped src="@/styles/login.css"></style>
