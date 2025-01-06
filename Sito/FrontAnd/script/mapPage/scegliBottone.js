
function creaPost()
{
    chiudiCreaEvento();
    chiudiCreaParty();
    const contenitore = document.getElementById('creapost');
    contenitore.style.display = 'flex';
}


function chiudiCreaPost() {
    document.getElementById('postImage').style.display = 'block'; 
    document.getElementById('label').style.display = 'block'; 
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('postDescription').value = ''; 
    const contenitore = document.getElementById('creapost');
    contenitore.style.display = 'none';
  }

  function creaEvento()
  {
      chiudiCreaParty();
      chiudiCreaPost();
      const contenitore = document.getElementById('creaEvento');
      contenitore.style.display = 'flex';
  }

  function chiudiCreaEvento() {
    document.getElementById('anteprimaImmagine').style.display = 'none';
    document.getElementById('descrizioneEvento').value = ''; 
    const contenitore = document.getElementById('creaEvento');
    contenitore.style.display = 'none';
}

function chiudiCreaParty() {
    document.getElementById('imagePreviews').style.display = 'none';
    document.getElementById('partyDescription').value = ''; 
    const contenitore = document.getElementById('creaParty');
    contenitore.style.display = 'none';
}
function creaParty()
{
    chiudiCreaEvento();
    chiudiCreaPost();
    const contenitore = document.getElementById('creaParty');
    contenitore.style.display = 'flex';
}

function creaBottone(ruolo) {
    const contenitore = document.getElementById('floatingButton');
    contenitore.innerHTML = '';

    if (ruolo == "organizzatore") {
        var sottobottoni = '<span class="plus" >+</span><span onclick="creaEvento()" class="text3">Evento</span>';
        contenitore.innerHTML = sottobottoni;
    }
    else if(ruolo == "utente_base"){
        var sottobottoni = '<span class="plus">+</span><span class="text1" onclick="creaPost()">Post</span><span class="text2"  onclick="creaParty()">Party</span>';
        contenitore.innerHTML = sottobottoni;
    }
}

creaBottone("utente_base")