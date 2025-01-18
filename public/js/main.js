document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginButton2 = document.getElementById('loginButton2');

    if (loginButton) {
        loginButton.addEventListener('click', () => { 
            window.location.href = 'login.html';
        });
    }

    if (loginButton2) {
        loginButton2.addEventListener('click', () => {
            window.location.href = 'login2.html';
        });
    }
});

 
