document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="usuario"]').value;
    const senha = document.querySelector('input[name="senha"]').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (data.success) {
        alert('Login realizado com sucesso!');
        // Armazenar o token de autenticação e redirecionar para a página principal
        localStorage.setItem('token', data.token);
        window.location.href = '../calendario/index.html';
    } else {
        alert('Erro no login: ' + data.message);
    }
});
