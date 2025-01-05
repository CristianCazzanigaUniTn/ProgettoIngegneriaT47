import { reactive } from 'vue';

// Funzione per decodificare il JWT
function decodeJwt(token) {
  const payload = token.split('.')[1]; // Estrai la parte payload del token
  const decoded = atob(payload); // Decodifica la parte payload da Base64
  return JSON.parse(decoded); // Parsifica la stringa decodificata in JSON
}

export const authState = reactive({
  isAuthenticated: !!localStorage.getItem('authToken'),
  userId: null,

  // Impostazione dello stato di autenticazione
  setAuth(token) {
    if (token) {
      this.isAuthenticated = true;
      const decoded = decodeJwt(token); // Decodifica il token e ottieni i dati
      this.userId = decoded._id; // Usa '_id' per memorizzare l'ID dell'utente
    } else {
      this.clearAuth(); // Se il token non è valido, cancella l'autenticazione
    }
  },

  // Pulizia dello stato di autenticazione
  clearAuth() {
    this.isAuthenticated = false;
    this.userId = null;
    localStorage.removeItem('authToken');
  },
});

// Quando la pagina viene caricata, eseguiamo una verifica per vedere se il token è già presente
const token = localStorage.getItem('authToken');
if (token) {
  authState.setAuth(token); // Se c'è il token, lo usiamo per impostare lo stato
}
