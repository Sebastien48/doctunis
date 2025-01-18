/*document.addEventListener('DOMContentLoaded', () => {
    const continueButton = document.getElementById('continueButton');
    if ( continueButton.disabled = false) {
        continueButton.addEventListener('click', () => {
            window.location.href = 'accueil.html';
        });
    }
});*/
continueBtn.addEventListener('click', () => {
    if (continueBtn.classList.contains('active')) {
        
        window.location.href = 'accueil.html'; // Remplacez par l'URL r
    }
});