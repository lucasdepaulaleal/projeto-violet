<?php
if (isset($_POST['tarefas'])) {
    $tarefas = intval($_POST['tarefas']);
    file_put_contents('tarefas.txt', $tarefas);
    echo "Tarefas salvas!";
}
?>
