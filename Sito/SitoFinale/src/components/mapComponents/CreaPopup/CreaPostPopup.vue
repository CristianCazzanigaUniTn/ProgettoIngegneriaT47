<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup-container">
      <div class="popup-header">
        <h2>Crea Post</h2>
        <button @click="closePopup" class="close-button">&times;</button>
      </div>

      <div class="form-group">
        <div class="image-upload">
          <label id="labelpi" for="postImage"><i class="fas fa-upload"></i> Carica una foto</label>
          <input type="file" id="postImage" name="postImage" accept="image/*" required @change="handleImageUpload" />
          <div class="image-preview" v-if="imagePreview">
            <img :src="imagePreview" alt="Anteprima Immagine" />
          </div>
        </div>

        <div class="description-container">
          <div class="user-info">
            <img :src="profilePicture" alt="Foto Profilo" class="profile-img" />
            <div class="user-name">{{ userName }}</div>
          </div>
          
          <div class="fixed-location">
            <strong>Posizione:</strong> <span>{{ location }}</span>
          </div>
          <div class="fixed-time">
            <strong>Data e Ora:</strong> <span>{{ dateTime }}</span>
          </div>
          <div class="form-group" id="desc">
            <strong>Descrizione:</strong>
            <textarea v-model="description" placeholder="Scrivi una descrizione..." required></textarea>
          </div>
        </div>
      </div>

      <button type="submit" class="submit-button" @click="postFormHandler">Pubblica</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { loggedUser } from '@/states/loggedUser.ts';  
import router from '../../../router';
import { getPosition } from '@/scripts/Tools/posizione';

const isAuthenticated = computed(() => loggedUser.token !== undefined);
const userId = computed(() => loggedUser.id);
const userName = computed(() => loggedUser.username);
const profilePicture = computed(() => loggedUser.foto_profilo);
const emit = defineEmits(['close-popup']); 
const isVisible = ref(true);
const description = ref('');  
const imagePreview = ref(null);  
const location = ref('Posizione generica');
const dateTime = ref(new Date().toLocaleString());


function closePopup() {
  emit('close-popup');
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    const cs = document.getElementById('labelpi');
    cs.style.display = 'none';
  }
}

async function postFormHandler() {
  const descriptionValue = description.value;
  let imageUrl;

  if (descriptionValue === '') {
    console.error("Per creare un post è necessario inserire una descrizione.");
    return;
  }

  const file = document.getElementById('postImage').files[0];
  if (!file) {
    console.error("Per creare un post è necessario caricare un'immagine.");
    return;
  }

  const tokenFromStorage = loggedUser.token;

  if (!tokenFromStorage) {
    throw new Error("Utente non autenticato!");
  }

  try {
    console.log("cuiaoi");
    const response = await fetch('http://localhost:3000/generate-signed-url-post', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenFromStorage}`,
      },
    });
    const data = await response.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", data.upload_preset);
    formData.append("timestamp", data.timestamp);
    formData.append("signature", data.signature);
    formData.append("api_key", data.api_key);

    const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dc2ga9rlo/image/upload', {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadResponse.json();

    imageUrl = uploadData.secure_url || "null";
    let posizionePost = await getPosition(); // Ottieni la posizione dal dispositivo o usa Trento

    const postData = {
      descrizione: descriptionValue,
      contenuto: imageUrl,
      luogo: location.value,
      posizione: posizionePost,
      data_creazione: dateTime.value,
    };

    const postResponse = await fetch('http://localhost:3000/api/Post', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenFromStorage}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    const postDataResponse = await postResponse.json();
    console.log('Post creato con successo', postDataResponse);

  } catch (error) {
    console.error('Errore nel caricamento:', error);
  }

  emit('close-popup');  
}
</script>

<style scoped src="@/styles/popupCreaPost.css"></style>
