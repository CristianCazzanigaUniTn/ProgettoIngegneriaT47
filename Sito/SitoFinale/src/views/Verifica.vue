<template>
    mail verifica
</template>


<script setup>
import router from '../router';

function verifica()
{
    //verifica mail 
    //se non c'è pushi subito su  mappa 
    alert("mail verificata");
    router.push('/login');
}

verifica();
</script>