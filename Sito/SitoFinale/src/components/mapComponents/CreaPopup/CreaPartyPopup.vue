<template>
    <div v-if="isVisible" class="popup-overlay">
        <div class="party-form-container" id="creaParty">
            <div class="event-form-header">
                <h2>Crea il Tuo Party</h2>
                <p>Divertiti e condividi il tuo evento con amici!</p>
                <span @click="closePopup" class="close-button">&times;</span>
            </div>
            <form @submit.prevent="partyFormHandler" id="createPartyForm">
                <div class="form-group">
                    <label for="partyName">Nome Party</label>
                    <input type="text" id="partyName" v-model="partyName" placeholder="Es: Compleanno di Anna"
                        required />
                </div>
                <div class="form-group">
                    <label for="partyDate">Data e Ora</label>
                    <input type="datetime-local" id="partyDate" v-model="partyDate" required />
                </div>
                <div class="form-group">
                    <label for="luogoEvento">Luogo</label>
                    <input type="text" id="luogoEvento" name="luogoEvento" readonly
                        :placeholder="partyLocation" required />
                </div>
                <div class="form-group">
                    <label for="tipologiaEvento">Tipologia</label>
                    <select id="tipologiaEvento" name="tipologiaEvento" v-model="partyType" required>
                        <option value="" disabled selected>Scegli una tipologia</option>
                        <option v-for="(c, index) in categorie" :key="index" :value="c._id">
                        {{ c.nome }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="partyParticipants">Numero Massimo di Partecipanti</label>
                    <input type="number" id="partyParticipants" v-model="partyParticipants" placeholder="Es: 50" min="1"
                        required />
                </div>
                <div class="form-group full-width">
                    <label for="partyDescription">Descrizione</label>
                    <textarea id="partyDescription" v-model="partyDescription" placeholder="Descrivi il tuo party..."
                        required></textarea>
                </div>
                <div class="form-group full-width">
                    <label class="image-label">Immagine Party</label>
                    <div class="image-upload">
                        <label for="partyImage"><i class="fas fa-upload"></i> Carica Immagine</label>
                        <input type="file" id="partyImage" accept="image/*" @change="handleImageUpload" required />
                    </div>
                    <div class="image-preview" v-if="imagePreview">
                        <img :src="imagePreview" alt="Anteprima Immagine" />
                        <button type="button" class="remove-image" @click="removeImage"><i
                                class="fas fa-times"></i></button>
                    </div>
                </div>
                <button type="submit" class="submit-button" :disabled="isSubmitting">
                    <span v-if="isSubmitting">Caricamento...</span>
                    <span v-else>Crea Party</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { loggedUser } from '@/states/loggedUser.ts';
import { getPosition, fetchCityName } from '@/scripts/Tools/posizione';
import { Aggiorna, categorie } from '@/scripts/MapPage/PageScript';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;
const isVisible = ref(true);
const partyName = ref('');
const partyDate = ref('');
const partyLocation = ref('');
const partyPosition = ref();
const partyType = ref('');
const partyParticipants = ref('');
const partyDescription = ref('');
const imagePreview = ref(null);
const isSubmitting = ref(false);  // Variabile per gestire lo stato di invio
const emit = defineEmits(['close-popup']);

const tokenFromStorage = computed(() => loggedUser.token);

function closePopup() {
    emit('close-popup');
}

// Funzione asincrona che verrà eseguita quando il componente è montato
onMounted(async () => {
  try {
    partyPosition.value = await getPosition();
    partyLocation.value = await fetchCityName(partyPosition.value.latitudine, partyPosition.value.longitudine);


  } catch (error) {
    console.error('Errore nel recupero della posizione o del luogo:', error);
  }
});

function handleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        alert('Nessun file selezionato o errore nel caricamento del file.');
        return;
    }

    // Verifica se il file è un'immagine
    if (!file.type.startsWith('image/')) {
        alert('Il file selezionato non è un\'immagine.');
        return;
    }

    const reader = new FileReader();

    // Gestisci il caricamento con onload
    reader.onload = (e) => {
        imagePreview.value = e.target.result;
    };

    // Gestisci eventuali errori
    reader.onerror = () => {
        alert('Errore nel caricamento dell\'immagine.');
    };

    // Avvia il caricamento
    reader.readAsDataURL(file);
}

function removeImage() {
    imagePreview.value = null;
    const input = document.getElementById('partyImage');
    input.value = '';
}

async function partyFormHandler() {
    if (!partyName.value || !partyDate.value || !partyLocation.value || !partyType.value || !partyParticipants.value || !partyDescription.value) {
        alert('Tutti i campi sono obbligatori.');
        return;
    }

    const file = document.getElementById('partyImage').files[0];
    if (!file) {
        alert('Per creare un party è necessario caricare un\'immagine.');
        return;
    }

    if (!tokenFromStorage.value) {
        throw new Error('Utente non autenticato!');
    }

    try {
        // Impostiamo isSubmitting a true per bloccare ulteriori invii
        isSubmitting.value = true;

        const signedUrlResponse = await fetch(`${API_BASE_URL}/generate-signed-url-party`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tokenFromStorage.value}`,
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

        const partyData = {
            nome: partyName.value,
            data_inizio: partyDate.value,
            luogo: partyLocation.value,
            posizione: partyPosition.value,
            id_categoria: partyType.value,
            numero_massimo_partecipanti: parseInt(partyParticipants.value, 10),
            descrizione: partyDescription.value,
            foto: imageUrl,
        };

        const partyResponse = await fetch(`${API_BASE_URL}/api/party`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tokenFromStorage.value}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partyData),
        });

        const partyResponseData = await partyResponse.json();
        alert('Party creato con successo');
        Aggiorna();
    } catch (error) {
        alert('Errore nel caricamento:' + error);
    } finally {
        // Reset dello stato di invio
        isSubmitting.value = false;
    }

    emit('close-popup');
}
</script>

<style scoped src="@/styles/creaPartyPopup.css"></style>
