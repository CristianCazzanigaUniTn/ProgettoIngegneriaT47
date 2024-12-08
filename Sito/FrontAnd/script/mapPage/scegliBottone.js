function creaBottone(ruolo) {
    const contenitore = document.getElementById('floatingButton');
    contenitore.innerHTML = '';

    if (ruolo == "organizzatore") {
        var sottobottoni = '<span class="plus">+</span><span class="text3">Evento</span>';
        contenitore.innerHTML = sottobottoni;
    }
    else if(ruolo == "utente_base"){
        var sottobottoni = '<span class="plus">+</span><span class="text1">Post</span><span class="text2">Party</span>';
        contenitore.innerHTML = sottobottoni;
    }
}

creaBottone("utente_base")