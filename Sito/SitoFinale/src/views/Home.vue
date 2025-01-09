<script setup>
import { ref } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '@/states/loggedUser.ts';
import router from '../router';
import LoginGoogle from '@/components/loginComponents/LoginGoogle.vue'
import * as CryptoJS from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;
const API_URL = API_BASE_URL + `/api/v1`;

const userName = ref('');
const userUsername = ref('');
const userEmail = ref('');
const userPassword = ref('');
const userGender = ref('');
const userNotifications = ref(false);
const userRole = ref('');

// Variabili per la risposta e l'errore dell'email
const verificationToken = ref('');

const isLoginForm = ref(true);

const emit = defineEmits(['login']);

function generateVerificationToken() {
  // Usa un valore casuale e crea un hash SHA256
  const randomValue = Math.random().toString(36).substring(2); // Genera un valore casuale
  const hash = CryptoJS.SHA256(randomValue).toString(CryptoJS.enc.Base64); // Hash casuale
  return hash;
}


function login() {
  // Assicurati che userPassword.value sia una stringa
  const password = String(userPassword.value);

  // Hash della password prima di inviarla
  const hashedPassword = String(CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64));
  try {
    fetch(API_URL + '/authentications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    //hasha password
    body: JSON.stringify({ username: userName.value, password: hashedPassword }),
  })
    .then((resp) => resp.json())
    .then(function (data) {
      setLoggedUser(data);
      emit('login', loggedUser);
      if (loggedUser.token) {
        router.push("/");
      }
      else
      {
        alert("Credenziali sbagliate o mail non verificata");
      }
      return;
    })
    .catch((error) => function(error) {throw new Error("Sbagliato")});
  } catch (error) {
    alert("Errore nella chiamata per il login, ci scusiamo, ritenta più tardi!");
  }
}


// Funzione per inviare un'email di prova
async function sendEmail() {
  const emailSubject = 'Messaggio di verifica per la registrazione';

  const encoded = encodeURIComponent(verificationToken.value);
  const verificationLink = `http://localhost:5173/verifica?token=${encoded}`; // Inserisci il token dinamico
  const emailMessage = `Ciao ${userName.value},\n\nBenvenuto nel nostro servizio! La tua registrazione è stata ricevuta.\n\nClicca sul link per verificare il tuo account:\n${verificationLink}`;

  try {
    const response = await fetch(`${API_BASE_URL}/send-email`, {
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
    console.log(data.message);

  } catch (error) {
    console.error(error.message)
  }
};


// Funzione per registrare l'utente
async function registerUser() {

  const dataRegistrazione = new Date().toISOString();

  try {

    const file = document.getElementById('profilePictureInput').files[0];
    if (!file) {
      alert('metti la foto profilo');
      return;
    }

    const signedUrlResponse = await fetch(`${API_BASE_URL}/generate-signed-url-foto-profilo`, {
      method: 'POST',
      headers: {
      },
    });

    const signedUrlData = await signedUrlResponse.json();

    const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', signedUrlData.upload_preset);
        formData.append('timestamp', signedUrlData.timestamp);
        formData.append('signature', signedUrlData.signature);
        formData.append('api_key', signedUrlData.api_key);

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dc2ga9rlo/image/upload', {
            method: 'POST',
            body: formData,
        });


        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.secure_url || 'null';

    // Assicurati che userPassword.value sia una stringa
    const password = String(userPassword.value);

    // Hash della password prima di inviarla
    const hashedPassword = String(CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64));

    verificationToken.value = generateVerificationToken();

    const response = await fetch(`${API_BASE_URL}/api/Utenti`, {
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
        verificationToken: verificationToken.value,
        foto_profilo: imageUrl
      }),
    });

    if (!response.ok) {
      throw new Error('Errore durante la registrazione dell\'utente');
    }

    const data = await response.json();
    alert(`Utente ${data.user.username} creato con successo!, verifica la mail e accedi`);
    isLoginForm.value = !isLoginForm.value;
    sendEmail();

  } catch (error) {
    alert("Qualcosa non è andato a buon fine");
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

const profilePicturePreview = ref(null); // Variabile per memorizzare l'anteprima

function handleProfilePictureChange(event) {
  const file = event.target.files[0]; // Ottieni il file selezionato
  if (file) {
    const reader = new FileReader();

    // Imposta l'anteprima dell'immagine
    reader.onload = function (e) {
      profilePicturePreview.value = e.target.result; // Memorizza l'anteprima
    };

    // Leggi il file come URL
    reader.readAsDataURL(file);
  }
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
            <input v-model="userName" type="text" placeholder="Email, Username o Telefono" class="input-field" />
            <input v-model="userPassword" type="password" placeholder="Password" class="input-field" />
            <div class="buttons">
              <button type="button" class="btn access" @click="login">LogIn</button>
              <button type="button" class="btn register" @click="clear()">Registrati</button>
            </div>
          </form>

          <form v-if="!isLoginForm" class="login-form" @submit.prevent="registerUser">
            <div class="profile-picture-container">
              <label for="profilePictureInput" class="profile-picture-label">
                <div class="profile-picture-circle">
                  <img v-if="profilePicturePreview" :src="profilePicturePreview" alt="Foto Profilo"
                    class="profile-picture" />
                  <span v-else>foto profilo</span>
                </div>
              </label>
              <input type="file" id="profilePictureInput" @change="handleProfilePictureChange"
                class="profile-picture-input" />
            </div>
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
  </div>
</template>

<style scoped src="@/styles/login.css"></style>

<style scoped>
.profile-picture-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.profile-picture-label {
  cursor: pointer;
  color: black;
}

.profile-picture-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  overflow: hidden;
  position: relative;
}

.profile-picture-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-picture-input {
  display: none;
}
</style>