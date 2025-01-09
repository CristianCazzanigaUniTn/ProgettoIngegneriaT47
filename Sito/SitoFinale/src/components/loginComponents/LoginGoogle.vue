<script setup>
    import { ref, onMounted } from 'vue'
    import { loggedUser, setLoggedUser, clearLoggedUser } from '@/states/loggedUser.ts'
import router from '../../router';

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;
    const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    function myLogin(googleToken) {
        fetch(API_BASE_URL + '/api/v1/authentications/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleToken: googleToken }),
        })
        .then((resp) => resp.json()) 
        .then(function (data) { 
            setLoggedUser(data)
            router.push('/');
            return;
        })
        .catch(error => console.error(error));
    };

    const googleLoginBtn = ref(null);

    onMounted(() => {
    let google_gsi_client = document.createElement('script');
    google_gsi_client.setAttribute('src', 'https://accounts.google.com/gsi/client');
    google_gsi_client.onload = function () {
        if (google && google.accounts && google.accounts.id) {
            console.log("ciao eccomi");
            console.log("Client ID usato:", VITE_GOOGLE_CLIENT_ID);

            google.accounts.id.initialize({
                client_id: VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            google.accounts.id.renderButton(
                googleLoginBtn.value, {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    width: 300,
                    logo_alignment: 'center',
                }
            );
        } else {
            console.error('Google accounts API non disponibile.');
        }
    };
    document.head.appendChild(google_gsi_client);
});

    function handleCredentialResponse(response) {
        console.log("cc");
        console.log(response);
        if (response.credential) {
            myLogin(response.credential);
        }
    }
</script>

<template>
    <!-- Contenitore del pulsante di login Google -->
    <div ref="googleLoginBtn" class="google-login"></div>
</template>

<style scoped>
/* Contenitore principale della pagina o sezione */
body, html {
    height: 100%;  /* Assicurati che il body e l'html abbiano una altezza del 100% */
    margin: 0;  /* Rimuovi i margini di default */
}

/* Centra il contenuto del login usando Flexbox */
.google-login {
    display: flex;
    justify-content: center;  
    align-items: center;  
}

.google-icon {
    width: 200px; 
    object-fit: contain;
}
</style>
