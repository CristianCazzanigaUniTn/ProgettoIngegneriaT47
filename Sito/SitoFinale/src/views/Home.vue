<template>
    <div id="vue-app" class="login-box">
        <p class="small-text">IL SOCIAL NETWORK DI CUI HAI BISOGNO</p>
        <h1 class="title">EVENTLY</h1>
        <p class="sub-text">ENTRA e partecipa ad EVENTI</p>

        <form class="login-form" @submit.prevent="authenticate">
            <input v-model="username" type="text" placeholder="Email, Username o Telefono" class="input-field">
            <input v-model="password" type="password" placeholder="Password" class="input-field">
            <div class="buttons">
                <button type="submit" class="btn access">Accedi</button>
                <button type="button" class="btn register">Registrati</button>
            </div>
        </form>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="google-login">
            <img src="@/assets/goog.png" alt="Accedi con Google" class="google-icon">
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Home',
    setup() {
        const username = ref('');
        const password = ref('');
        const errorMessage = ref(null);
        const router = useRouter();

        // Funzione per autenticarsi
        const authenticate = async () => {
            // Pulisci eventuali errori precedenti
            errorMessage.value = null;

            try {
                const response = await fetch('http://localhost:3000/api/v1/authentications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username.value,
                        password: password.value
                    })
                });

                if (!response.ok) {
                    throw new Error('Errore nell autenticazione');
                }

                const data = await response.json();

                console.log('Autenticazione riuscita:', data);
                localStorage.setItem('authToken', data.token);

                // Naviga alla pagina mappa
                router.push('/Mappa');

            } catch (error) {
                errorMessage.value = error.message;
            }
        };

        return { username, password, errorMessage, authenticate };
    }
};
</script>

<style scoped src="@/styles/login.css"></style>