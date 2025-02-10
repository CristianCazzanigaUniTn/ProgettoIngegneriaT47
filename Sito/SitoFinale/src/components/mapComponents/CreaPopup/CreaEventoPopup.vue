<template>
    <div v-if="isVisible" class="popup-overlay">
        <div class="contenitore-form-evento" id="creaEvento">
            <div class="intestazione-form-evento">
                <h2>Crea un Nuovo Evento</h2>
                <p>Organizza e condividi il tuo evento con facilità</p>
                <span @click="closePopup" class="close-button">&times;</span>
            </div>
            <form @submit.prevent="eventFormHandler" id="formCreaEvento">
                <div class="gruppo-campo">
                    <label for="nomeEvento">Nome Evento</label>
                    <input type="text" id="nomeEvento" name="nomeEvento" v-model="nomeEvento"
                        placeholder="Es: Festa di Primavera" required />
                </div>
                <div class="gruppo-campo">
                    <label for="dataEvento">Data e Ora</label>
                    <input type="datetime-local" id="dataEvento" name="dataEvento" v-model="eventDate" required />
                </div>
                <div class="gruppo-campo">
                    <label for="luogoEvento">Luogo</label>
                    <input type="text" id="luogoEvento" name="luogoEvento" readonly
                        :placeholder="eventLocation" required />
                </div>
                <div class="gruppo-campo">
                <label for="tipologiaEvento">Tipologia</label>
                <select id="tipologiaEvento" name="tipologiaEvento" v-model="eventType" required>
                    <option value="" disabled selected>Scegli una tipologia</option>
                    <option v-for="(c, index) in categorie" :key="index" :value="c._id">
                    {{ c.nome }}
                    </option>
                </select>
                </div>
                <div class="gruppo-campo">
                    <label for="numeroPartecipanti">Numero Massimo di Partecipanti</label>
                    <input type="number" id="numeroPartecipanti" name="numeroPartecipanti" v-model="eventParticipants"
                        placeholder="Es: 100" min="1" required />
                </div>
                <div class="gruppo-campo larghezza-completa">
                    <label for="descrizioneEvento">Descrizione</label>
                    <textarea id="descrizioneEvento" name="descrizioneEvento" v-model="eventDescription"
                        placeholder="Descrivi il tuo evento..." required></textarea>
                </div>
                <div class="gruppo-campo larghezza-completa">
                    <label class="etichetta-immagine">Immagine Evento</label>
                    <div class="caricamento-immagine">
                        <label for="immagineEvento"><i class="fas fa-upload"></i> Carica Immagine</label>
                        <input type="file" id="immagineEvento" name="immagineEvento" accept="image/*"
                            @change="handleImageUpload" required />
                    </div>
                    <div class="anteprima-immagine" v-if="imagePreview">
                        <img :src="imagePreview" alt="Anteprima Immagine" />
                        <button type="button" class="rimuovi-immagine" @click="removeImage"><i
                                class="fas fa-times"></i></button>
                    </div>
                </div>
                <button type="submit" class="pulsante-invio" :disabled="isSubmitting">
                    <span v-if="isSubmitting">Caricamento...</span>
                    <span v-else>Crea Evento</span>
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
const nomeEvento = ref('');
const eventDate = ref('');
const eventPosition = ref();
const eventLocation = ref('');
const eventType = ref('');
const eventParticipants = ref('');
const eventDescription = ref('');
const imagePreview = ref(null);
const isSubmitting = ref(false);  // Variabile per tenere traccia dello stato di invio del modulo
const emit = defineEmits(['close-popup']);

const tokenFromStorage = computed(() => loggedUser.token);

// Funzione asincrona che verrà eseguita quando il componente è montato
onMounted(async () => {
  try {
    eventPosition.value = await getPosition();
    eventLocation.value = await fetchCityName(eventPosition.value.latitudine, eventPosition.value.longitudine);


  } catch (error) {
    console.error('Errore nel recupero della posizione o del luogo:', error);
  }
});

function closePopup() {
    emit('close-popup');
}

function handleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        alert('Nessun file selezionato o errore nel caricamento del file.');
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Il file selezionato non è un\'immagine.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value = e.target.result;
    };
    reader.onerror = () => {
        alert('Errore nel caricamento dell\'immagine.');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    imagePreview.value = null;
    const input = document.getElementById('immagineEvento');
    input.value = '';
}

async function eventFormHandler() {
    if (!nomeEvento.value || !eventDate.value || !eventType.value || !eventParticipants.value || !eventDescription.value) {
        alert('Tutti i campi sono obbligatori.');
        return;
    }

    const file = document.getElementById('immagineEvento').files[0];
    if (!file) {
        alert('Per creare un evento è necessario caricare un\'immagine.');
        return;
    }

    if (!tokenFromStorage.value) {
        throw new Error('Utente non autenticato!');
    }

    try {
        // Impostiamo isSubmitting a true per bloccare ulteriori invii
        isSubmitting.value = true;

        const signedUrlResponse = await fetch(`${API_BASE_URL}/generate-signed-url-eventi`, {
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

        const eventData = {
            nome: nomeEvento.value,
            data_inizio: eventDate.value,
            luogo: eventLocation.value,
            posizione: eventPosition.value,
            id_categoria: eventType.value, // Assicurati di usare la categoria giusta
            numero_massimo_partecipanti: parseInt(eventParticipants.value, 10),
            descrizione: eventDescription.value,
            foto: imageUrl,
        };

        const eventResponse = await fetch(`${API_BASE_URL}/api/eventi`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tokenFromStorage.value}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        const eventResponseData = await eventResponse.json();
        alert('Evento creato con successo');
        Aggiorna();
    } catch (error) {
        alert('Errore nel caricamento: ' +  error);
    } finally {
        // Reset dello stato di invio
        isSubmitting.value = false;
    }

    emit('close-popup');
}
</script>

<style scoped src="@/styles/creaEventoPopup.css"></style>
