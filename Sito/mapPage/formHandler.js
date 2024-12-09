function postformHandler() {

    const descrizione = document.getElementById('postDescription').value;
    let imageUrl; // Variabile per salvare l'URL dell'immagine

    if (descrizione === '') {
        console.error("Per creare un post è necessario inserire una descrizione.");
        return;
    }

    // Prendi il file caricato
    const file = document.getElementById('postImage').files[0];

    if (!file) {
        console.error("Per creare un post è necessario caricare un'immagine.");
        return;
    }

    const tokenFromStorage = localStorage.getItem('authToken');

    if (!tokenFromStorage) {
        throw new Error("Utente non autenticato!");
    }

    // Step 1: Carica l'immagine su Cloudinary
    fetch('http://localhost:3000/generate-signed-url-post', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${tokenFromStorage}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", data.upload_preset);  // Usa il preset ottenuto dal backend
            formData.append("timestamp", data.timestamp);          // Usa il timestamp ottenuto dal backend
            formData.append("signature", data.signature);          // Usa la signature ottenuta dal backend
            formData.append("api_key", data.api_key);

            // Carica l'immagine su Cloudinary
            return fetch('https://api.cloudinary.com/v1_1/dc2ga9rlo/image/upload', {
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('Immagine caricata con successo', data);
            imageUrl = data.secure_url; // URL sicuro dell'immagine

            if (!imageUrl) {
                imageUrl = "null";               
            }

            // Step 2: Crea il post con i dettagli
            const postData = {
                descrizione: descrizione,
                contenuto: imageUrl,
                luogo: "Posizione delle coordinate",  // Puoi sostituire con la logica del luogo
                posizione: {
                    latitudine: 46.0667,
                    longitudine: 11.1167
                },
                data_creazione: "2024-10-02"  // Puoi sostituire con la data corrente o la logica necessaria
            };


            // Chiamata API per creare il post
            return fetch('http://localhost:3000/api/Post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenFromStorage}`,
                    'Content-Type': 'application/json'  // Invia come JSON
                },
                body: JSON.stringify(postData)  // Corpo della richiesta in JSON
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post creato con successo', data);
        })
        .catch(error => {
            console.error('Errore nel caricamento:', error);
        });
    
    chiudiCreaPost();   

}


function partyformHandler() {

    // Recupera i dati dai campi del form
    const partyName = document.getElementById('partyName').value;
    const partyDate = document.getElementById('partyDate').value;
    const partyLocation = document.getElementById('partyLocation').value;
    const partyType = document.getElementById('partyType').value;
    const partyParticipants = document.getElementById('partyParticipants').value;
    const partyDescription = document.getElementById('partyDescription').value;

    // Prendi il file caricato
    const file = document.getElementById('partyImage').files[0];
    let imageUrl;

    // Validazioni
    if (!partyName || !partyDate || !partyLocation || !partyType || !partyParticipants || !partyDescription) {
        console.error("Tutti i campi sono obbligatori.");
        return;
    }

    if (!file) {
        console.error("Per creare un party è necessario caricare un'immagine.");
        return;
    }

    const tokenFromStorage = localStorage.getItem('authToken');

    if (!tokenFromStorage) {
        throw new Error("Utente non autenticato!");
    }

    // Step 1: Carica l'immagine su Cloudinary
    fetch('http://localhost:3000/generate-signed-url-party', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${tokenFromStorage}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", data.upload_preset);  // Usa il preset ottenuto dal backend
            formData.append("timestamp", data.timestamp);          // Usa il timestamp ottenuto dal backend
            formData.append("signature", data.signature);          // Usa la signature ottenuta dal backend
            formData.append("api_key", data.api_key);

            // Carica l'immagine su Cloudinary
            return fetch('https://api.cloudinary.com/v1_1/dc2ga9rlo/image/upload', {
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('Immagine caricata con successo', data);
            imageUrl = data.secure_url; // URL sicuro dell'immagine

            if (!imageUrl) {
                imageUrl = "null";               
            }

            // Creazione dell'oggetto con i dati
            const partyData = {
                nome: partyName,
                data_inizio: partyDate,
                luogo: partyLocation,
                posizione: {latitudine: 0, longitudine: 0},
                id_categoria: "673603662b45400acaf456d0",
                numero_massimo_partecipanti: parseInt(partyParticipants, 10),
                descrizione: partyDescription,
                foto: imageUrl
            };

            console.log("Dati del party:", partyData);


            // Chiamata API per creare il post
            return fetch('http://localhost:3000/api/party', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenFromStorage}`,
                    'Content-Type': 'application/json'  // Invia come JSON
                },
                body: JSON.stringify(partyData)  // Corpo della richiesta in JSON
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('Party creato con successo', data);
        })
        .catch(error => {
            console.error('Errore nel caricamento:', error);
        });
    
    chiudiCreaParty();   

}


