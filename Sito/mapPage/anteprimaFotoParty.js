const postImageInput = document.getElementById('partyImage');
                const imagePreview = document.getElementById('imagePreviews');
                const previewImg = document.getElementById('previewImgs');
                const label = document.getElementById('labels');

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