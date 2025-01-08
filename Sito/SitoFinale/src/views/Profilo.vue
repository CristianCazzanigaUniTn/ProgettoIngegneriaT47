<template>
  <div class="contenitoreGenerale">
  <div class="container-box">
    <!-- Sezione sinistra: Profilo Utente -->
    <div class="left">
      <UserProfile 
        :name="userProfile.username" 
        :profileImage="userProfile.profileImage" 
      />
    </div>

    <!-- Sezione destra: Post dell'utente -->
    <div class="right">
      <h2 class="titoloOggi">POST</h2>
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
  </div>
</template>

<script>
import { getPost } from '@/scripts/ProfilePage/PostCard.ts'; 
import { getUser } from '@/scripts/ProfilePage/UserData.ts'; 
import Card from '@/components/profileComponents/PostCard.vue';
import UserProfile from '@/components/profileComponents/UserData.vue';
export default {
  name: 'Profilo',
  components: { Card, UserProfile },
  data() {
    return {
      posts: [], 
      userProfile: null, 
    };
  },
  async created() {
    const id = this.$route.params.id; 
    try {
      this.userProfile = await getUser(id);
      this.posts = await getPost(id);
    } catch (error) {
      console.error('Errore durante il caricamento del profilo o dei post:', error);
    }
  },
};
</script>

<style scoped src="@/styles/profile.css"></style>
