// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Mappa from '../views/Mappa.vue';
import Profilo from '../views/Profilo.vue';
import ChiSiamo from '../views/ChiSiamo.vue';
import Verifica from '../views/Verifica.vue';

const routes = [
  { path: '/login', component: Home },
  { path: '/', component: Mappa },
  {
    path: '/profilo/:id',  
    name: 'profilo',
    component: Profilo,
    props: true, 
  },
  { path: '/chiSiamo', component: ChiSiamo },
  {
    path: '/verifica/:token',  
    name: 'verifica',
    component: Verifica,
    props: true, 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
