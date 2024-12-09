<template>
    <div class="container-box">
        <div class="left">
            <h2 class="nomeUtente">Dean Gambalunga</h2>
            <img class="fotoProfilo"  style="background-image: url('/image/image.png');">
        </div>
        <div class="right">
            <h2 class="titoloOggi">POST DI OGGI</h2>
            <div class="listacards">
                <div class="card" style="background-image: url('/image/image copy.png');">
                    <div class="card-content">
                        <h3 class="card-title">Trento, Italy</h3>
                        <p class="card-description">Questa è una breve descrizione del post. Qui puoi mettere un testo di esempio che spiega di cosa tratta il post.</p>
                    </div>
                </div>
                <div class="card" style="background-image: url('/image/image copy.png');">
                    <div class="card-content">
                        <h3 class="card-title">Germania, Italy</h3>
                        <p class="card-description">Questa è una breve descrizione del post. Qui puoi mettere un testo di esempio che spiega di cosa tratta il post.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
  </template>
  
  <script>
  export default {
    name: 'Profilo'
  };
  </script>

<style scoped src="@/styles/profile.css"></style>
  