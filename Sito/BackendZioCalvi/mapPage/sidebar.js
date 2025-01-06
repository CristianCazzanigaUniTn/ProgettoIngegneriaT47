import { apriPopupPartyEvento, mostraPopupDiv, apriPopUpAnim, chiudiPopup, chiudiPopUpAnim} from "./popUp.js";

export function aggiornaSidebar(dati, map) {
    const sidebar = document.querySelector('.sidebar');
    sidebar.innerHTML = '';

    let postIndex = 0;
    let textualIndex = 0;
    let eventiIndex = 0;
    let partyIndex = 0;
    let isPostTurn = true;

    function aggiungiCard(cardHTML) {
        sidebar.innerHTML += cardHTML;
    }

    while (postIndex < dati.posts.length || textualIndex < dati.textuals.length || eventiIndex < dati.eventi.length || partyIndex < dati.parties.length) {
        if (isPostTurn && postIndex < dati.posts.length) {
            const post = dati.posts[postIndex];
            const cardHTML = `
                <div class="card" data-index="${postIndex}" data-type="post">
                    <div class="card-header">
                        <img class="card-img-top" src="./image/download.png" alt="Foto Profilo">          
                        <strong>${post.utente.username}</strong>
                    </div>
                    <div class="card-body">
                        <img class="post-image" src="${post.post.contenuto}" alt="Foto Post">
                        <p class="card-description">${post.post.descrizione}</p>
                    </div>
                </div>
            `;
            aggiungiCard(cardHTML);
            postIndex++;
        } else if (!isPostTurn && textualIndex < dati.textuals.length) {
            const textual = dati.textuals[textualIndex];
            const cardHTML = `
                <div class="card" data-index="${textualIndex}" data-type="textual">
                    <div class="card-body">
                        <div class="textual-content">
                            <img class="textual-profile-img" src="./image/download.png" alt="Foto Profilo">
                            <div class="textual-text">
                                <strong>${textual.utente.username}</strong>
                                <p>${textual.post.descrizione}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            aggiungiCard(cardHTML);
            textualIndex++;
        } else if (postIndex >= dati.posts.length && eventiIndex < dati.eventi.length) {
            const evento = dati.eventi[eventiIndex];
            const cardHTML = `
                <div class="card" data-index="${eventiIndex}" data-type="evento">
                    <div class="card-header">
                        <strong>${evento.utente.username}</strong>
                    </div>
                    <div class="card-body">
                        <h5 class="evento-title">${evento.cont.nome}</h5>
                        <p class="evento-description">${evento.cont.descrizione}</p>
                    </div>
                </div>
            `;
            aggiungiCard(cardHTML);
            eventiIndex++;
        } else if (postIndex >= dati.posts.length && textualIndex >= dati.textuals.length && partyIndex < dati.parties.length) {
            const party = dati.parties[partyIndex];
            const cardHTML = `
                <div class="card" data-index="${partyIndex}" data-type="party">
                    <div class="card-header">
                        <strong>${party.utente.username}</strong>
                    </div>
                    <div class="card-body">
                        <h5 class="party-title">${party.cont.nome}</h5>
                        <p class="party-description">${party.cont.descrizione}</p>
                    </div>
                </div>
            `;
            aggiungiCard(cardHTML);
            partyIndex++;
        }

        // Alternare tra i tipi
        if (postIndex < dati.posts.length || textualIndex < dati.textuals.length || eventiIndex < dati.eventi.length || partyIndex < dati.parties.length) {
            isPostTurn = !isPostTurn;
        }
    }

    document.querySelectorAll('.sidebar .card').forEach(card => {
        card.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const type = this.getAttribute('data-type');

            if (type === 'post') {
                const post = dati.posts[index];
                mostraPopupDiv(post, map);
            } else if (type == 'party') {
                const party = dati.parties[index];
                apriPopupPartyEvento(party, map, "Party");
            } else if (type == 'evento') {
                const evento = dati.eventi[index];
                apriPopupPartyEvento(evento, map, "Evento");
            }
        });
    });
}