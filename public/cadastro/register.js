// código antigo

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const data = await registerUser(nome, email, senha);
        handleResponse(data);
    } catch (error) {
        alert('Erro no registro: ' + error.message);
    }
});

async function registerUser(nome, email, senha) {
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição');
    } else{
        console.log('funcionando')
    }

    return response.json();
}

function handleResponse(data) {
    if (data.success) {
        alert('Usuário registrado com sucesso!');
        window.location.href = '../login/index.html';
    } else {
        alert('Erro no registro: ' + data.message);
    }
}

// código novo

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('senha');
    const strengthDisplay = document.getElementById('password-strength');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const submitBtn = document.getElementById('register-form');

    passwordInput.addEventListener('input', () => {
        const strength = calculatePasswordStrength(passwordInput.value);
        updateStrengthDisplay(strength);
    });

    emailInput.addEventListener('input', () => {
        validateEmail(emailInput.value);
    });

    submitBtn.addEventListener('click', (event) => {
        if (!validateEmail(emailInput.value)) {
            event.preventDefault(); // Impede o envio do formulário se o e-mail for inválido
        }
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[\W]+/)) strength++;
        return strength;
    }

    function updateStrengthDisplay(strength) {
        // strengthDisplay.className = '';
        
        if(strength == 0) {
            strengthDisplay.style.width = "0%";
        } else if (strength <= 1 ) {
            //strengthDisplay.classList.add('weak');

            strengthDisplay.style.backgroundColor = "red";
            strengthDisplay.style.width = "20%";
        } else if (strength <= 3) {
            //strengthDisplay.classList.add('medium');
            strengthDisplay.style.backgroundColor = "yellow";
            strengthDisplay.style.width = "40%";
        } else {
            //strengthDisplay.classLis.add('strong');
            strengthDisplay.style.backgroundColor = "green";
            strengthDisplay.style.width = "60%";

        }
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(email)) {
            emailError.textContent = '';
            return true;
        } else {
            emailError.textContent = 'Email inválido';
            return false;
        }
    }
});

// Mostrar Senha

function togglePassword(){
    const psw = document.getElementById('senha');
    const imagePsw = document.getElementById('showPss');
    const confirmPsw = document.getElementById('Confirmarsenha');

    if(psw.type == "password"){
        psw.type = "text";
        confirmPsw.type = "text";
        imagePsw.src = '../assets/img/eye-opened.svg';
    } else{
        psw.type = "password";
        confirmPsw.type = "password";
        imagePsw.src = "../assets/img/eye-closed.svg";
    }
}


