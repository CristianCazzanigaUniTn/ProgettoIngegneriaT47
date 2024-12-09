import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Importa il router

// Crea l'app Vue e utilizza il router
createApp(App)
  .use(router)
  .mount('#app');
