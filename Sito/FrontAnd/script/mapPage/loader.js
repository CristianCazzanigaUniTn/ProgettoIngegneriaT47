window.addEventListener('load', function () {
    setTimeout(function () {
        var loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none'; 
        }
    }, 3000);  
});