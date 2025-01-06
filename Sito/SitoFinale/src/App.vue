<template>
  <div>
    <Navbar /> <!-- Navbar fissa sopra -->
    <div class="main-content">
      <router-view /> <!-- Qui vengono caricate le pagine dinamicamente -->
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style src="@/styles/global.css"></style>
