<template>
    <div id="popupPartyDiv" v-if="isVisible">
        <button id="chiusuraParty" @click="closePopup">×</button>
        <div class="instagram-card">
            <div class="instagram-card-header">
                <img :src="profileImageEP" alt="Profile Picture" class="instagram-card-user-image" />
                <div>
                    <a :href="`/profilo/${userIdViewEP}`" class="instagram-card-user-name">{{ profileNameEP }}</a>
                    <div class="instagram-card-time">{{ timeEP }}</div>
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
                <button id="azionePartyButton" class="button-iscrizione" @click="inscriviAEventoParty"
                v-if="!partecipaEP && !organizzaEP && loggedUser.token !== undefined && loggedUser.ruolo === 'utente_base'">
                Iscriviti
            </button>
            <button id="azionePartyButton" class="button-iscrizione" @click="disinscriviDaEventoParty"
                v-if="partecipaEP && loggedUser.token !== undefined && loggedUser.ruolo === 'utente_base'">
                Disiscriviti
            </button>
            <button id="azionePartyButton" class="button-iscrizione" @click="eliminaEventoParty"
                v-if="organizzaEP && loggedUser.token !== undefined">
                Elimina
            </button>
            </div>
          
        </div>

        <div class="faq-input-container" v-if="!organizzaEP && !isParty">
            <textarea id="faqInput" class="faq-input" placeholder="Scrivi una domanda..."></textarea>
            <button id="faqSubmit" class="faq-submit">
                <span class="arrow-icon">&gt;</span>
            </button>
        </div>
        <div v-if="!isParty">
        <div  v-for="f in faq" :key="f.domanda" class="faq-list">
            <div class="faq-item">   <!-- qua id faq -->
                <p><strong>Domanda:</strong> {{ f.domanda }}</p>
                <p class="faq-risposta"><strong>Risposta:</strong> In attesa di risposta...</p>
            </div>
        </div>
        </div>

    </div>
</template>
<script setup>
import { idep, isParty } from "../../../scripts/MapPage/PageScript";
import { disinscriviEvento, disinscriviParty, eliminaParty, eliminaEvento, partecipaEvento, partecipaParty } from "../../../scripts/MapPage/popup";
import { loggedUser } from "../../../states/loggedUser";

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
    organizzaEP: {
        type: Boolean,
        required: true
    },
    partecipaEP: {
        type: Boolean,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true, // Se il popup è visibile
    },
    faq: {
        type: Array,
        required: true
    }
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

function inscriviAEventoParty() {
    if (isParty.value) {
        partecipaParty(idep.value);
    } else {
        partecipaEvento(idep.value);
    }
    closePopup();
}
function disinscriviDaEventoParty() {
    if (isParty.value) {
        disinscriviParty(idep.value);
        console.log("Disiscrizione al party avvenuta");
    } else {
        disinscriviEvento(idep.value);
        console.log("Disiscrizione all'evento avvenuta");
    }
    closePopup();
}
function eliminaEventoParty() {
    if (isParty.value) {
        eliminaParty(idep.value);
        console.log("Eliminazione al party avvenuta");
    } else {
        eliminaEvento(idep.value);
        console.log("Eliminazione all'evento avvenuta");
    }
    closePopup();
}

</script>

<style scoped src="@/styles/viewPartyEvento.css"></style>