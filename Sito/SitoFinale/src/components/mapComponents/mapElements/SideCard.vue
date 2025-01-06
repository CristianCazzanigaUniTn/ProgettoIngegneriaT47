<template>
    <div class="card" :data-index="dataIndex" :data-type="dataType">
        <div class="card-header">
            <img class="card-img-top" :src="profileImage" alt="Foto Profilo">
            <strong>{{ profileName }}</strong>
        </div>
        <div class="card-body" v-if="dataType === 'post' || dataType === 'evento' || dataType === 'party'">
            <img class="post-image" :src="postImage" alt="Foto Post">
            <p class="card-description">{{ description }}</p>
        </div>
        <div class="card-body" v-else-if="dataType === 'textual'">
            <div class="textual-content">
                <img class="textual-profile-img" :src="profileImage" alt="Foto Profilo">
                <div class="textual-text">
                    <strong>{{ profileName }}</strong>
                    <p>{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    profileName: String,
    profileImage: String,
    postImage: String,
    description: String,
    dataIndex: Number,
    dataType: String,
});
</script>

<style scoped src="@/styles/mappa.css"></style>
