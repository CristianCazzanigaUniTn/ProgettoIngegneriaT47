<template>
    <div id="popupDiv" v-if="isVisible">
        <button id="chiusura" @click="closePopup">×</button>
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
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

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
