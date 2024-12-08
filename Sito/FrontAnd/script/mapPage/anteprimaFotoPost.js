const postImageInput = document.getElementById('postImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const label = document.getElementById('label');

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


    const partyImageInput = document.getElementById('partyImage');
    const imagePreviews = document.getElementById('imagePreviews');
    const previewImgs = document.getElementById('previewImgs');
    const removeImageButton = document.getElementById('removeImage');

    partyImageInput.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImgs.src = e.target.result;
          imagePreviews.style.display = 'block';
        }
        reader.readAsDataURL(file);
      }
    });

    removeImageButton.addEventListener('click', function () {
      partyImageInput.value = '';
      previewImgs.src = '';
      imagePreviews.style.display = 'none';
    });

    const createPartyForm = document.getElementById('createPartyForm');
    createPartyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Party creato con successo!');
      createPartyForm.reset();
      imagePreviews.style.display = 'none';
    });