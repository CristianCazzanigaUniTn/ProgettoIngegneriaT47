<script setup>
import { ref } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import LoginGoogle from '@/components/loginComponents/LoginGoogle.vue'
import * as CryptoJS from 'crypto-js';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:3000`;
const API_URL = HOST + `/api/v1`;

const userName = ref('');
const userUsername = ref('');
const userEmail = ref('');
const userPassword = ref('');
const userGender = ref('');
const userNotifications = ref(false);
const userRole = ref('');

// Variabili per la risposta e l'errore dell'email
const emailResponse = ref(null);
const emailError = ref(null);
const registrationResponse = ref(null);
const registrationError = ref(null);

const isLoginForm = ref(true);

const emit = defineEmits(['login']);


function login() {
  // Assicurati che userPassword.value sia una stringa
  const password = String(userPassword.value);

  // Hash della password prima di inviarla
  const hashedPassword = String(CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64)); 

  fetch(API_URL + '/authentications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    //hasha password
    body: JSON.stringify({ username: userName.value, password: hashedPassword  }),
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


 // Funzione per inviare un'email di prova
async function sendEmail() {
  emailResponse.value = null;
  emailError.value = null;

  const emailSubject = 'Messaggio di prova per la registrazione';
  const emailMessage = `Ciao ${userName.value},\n\nBenvenuto nel nostro servizio! La tua registrazione è stata ricevuta.`;

  try {
    const response = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          to: userEmail.value,
          subject: emailSubject,
          text: emailMessage,
          html: `<p>${emailMessage.replace(/\n/g, '<br>')}</p>`, // Formattazione HTML
      }),
    });

    if (!response.ok) {
        throw new Error('Errore durante l\'invio dell\'email');
    }

    const data = await response.json();
    emailResponse.value = data.message;

  } catch (error) {
      emailError.value = error.message;
  }
};

// Funzione per registrare l'utente
async function registerUser(){
  registrationResponse.value = null;
  registrationError.value = null;

  const dataRegistrazione = new Date().toISOString();

  try {

    // Assicurati che userPassword.value sia una stringa
    const password = String(userPassword.value);

    // Hash della password prima di inviarla
    const hashedPassword = String(CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64));

      const response = await fetch('http://localhost:3000/api/Utenti', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              nome: userName.value,
              username: userUsername.value,
              email: userEmail.value,
              password: hashedPassword,
              genere: userGender.value,
              data_registrazione: dataRegistrazione,
              preferenze_notifiche: userNotifications.value,
              ruolo: userRole.value,
              foto_profilo: "fotofinta"
          }),
      });

      if (!response.ok) {
          throw new Error('Errore durante la registrazione dell\'utente');
      }

      const data = await response.json();
      registrationResponse.value = `Utente ${data.user.username} creato con successo!`;

  } catch (error) {
      registrationError.value = error.message;
  }
};

function clear() {
  isLoginForm.value = !isLoginForm.value;
  userName.value = '';
  userUsername.value = '';
  userEmail.value = '';
  userPassword.value = '';
  userGender.value = '';
  userNotifications.value = false;
  userRole.value = '';
}

// Funzione di logout
function logout() {
  clearLoggedUser();
}
</script>

<template>
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
          <input v-model="userName" type="text" placeholder="Email, Username o Telefono" class="input-field" />
          <input v-model="userPassword" type="password" placeholder="Password" class="input-field" />
          <div class="buttons">
            <button type="button" class="btn access" @click="login">LogIn</button>
            <button type="button" class="btn register" @click="clear()">Registrati</button>
          </div>
        </form>

        <form v-if="!isLoginForm" class="login-form" @submit.prevent="registerUser">
          <input v-model="userName" type="text" placeholder="Nome" class="input-field" required />
          <input v-model="userUsername" type="text" placeholder="Username" class="input-field" required />
          <input v-model="userEmail" type="email" placeholder="Email" class="input-field" required />
          <input v-model="userPassword" type="password" placeholder="Password" class="input-field" required />
          <select v-model="userGender" class="input-field" required>
              <option value="" disabled selected>Seleziona Genere</option>
              <option value="Male">Maschio</option>
              <option value="Female">Femmina</option>
              <option value="Other">Altro</option>
          </select>

          <select v-model="userNotifications" class="input-field" required>
              <option value="" disabled selected>Seleziona preferenze sulle notifiche</option>
              <option value="email">Email</option>
          </select>
          
          <select v-model="userRole" class="input-field" required>
              <option value="" disabled selected>Seleziona Ruolo</option>
              <option value="utente_base">Utente Base</option>
              <option value="organizzatore">Organizzatore</option>
          </select>
          
          <div class="buttons">
            <button type="button" class="btn access" @click="registerUser">Registrati</button>
            <button type="button" class="btn register" @click="clear()">Hai già un account? Accedi</button>
          </div>

        </form>

        <LoginGoogle />
      </div>
    </span>
  </form>
</template>

<style scoped src="@/styles/login.css"></style>
