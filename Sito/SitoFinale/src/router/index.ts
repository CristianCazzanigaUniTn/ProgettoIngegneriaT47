// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Mappa from '../views/Mappa.vue';
import Profilo from '../views/Profilo.vue';
import ChiSiamo from '../views/ChiSiamo.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/mappa', component: Mappa },
  { path: '/profilo', component: Profilo },
  { path: '/chiSiamo', component: ChiSiamo },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
