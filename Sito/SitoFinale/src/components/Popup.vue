<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup-container">
      <div class="popup-header">
        <h2>Crea Post</h2>
        <button @click="closePopup" class="close-button">&times;</button>
      </div>

      <div class="form-group">
        <div class="image-upload">
          <label id="labelpi" for="postImage"><i class="fas fa-upload"></i> Carica una foto</label>
          <input type="file" id="postImage" name="postImage" accept="image/*" required @change="handleImageUpload" />
          <div class="image-preview" v-if="imagePreview">
            <img :src="imagePreview" alt="Anteprima Immagine" />
          </div>
        </div>

        <div class="description-container">
          <div class="user-info">
            <img :src="profilePicture" alt="Foto Profilo" class="profile-img" />
            <div class="user-name">{{ userName }}</div>
          </div>
          
          <div class="fixed-location">
            <strong>Posizione:</strong> <span>{{ location }}</span>
          </div>
          <div class="fixed-time">
            <strong>Data e Ora:</strong> <span>{{ dateTime }}</span>
          </div>
          <div class="form-group" id="desc">
            <strong>Descrizione:</strong>
            <textarea  placeholder="Scrivi una descrizione..." required>{{description}}</textarea>
          </div>
        </div>
      </div>

      <button type="submit" class="submit-button">Pubblica</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    dateTime: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imagePreview: null
    };
  },
  methods: {
    closePopup() {
      this.$emit('close-popup');
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
    
        const cs = document.getElementById('labelpi');
   
        cs.style.display = 'none';
        reader.onload = (e) => {
          this.imagePreview = e.target.result; 
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style src="@/styles/popupCreaPost.css"></style>
