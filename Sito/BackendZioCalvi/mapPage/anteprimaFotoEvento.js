const postImageInput = document.getElementById('immagineEvento');
const imagePreview = document.getElementById('anteprimaImmagine');
const previewImg = document.getElementById('immagineAnteprima');
const removeImageButton = document.getElementById('rimuoviImmagine');

postImageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            label.style.display = 'none';
            previewImg.src = e.target.result;
            imagePreview.style.display = 'block';
            postImageInput.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});