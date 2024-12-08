import { mostraPopupDiv } from "./popUp.js";

export function aggiornaSidebar(posts, textuals, map) {
    const sidebar = document.querySelector('.sidebar');
    sidebar.innerHTML = '';

    let postIndex = 0;
    let textualIndex = 0;
    let isPostTurn = true;

    function aggiungiCard(cardHTML) {
        sidebar.innerHTML += cardHTML;
    }

    while (postIndex < posts.length || textualIndex < textuals.length) {
        if (isPostTurn && postIndex < posts.length) {
            const post = posts[postIndex];
            const cardHTML = `
                <div class="card" data-index="${postIndex}" data-type="post">
                    <div class="card-header">
                        <img class="card-img-top" src="./image/download.png" alt="Foto Profilo">          
                        <strong>${post.utente.username}</strong>
                    </div>
                    <div class="card-body">
                        <img class="post-image" src="./image/super.png" alt="Foto Post">
                        <p class="card-description">${post.post.descrizione}</p>
                    </div>
                </div>
            `;
            aggiungiCard(cardHTML);
            postIndex++;
        } else if (!isPostTurn && textualIndex < textuals.length) {
            const textual = textuals[textualIndex];
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
        }

        isPostTurn = !isPostTurn;
    }

    document.querySelectorAll('.sidebar .card').forEach(card => {
        card.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const type = this.getAttribute('data-type');

            if (type === 'post') {
                const post = posts[index];
                mostraPopupDiv(post, map);
            } else if (type === 'textual') {
                const textual = textuals[index];
                spostati(new H.geo.Point(textual.posizione.lat, textual.posizione.long));
            }
        });
    });
}