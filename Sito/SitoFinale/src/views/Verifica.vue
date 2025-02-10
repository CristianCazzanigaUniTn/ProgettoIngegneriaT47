<template>
    mail verifica
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verificaUtente } from '../scripts/MapPage/estraiDati';
import { EndOfLineState } from 'typescript';

const route = useRoute(); // Accesso ai parametri di routing
const router = useRouter(); // Accesso per la navigazione

async function verifica() {
    // Verifica la mail
    const token = route.params.token; // Usa useRoute per accedere ai parametri del token
    
    try {
        await verificaUtente(token);
    } catch (error) {
        console.error("Errore durante la verifica:", error);
        alert("Si è verificato un errore durante la verifica");
    }

    // Dopo la verifica, reindirizza l'utente
   
}

onMounted(() => {
    verifica();
});
</script>
 // router.push('/login');