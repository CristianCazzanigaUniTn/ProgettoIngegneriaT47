<script setup>
import { ref, onMounted } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '@/states/loggedUser.ts';

const VITE_API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:3000';
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function myLogin(googleToken) {
    fetch(`${VITE_API_HOST}/api/v1/authentications/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken }),
    })
        .then(resp => resp.json())
        .then(data => {
            setLoggedUser(data);
            emit('login', loggedUser);
        })
        .catch(error => console.error('Login error:', error));
}

const googleLoginBtn = ref(null);

onMounted(() => {
    const googleGsiClient = document.createElement('script');
    googleGsiClient.setAttribute('src', 'https://accounts.google.com/gsi/client');
    googleGsiClient.onload = () => {
        google.accounts.id.initialize({
            client_id: VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            login_uri: `${VITE_API_HOST}/api/v1/authentications/google`, // Redirect URI corrisponde al backend
            federated_signin: false,
        });
        google.accounts.id.renderButton(
            googleLoginBtn.value,
            {
                text: 'signin_with', // Può essere anche 'signup_with', a seconda dell'uso
                size: 'medium', // Puoi scegliere 'small' o 'large'
                width: '300', // Larghezza massima
                theme: 'outline', // Stile del bottone
                logo_alignment: 'center', // Allineamento del logo
            }
        );
        google.accounts.id.prompt(); // Mostra il popup di One Tap
    };
    document.head.appendChild(googleGsiClient);
});

function handleCredentialResponse(response) {
    console.log('Google credential response:', response);
    if (response.credential) {
        myLogin(response.credential);
    } else {
        console.error('No credential received.');
    }
}
</script>

<template>
    <div ref="googleLoginBtn"></div>
</template>
