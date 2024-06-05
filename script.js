let tarefasConcluidas = 0;

function concluirTarefa() {
    tarefasConcluidas++;
    document.getElementById('tarefasConcluidas').innerText = tarefasConcluidas;
    atualizarReino();
}

function atualizarReino() {
    const imagemReino = document.getElementById('reinoImage');
    const fase = Math.floor(tarefasConcluidas / 15) + 1;
    imagemReino.src = `imagens/reino${fase}.jpg`;
}
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('load_tarefas.php')
        .then(response => response.text())
        .then(data => {
            tarefasConcluidas = parseInt(data, 10) || 0;
            document.getElementById('tarefasConcluidas').innerText = tarefasConcluidas;
            atualizarReino();
        });
});

function concluirTarefa() {
    tarefasConcluidas++;
    document.getElementById('tarefasConcluidas').innerText = tarefasConcluidas;
    atualizarReino();
    salvarTarefas();
}

function atualizarReino() {
    const imagemReino = document.getElementById('reinoImage');
    const fase = Math.floor(tarefasConcluidas / 15) + 1;
    imagemReino.src = `imagens/reino${fase}.jpg`;
}

function salvarTarefas() {
    fetch('save_tarefas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `tarefas=${tarefasConcluidas}`
    })
    .then(response => response.text())
    .then(data => console.log(data));
}

/*texto do reino*/
fetch('texto_feudo1.txt')
    .then(response => response.text())
    .then(text => document.getElementById('texto').innerText = text)
    .catch(error => console.error('Erro ao carregar o arquivo:', error));