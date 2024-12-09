

export async function aggiornaSide() {
    const response1 = await fetch('./fakedata/post.json');
    if (!response1.ok) {
        throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
    }
    const data1 = await response1.json();
    const response2 = await fetch('./fakedata/textual.json');
    if (!response2.ok) {
        throw new Error(`Errore nella richiesta: ${response2.status} ${response2.statusText}`);
    }
    const data2 = await response2.json();
    var post = data1.posts;
    var tex = data2.textuals;
    aggiornaSidebar(post, tex);
}


function aggiornaSidebar(posts, textuals) {
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
                        <img class="card-img-top" src="${post.profilo.foto_profilo}" alt="Foto Profilo">          
                        <strong>${post.profilo.nome}</strong>
                    </div>
                    <div class="card-body">
                        <img class="post-image" src="${post.contenuto.foto}" alt="Foto Post">
                        <p class="card-description">${post.contenuto.descrizione}</p>
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
                            <img class="textual-profile-img" src="${textual.profilo.foto_profilo}" alt="Foto Profilo">
                            <div class="textual-text">
                                <strong>${textual.profilo.nome}</strong>
                                <p>${textual.contenuto.descrizione}</p>
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
                mostraPopupDiv(post.contenuto, post.profilo, new H.geo.Point(post.posizione.lat, post.posizione.long));
            } else if (type === 'textual') {
                const textual = textuals[index];
                spostati(new H.geo.Point(textual.posizione.lat, textual.posizione.long));
            }
        });
    });
}
