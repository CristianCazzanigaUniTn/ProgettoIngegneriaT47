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