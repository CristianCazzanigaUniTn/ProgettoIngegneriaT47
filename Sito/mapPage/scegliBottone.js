import { fetchProtectedData } from "./estraiDati.js";

function creaPost() {
    chiudiCreaParty();
    chiudiCreaEvento();
    const contenitore = document.getElementById('creapost');
    contenitore.style.display = 'flex';
}

function chiudiCreaPost() {
    // Nascondere il contenitore del popup
    document.getElementById('creapost').style.display = 'none';

    // Ripristinare i campi del modulo
    document.querySelector('#creapost form').reset();

    // Gestire l'anteprima immagine
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('postImage').style.display = 'block';
    document.getElementById('label').style.display = 'block';

    // Ripristinare il campo descrizione
    document.getElementById('postDescription').value = '';
}


function creaParty() {
    chiudiCreaPost();
    chiudiCreaEvento();
    const contenitore = document.getElementById('creaParty');
    contenitore.style.display = 'flex';
}

function chiudiCreaParty() {
    // Nascondere il contenitore del form
    const contenitore = document.getElementById('creaParty');
    contenitore.style.display = 'none';

    // Ripristinare il form ai valori iniziali
    const form = document.getElementById('createPartyForm');
    form.reset();

    // Gestire l'anteprima immagine
    const imagePreview = document.getElementById('imagePreviews');
    imagePreview.style.display = 'none';

    const partyImage = document.getElementById('partyImage');
    partyImage.style.display = 'block';

    const imageLabel = document.getElementById('labels');
    imageLabel.style.display = 'block';
}

function creaEvento() {
    chiudiCreaParty();
    chiudiCreaPost();
    const contenitore = document.getElementById('creaEvento');
    contenitore.style.display = 'flex';
}

function chiudiCreaEvento() {
    // Nascondi il contenitore del form
    const contenitore = document.getElementById('creaEvento');
    contenitore.style.display = 'none';

    // Ripristina il form ai valori iniziali
    const form = document.getElementById('formCreaEvento');
    form.reset();

    // Nascondi l'anteprima immagine e mostra il caricamento immagine
    const anteprimaImmagine = document.getElementById('anteprimaImmagine');
    anteprimaImmagine.style.display = 'none';

    const immagineEvento = document.getElementById('immagineEvento');
    immagineEvento.style.display = 'block';
}
function creaBottone(ruolo) {
    const contenitore = document.getElementById('floatingButton');

    if (ruolo) {
        contenitore.style.display = 'block';
        contenitore.innerHTML = '';
        if (ruolo == "organizzatore") {
            var sottobottoni = '<span class="plus">+</span><span class="text3"  onclick="creaEvento()">Evento</span>';
            contenitore.innerHTML = sottobottoni;
        }
        else if (ruolo == "utente_base") {
            var sottobottoni = '<span class="plus">+</span><span class="text1" onclick="creaPost()">Post</span><span class="text2" onclick = "creaParty()">Party</span>';
            contenitore.innerHTML = sottobottoni;
            }
    } else {
        contenitore.style.display = 'none';
    }
}

creaBottone(fetchProtectedData().ruolo);
