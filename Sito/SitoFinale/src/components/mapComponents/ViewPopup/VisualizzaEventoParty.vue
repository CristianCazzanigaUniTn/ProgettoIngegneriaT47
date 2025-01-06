<template>
    <div id="popupPartyDiv" v-if="isVisible">
        <button id="chiusuraParty" @click="closePopup">×</button>
        <div class="instagram-card">
            <div class="instagram-card-header">
                <img :src="profileImageEP" alt="Profile Picture" class="instagram-card-user-image" />
                <div>
                    <a :href="`/profilo/${userIdViewEP}`" class="instagram-card-user-name">{{ profileNameEP }}</a>
                    <div class="instagram-card-time">{{ time }}</div>
                </div>
            </div>
            <div class="instagram-card-image">
                <img :src="partyImageEP" alt="Foto del party" />
            </div>
            <div class="instagram-card-content">
                <p id="descrizioneParty" class="likes">{{ descriptionEP }}</p>
                <div class="categorie">
                    <span class="categorie-item">{{ categoryEP }}</span>
                </div>
                <p class="partecipanti">
                    <span>{{ currentParticipantsEP }}</span> / <span>{{ maxParticipantsEP }}</span> partecipanti
                </p>
            </div>
            <button id="azionePartyButton" class="button-iscrizione" @click="subscribeToParty">
                Iscriviti
            </button>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from "vue";

// Props accettati dal componente
defineProps({
    profileNameEP: {
        type: String,
        required: true,
    },
    profileImageEP: {
        type: String,
        required: true,
    },
    partyImageEP: {
        type: String,
        required: true,
    },
    descriptionEP: {
        type: String,
        required: true,
    },
    timeEP: {
        type: String,
        required: true,
    },
    userIdViewEP: {
        type: String, // Oppure number se l'ID è numerico
        required: true,
    },
    currentParticipantsEP: {
        type: Number,
        required: true,
    },
    maxParticipantsEP: {
        type: Number,
        required: true,
    },
    categoryEP: {
        type: String, // Oppure number se l'ID è numerico
        required: true,
    },
    isVisible: {
        type: Boolean,
        default: true, // Se il popup è visibile
    },
});

// Gestione degli eventi
const emit = defineEmits(["close-popup"]);

// Funzione per chiudere il popup
function closePopup() {
    emit("close-popup");
}

// Funzione per iscriversi al party
function subscribeToParty() {
    console.log("Iscrizione al party avvenuta");
}
</script>

<style scoped src="@/styles/viewPartyEvento.css"></style>