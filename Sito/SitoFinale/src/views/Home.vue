<template>
    <div class="login-box">
        <p class="small-text">IL SOCIAL NETWORK DI CUI HAI BISOGNO</p>
        <h1 class="title">EVENTLY</h1>
        <p class="sub-text">ENTRA e partecipa ad EVENTI</p>

        <form class="login-form">
            <input type="text" placeholder="Email, Username o Telefono" class="input-field">
            <input type="password" placeholder="Password" class="input-field">
            <div class="buttons">
                <button type="button" class="btn access">Accedi</button>
                <button type="button" class="btn register">Registrati</button>
            </div>
        </form>

        <div class="google-login">
            <img src="@/assets/goog.png" alt="Accedi con Google" class="google-icon">
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  };
  </script>

<style scoped src="@/styles/login.css"></style>
  