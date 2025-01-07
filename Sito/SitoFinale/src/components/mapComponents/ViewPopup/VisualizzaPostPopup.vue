<template>
    <div id="popupDiv" v-if="isVisible">
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
            </div>


            <!-- Sezione dei like (posizionata sopra) -->
            <div class="likes-section">
                <button id="likeButton" class="like-button">❤️ Mi piace</button>
                <span id="likeCount">0</span>
            </div>

            <!-- Sezione dei commenti -->
            <div class="comments-section">
                <div id="commentList">
                    <!-- Commento 1 -->
                    <div class="comment">
                        <img class="comment-user-image" src="" alt="User" />
                        <div class="comment-content">
                            <div class="comment-user-name">ciucgamer</div>
                            <div class="comment-text">Bellissima foto!</div>
                        </div>
                    </div>
                    <!-- Commento 2 -->
                    <div class="comment">
                        <img class="comment-user-image" src="" alt="User" />
                        <div class="comment-content">
                            <div class="comment-user-name">markus92</div>
                            <div class="comment-text">Wow, che panorama!</div>
                        </div>
                    </div>
                </div>
                <div class="comment-input">
                    <input type="text" id="commentInput" placeholder="Aggiungi un commento...">
                    <button id="addCommentButton" disabled>Invia</button>
                </div>
            </div>



        </div>
    </div>
</template>

<script setup>

// Props accettati dal componente
defineProps({
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
});

// Gestione degli eventi
const emit = defineEmits(["close-popup"]);

// Funzione per chiudere il popup
function closePopup() {
    emit("close-popup");
}
</script>

<style scoped src="@/styles/visualizzaPost.css"></style>
