<template>
  <div class="container-box">
    <!-- Sezione sinistra: Profilo Utente -->
    <div class="left">
      <UserProfile 
        :name="userProfile.name" 
        :profileImage="userProfile.profileImage" 
      />
    </div>

    <!-- Sezione destra: Post dell'utente -->
    <div class="right">
      <h2 class="titoloOggi">POST DI OGGI</h2>
      <div class="listacards">
        <Card 
          v-for="(post, index) in posts" 
          :key="post.id" 
          :title="post.title" 
          :description="post.description" 
          :backgroundImage="post.image" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getPost } from '@/scripts/ProfilePage/PostCard.ts'; // Importa solo la funzione getPost
import { userProfile } from '@/scripts/ProfilePage/UserData.ts'; // Import dei dati profilo
import Card from '@/components/profileComponents/PostCard.vue';
import UserProfile from '@/components/profileComponents/UserData.vue';

export default {
  name: 'Profilo',
  components: { Card, UserProfile },
  data() {
    return {
      posts: [], // Lista dei post dinamici
      userProfile, // Dati del profilo utente
    };
  },
  async created() {
    const id = this.$route.params.id;  // Ottieni l'ID dal parametro dell'URL (se usi Vue Router)
    this.posts = await getPost(id); // Ottieni i post dinamici in base all'ID
  },
};
</script>

<style scoped src="@/styles/profile.css"></style>
