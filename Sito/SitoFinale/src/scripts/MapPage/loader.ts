
export const inizializeLoader = () => {
    console.log("ciao2");
    setTimeout(function () {
        var loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none'; 
            console.log("ciao3");
        }
    }, 3000); 
};
