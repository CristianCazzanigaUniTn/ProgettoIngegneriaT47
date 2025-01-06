<template>
    <div class="user-profile" >
      <h2 class="nomeUtente">{{ name }}</h2>
      <img class="fotoProfilo" :style="{ backgroundImage: `url(${profileImage})` }" >
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfile',
    props: {
      name: {
        type: String,
        required: true,
      },
      profileImage: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped src="@/styles/profile.css"></style>
  