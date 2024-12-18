<template>
  <div id="loader">
    <div class="left-curtain"></div>
    <div class="right-curtain"></div>
    <div class="center-content">
      <h1>Loading..</h1>
      <img src="@/assets/attendi.png" alt="Logoload" class="logoload" />
    </div>
  </div>
  <div class="content">
    <div id="floatingButton">
      <span class="plus">+</span><span  @click="openPopup" class="text1">Post</span><span class="text2">Party</span>
    </div>
    <div class="container-box">
      <div class="left">
        <div class="filtri">
          <img src="@/assets/filtri.png" />
          <img src="@/assets/ordina.png" />
        </div>
        <aside class="sidebar"></aside>
      </div>
      <div class="right">
        <div id="markers-on-the-map">
          <div id="map"></div>
        </div>
      </div>
    </div>
  </div>

  <Popup
    v-if="showPopup"
    :isVisible="showPopup"
    :userName="userName"
    :profilePicture="profilePicture"
    :description="description"
    :location="location"
    :dateTime="dateTime"
    @close-popup="closePopup"
  />
</template>


<script lang="ts">
import { initializeMap } from '../scripts/MapPage/map';
import { inizializeLoader } from '../scripts/MapPage/loader';
import Popup from '@/components/Popup.vue'; // Import the Popup component

export default {
  name: 'Mappa',
  components: {
    Popup
  },
  data() {
    return {
      showPopup: false, 
      popupTitle: 'Popup Title',
      popupDescription: 'This is the description of the popup.',
      userName: 'John Doe', 
      profilePicture: 'https://example.com/profile.jpg',  
      description: 'This is a post description.',
      location: '12.21341, 48.123143',  
      dateTime: '2024-12-08 14:30'  
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      initializeMap();
      inizializeLoader();
      console.log("ciao");
    },
    openPopup() {
      this.showPopup = true; 
    },
    closePopup() {
      this.showPopup = false; 
    }
  }
};
</script>
<style scoped src="@/styles/mappa.css"></style>
