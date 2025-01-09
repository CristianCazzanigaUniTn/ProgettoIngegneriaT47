<template>
    <div v-if="isVisible" class="popup-overlay">
    <div id="popupDiv">
        <button id="chiusura" @click="closePopup" class="close-button">×</button>
        <div class="instagram-card">
            <div class="instagram-card-header">
                <router-link :to="`/profilo/${userIdView}`">
                    <img :src="profileImage" alt="Profile Picture" class="instagram-card-user-image" />
                </router-link>
                <div>
                    <router-link :to="`/profilo/${userIdView}`">
                        <a class="instagram-card-user-name">{{ profileName }}</a>
                    </router-link>
                    <div class="instagram-card-time">{{ time }}</div>
                </div>
            </div>
            <div class="instagram-card-image">
                <img :src="postImage" alt="Post Image" />
            </div>
            <div class="instagram-card-content">
                <p class="likes">{{ description }}</p>
                <button id="azionePartyButton" class="button-iscrizione" @click="deletePost" v-if="organizzaP && loggedUser.token !== undefined">
                    Elimina
                </button>
            </div>
           


            <!-- Sezione dei like (posizionata sopra) -->
            <div class="likes-section">
                <button id="likeButton" class="like-button" @click="likePost" >❤️ Mi piace</button>
                <span id="likeCount">{{ like }}</span>
            </div>

            <!-- Sezione dei commenti -->
            <div class="comments-section">
                <div id="commentList">
                    <div v-for="c in commenti" class="comment">
                        <router-link :to="`/profilo/${c.id_utente}`">
                            <img class="comment-user-image" :src="c.img_utente" alt="User" />
                        </router-link>
                        <div class="comment-content">
                            <router-link :to="`/profilo/${c.id_utente}`">
                                <div class="comment-user-name">{{ c.username }}</div>
                            </router-link>
                            <div class="comment-text">{{c.testo}}</div>
                            <div>{{ c.n_like }}</div>
                        </div>
                    </div>

                </div>

                <div v-if="loggedUser.token !== undefined" class="comment-input">
                    <input type="text" id="commentInput" placeholder="Aggiungi un commento..." v-model="newCommentText" >
                    <button id="addCommentButton" @click="addComment">Invia</button>
                </div>
            </div>

         
        </div>
    </div>
    </div>  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { estraiInformazioniPost, aggiungiCommento, aggiungiLikeCommenti, aggiungiLikePost, eliminaLikeCommenti, eliminaLikePost, eliminaPost } from '../../../scripts/MapPage/popup';
import { loggedUser } from '../../../states/loggedUser';
import { idp } from '../../../scripts/MapPage/PageScript';

const newCommentText = ref('');

const idLike = ref();
const like = ref();
const commenti = ref([]);

// Props accettati dal componente
const props = defineProps({
    profileName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    userIdView: {
        type: String, // Oppure number se l'ID è numerico
        required: true,
    },
    isVisible: {
        type: Boolean,
        default: true, // Se il popup è visibile
    },
    organizzaP: {
        type: Boolean,
        required: true
    }
});


// Gestione degli eventi
const emit = defineEmits(["close-popup"]);

async function addComment() {
    if (!newCommentText) {
        alert("Il commento non può essere vuoto");
        return;
    } else {
        await aggiungiCommento(idp.value, newCommentText.value)
        newCommentText.value = '';
    }

    await refresh();

}

async function deletePost() {
    
    await eliminaPost(idp.value)
    closePopup();
}

async function likePost() {
    if (loggedUser.token) {

        if (idLike.value) {
            eliminaLikePost(idLike.value);
        } else {
            await aggiungiLikePost(idp.value);
        }
    }
    await refresh();
}

async function refresh() {
    const infoPost = await estraiInformazioniPost(idp.value);
    idLike.value = infoPost.idLike;
    like.value = infoPost.like.length;
    commenti.value = infoPost.commenti;
}

// Funzione per chiudere il popup
function closePopup() {
    emit("close-popup");
}

onMounted(async () => {
    await refresh(); // Esegui il refresh all'inizializzazione
});

</script>

<style scoped src="@/styles/visualizzaPost.css"></style>
