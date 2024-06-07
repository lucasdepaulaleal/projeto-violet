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
    const submitBtn = document.getElementById('submit-btn');

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
        strengthDisplay.className = '';
        if (strength <= 1) {
            strengthDisplay.classList.add('weak');
        } else if (strength <= 3) {
            strengthDisplay.classList.add('medium');
        } else {
            strengthDisplay.classList.add('strong');
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
