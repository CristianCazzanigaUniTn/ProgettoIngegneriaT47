<template>
    <div v-if="isVisible" class="popup-overlay">
    <div id="popupPartyDiv">
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
                    <span>{{ currentPartecipants }}</span> / <span>{{ maxParticipantsEP }}</span> partecipanti
                </p>
                <button id="azionePartyButton" class="button-iscrizione" @click="inscriviAEventoParty"
                v-if="!partecipa && !organizzaEP && loggedUser.token !== undefined && loggedUser.ruolo === 'utente_base'">
                Iscriviti
            </button>
            <button id="azionePartyButton" class="button-iscrizione" @click="disinscriviDaEventoParty"
                v-if="partecipa && loggedUser.token !== undefined && loggedUser.ruolo === 'utente_base'">
                Disiscriviti
            </button>
            <button id="azionePartyButton" class="button-iscrizione" @click="eliminaEventoParty"
                v-if="organizzaEP && loggedUser.token !== undefined">
                Elimina
            </button>
            </div>
          
        </div>

        <div class="faq-input-container" v-if="!isParty && loggedUser.token !== undefined">
            <textarea 
                id="faqInput" 
                class="faq-input" 
                :placeholder="organizzaEP ? 'Rispondi ad una domanda...' : 'Scrivi una domanda...'" 
                v-model="newFaqText">
            </textarea>
            <button 
                id="faqSubmit" 
                class="faq-submit" 
                @click="organizzaEP ? AnswerFaq() : addFaq()">
                <span class="arrow-icon">&gt;</span>
            </button>
        </div>


        <div v-if="!isParty">
            <div v-for="(f, index) in faq" :key="f.domanda" class="faq-list">
                <div 
                    class="faq-item" 
                    :class="{ 'selected-faq': selectedFaqIndex === index }" 
                    @click="loggedUser.token !== undefined && organizzaEP ? selezionaFaq(index, f) : null">
                    <p><strong>Domanda:</strong> {{ f.domanda }}</p>
                    <p class="faq-risposta"><strong>{{ f.risposta }}</strong></p>
                </div>
            </div>
        </div>


    </div>
    </div>
</template>
<script setup>
import { ref, onMounted  } from 'vue';
import { idep, isParty } from "../../../scripts/MapPage/PageScript";
import {
    rispondiFaq, disinscriviEvento, disinscriviParty, eliminaParty, estraiInformazioniEventi, eliminaEvento,
    estraiPartecipazioniParty, partecipaEvento, partecipaParty, aggiungiFaq
} from "../../../scripts/MapPage/popup";
import { loggedUser } from "../../../states/loggedUser";

const newFaqText = ref('');
const selectedFaq = ref();
const selectedFaqIndex = ref(-1);
const partecipa = ref();
const currentPartecipants = ref();
const faq = ref([]);

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
    isVisible: {
        type: Boolean,
        default: true, // Se il popup è visibile
    }
});

// Gestione degli eventi
const emit = defineEmits(["close-popup"]);

// Funzione per chiudere il popup
function closePopup() {
    emit("close-popup");
}

async function addFaq() {
    if (!newFaqText.value) {
        alert("La faq non può essere vuota");
        return;
    } else {
        aggiungiFaq(idep.value, newFaqText.value);
        newFaqText.value = '';
        await refresh();
    }
    
}

async function refresh() {

    if (!isParty.value) {
        const infoEvento = await estraiInformazioniEventi(idep.value);

        partecipa.value = infoEvento.partecipa;
        currentPartecipants.value = infoEvento.numero_partecipazioni;
        faq.value = infoEvento.faq;
        
    } else {
        const infoParty = await estraiPartecipazioniParty(idep.value);

        partecipa.value = infoParty.partecipa;
        currentPartecipants.value = infoParty.numero_partecipazioni;
    }
}

function selezionaFaq(index, faq) {
    selectedFaqIndex.value = index; // Imposta l'indice dell'elemento selezionato
    selectedFaq.value = faq;
    
}

async function AnswerFaq() {
    if (!selectedFaq.value) {
        alert("Seleziona una faq a cui rispondere");
    } else {
        if (!newFaqText.value) {
            alert("La risposta non può essere vuota");
            return;
        } else {
            rispondiFaq(selectedFaq.value._id, newFaqText.value);
            newFaqText.value = '';
        }
        selectedFaq.value = undefined;
        selectedFaqIndex.value = -1;
        await refresh()
    }
}


// Funzione per iscriversi al party
async function inscriviAEventoParty() {
    if (isParty.value) {
        await partecipaParty(idep.value);
    } else {
        await partecipaEvento(idep.value);
    }
    await refresh()
}

async function disinscriviDaEventoParty() {
    if (isParty.value) {
        await disinscriviParty(idep.value);
    } else {
        await disinscriviEvento(idep.value);
    }
    await refresh()
}

async function eliminaEventoParty() {
    if (isParty.value) {
        await eliminaParty(idep.value);
    } else {
        await eliminaEvento(idep.value);
    }
    closePopup();
}

onMounted(async () => {
    await refresh(); // Esegui il refresh all'inizializzazione
});

</script>

<style scoped src="@/styles/viewPartyEvento.css"></style>