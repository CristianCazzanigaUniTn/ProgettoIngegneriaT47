<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>Evently</h1>
    </div>
    <div class="navbar-center">
      <router-link to="/" id="home">HOME</router-link>
      <router-link to="/mappa" id="mappa">MAPPA</router-link>
      <router-link to="/profilo" id="profilo">PROFILO</router-link>
      <router-link to="/chiSiamo" id="chiSiamo">CHI SIAMO</router-link>
    </div>
    <div class="navbar-right">
      <input type="text" placeholder="Cerca" class="search-bar" />
      <img src="@/assets/imp.png" alt="Impostazioni" class="settings-icon" />
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style src="@/styles/navbar.css"></style>