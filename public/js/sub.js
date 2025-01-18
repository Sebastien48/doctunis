document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const continueButton = document.getElementById('continueButton');

    function validateForm() {
        if (emailInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
            continueButton.disabled = false;
            continueButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            continueButton.classList.add('bg-red-500', 'hover:bg-red-700', 'cursor-pointer');
        } else {
            continueButton.disabled = true;
            continueButton.classList.remove('bg-red-500', 'hover:bg-red-700', 'cursor-pointer');
            continueButton.classList.add('bg-gray-400', 'cursor-not-allowed');
        }
    }

    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    continueButton.addEventListener('click', () => {
        if (continueButton.classList.contains('active')) {
            
            window.location.href = 'accueil.html'; 
        }
    });
});