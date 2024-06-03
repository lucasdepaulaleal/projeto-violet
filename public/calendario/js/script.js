const calendario = document.querySelector(".calendar"),
  data = document.querySelector(".date"),
  containerDias = document.querySelector(".days"),
  anterior = document.querySelector(".prev"),
  proximo = document.querySelector(".next"),
  btnHoje = document.querySelector(".today-btn"),
  btnIr = document.querySelector(".goto-btn"),
  entradaData = document.querySelector(".date-input"),
  diaEvento = document.querySelector(".event-day"),
  dataEvento = document.querySelector(".event-date"),
  containerEventos = document.querySelector(".events"),
  btnAdicionarEvento = document.querySelector(".add-event"),
  wrapperAdicionarEvento = document.querySelector(".add-event-wrapper"),
  btnFecharAdicionarEvento = document.querySelector(".close"),
  tituloAdicionarEvento = document.querySelector(".event-name"),
  horaInicioAdicionarEvento = document.querySelector(".event-time-from"),
  horaFimAdicionarEvento = document.querySelector(".event-time-to"),
  btnSubmeterAdicionarEvento = document.querySelector(".add-event-btn");

let hoje = new Date();
let diaAtivo;
let mes = hoje.getMonth();
let ano = hoje.getFullYear();

const diasSemana = [
  "Domingo", 
  "Segunda", 
  "Terça", 
  "Quarta", 
  "Quinta", 
  "Sexta", 
  "Sábado"
];
const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const eventosArr = [];

async function obterEventos() {
  try {
    const response = await fetch('/eventos', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      const eventos = await response.json();
      console.log('Eventos recebidos do banco de dados:', eventos);
      eventosArr.length = 0; // Limpar o array de eventos antes de adicionar novos
      eventos.forEach(evento => {
        const { id, titulo, data, hora_inicio, hora_fim, status } = evento;
        if (data) {
          const dataObj = new Date(data);
          const dia = dataObj.getDate();
          const mes = dataObj.getMonth() + 1;
          const ano = dataObj.getFullYear();
          let eventoAdicionado = false;
          eventosArr.forEach(item => {
            if (item.dia === dia && item.mes === mes && item.ano === ano) {
              item.eventos.push({ id, title: titulo, time: `${hora_inicio} - ${hora_fim}`, status });
              eventoAdicionado = true;
            }
          });
          if (!eventoAdicionado) {
            eventosArr.push({
              dia,
              mes,
              ano,
              eventos: [{ id, title: titulo, time: `${hora_inicio} - ${hora_fim}`, status }]
            });
          }
        } else {
          console.error('Evento com data inválida:', evento);
        }
      });
      iniciarCalendario(diaAtivo);
    } else {
      console.error('Erro na resposta ao obter eventos:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao obter eventos:', error);
  }
}

async function salvarEvento(evento) {
  try {
    const response = await fetch('/eventos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(evento)
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
  }
}

async function atualizarEvento(id, evento) {
  try {
    const response = await fetch(`/eventos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        titulo: evento.title,
        data: evento.data,
        hora_inicio: evento.hora_inicio,
        hora_fim: evento.hora_fim,
        status: evento.status
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
  }
}

async function excluirEvento(id) {
  try {
    await fetch(`/eventos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
  }
}

async function contarEventosConcluidos() {
  try {
    const response = await fetch('/eventos/concluidos', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const { count } = await response.json();
    document.querySelector(".contador").innerText = count;
  } catch (error) {
    console.error('Erro ao contar eventos concluídos:', error);
  }
}

function iniciarCalendario(diaAtivoInicial = null) {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const ultimoDiaMesAnterior = new Date(ano, mes, 0);
  const diasMesAnterior = ultimoDiaMesAnterior.getDate();
  const ultimoData = ultimoDia.getDate();
  const diaSemana = primeiroDia.getDay();
  const proximosDias = 7 - ultimoDia.getDay() - 1;

  data.innerHTML = meses[mes] + " " + ano;

  let dias = "";

  for (let x = diaSemana; x > 0; x--) {
    dias += `<div class="day prev-date">${diasMesAnterior - x + 1}</div>`;
  }

  for (let i = 1; i <= ultimoData; i++) {
    let evento = false;
    eventosArr.forEach((eventoObj) => {
      if (
        eventoObj.dia === i &&
        eventoObj.mes === mes + 1 &&
        eventoObj.ano === ano
      ) {
        evento = true;
      }
    });

    if (diaAtivoInicial && i === diaAtivoInicial) {
      diaAtivo = i;
      obterDiaAtivo(i);
      atualizarEventos(i);
      if (evento) {
        dias += `<div class="day active event">${i}</div>`;
      } else {
        dias += `<div class="day active">${i}</div>`;
      }
    } else if (
      i === new Date().getDate() &&
      ano === new Date().getFullYear() &&
      mes === new Date().getMonth()
    ) {
      if (!diaAtivoInicial) {
        diaAtivo = i;
        obterDiaAtivo(i);
        atualizarEventos(i);
      }
      if (evento) {
        dias += `<div class="day today event">${i}</div>`;
      } else {
        dias += `<div class="day today">${i}</div>`;
      }
    } else {
      if (evento) {
        dias += `<div class="day event">${i}</div>`;
      } else {
        dias += `<div class="day">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= proximosDias; j++) {
    dias += `<div class="day next-date">${j}</div>`;
  }
  containerDias.innerHTML = dias;
  adicionarOuvinte();
  contarEventosConcluidos();
  aplicarProgresso();
}
function aplicarProgresso() {
  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    const diaNumero = parseInt(dia.innerText);
    if (!isNaN(diaNumero) && !dia.classList.contains("prev-date") && !dia.classList.contains("next-date")) {
      eventosArr.forEach((eventoObj) => {
        if (
          eventoObj.dia === diaNumero &&
          eventoObj.mes === mes + 1 &&
          eventoObj.ano === ano
        ) {
          const totalEventos = eventoObj.eventos.length;
          const eventosConcluidos = eventoObj.eventos.filter(evento => evento.status).length;
          const progresso = totalEventos > 0 ? (eventosConcluidos / totalEventos) : 0;
          dia.style.setProperty('--progress', progresso);
          dia.setAttribute("data-progress", progresso);
        }
      });
    }
  });
}
function mesAnterior() {
  mes--;
  if (mes < 0) {
    mes = 11;
    ano--;
  }
  iniciarCalendario();
}

function proximoMes() {
  mes++;
  if (mes > 11) {
    mes = 0;
    ano++;
  }
  iniciarCalendario();
}

anterior.addEventListener("click", mesAnterior);
proximo.addEventListener("click", proximoMes);

btnHoje.addEventListener("click", () => {
  hoje = new Date();
  mes = hoje.getMonth();
  ano = hoje.getFullYear();
  iniciarCalendario();
});

entradaData.addEventListener("input", (e) => {
  entradaData.value = entradaData.value.replace(/[^0-9/]/g, "");
  if (entradaData.value.length === 2) {
    entradaData.value += "/";
  }
  if (entradaData.value.length > 7) {
    entradaData.value = entradaData.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (entradaData.value.length === 3) {
      entradaData.value = entradaData.value.slice(0, 2);
    }
  }
});

btnIr.addEventListener("click", irParaData);

function irParaData() {
  const arrData = entradaData.value.split("/");
  if (arrData.length === 2) {
    if (arrData[0] > 0 && arrData[0] < 13 && arrData[1].length === 4) {
      mes = arrData[0] - 1;
      ano = arrData[1];
      iniciarCalendario();
      return;
    }
  }
  alert("Data Inválida");
}

function obterDiaAtivo(data) {
  const dia = new Date(ano, mes, data);
  const diaDaSemana = dia.getDay();
  const nomeDia = diasSemana[diaDaSemana];
  diaEvento.innerHTML = nomeDia;
  dataEvento.innerHTML = data + " " + meses[mes] + " " + ano;
}

function atualizarEventos(data) {
  let eventos = "";
  eventosArr.forEach((evento) => {
    if (
      data === evento.dia &&
      mes + 1 === evento.mes &&
      ano === evento.ano
    ) {
      evento.eventos.forEach((evento) => {
        let eventClass = evento.status ? 'event-complete' : 'event';
        eventos += `<div class="${eventClass}">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${evento.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${evento.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (eventos === "") {
    eventos = `<div class="no-event">
            <h3>Sem Eventos</h3>
        </div>`;
  }
  containerEventos.innerHTML = eventos;

  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    dia.classList.remove("event");
    dia.removeAttribute("data-progress");
    dia.style.setProperty('--progress', 0);
  });

  eventosArr.forEach((eventoObj) => {
    if (
      eventoObj.mes === mes + 1 &&
      eventoObj.ano === ano
    ) {
      dias.forEach((dia) => {
        const diaNumero = parseInt(dia.innerText);
        const diaClasse = dia.classList.contains("prev-date") || dia.classList.contains("next-date");
        if (diaNumero === eventoObj.dia && !diaClasse) {
          dia.classList.add("event");
          const totalEventos = eventoObj.eventos.length;
          const eventosConcluidos = eventoObj.eventos.filter(evento => evento.status).length;
          const progresso = totalEventos > 0 ? (eventosConcluidos / totalEventos) : 0;
          dia.style.setProperty('--progress', progresso);
          dia.setAttribute("data-progress", progresso);
        }
      });
    }
    
  });
  
}

function adicionarOuvinte() {
  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    dia.addEventListener("click", (e) => {
      const target = e.target.closest(".day");
      if (!target) return;

      const diaNum = parseInt(target.innerText);
      if (isNaN(diaNum)) return;

      diaAtivo = diaNum;

      obterDiaAtivo(diaNum);
      atualizarEventos(diaNum);

      dias.forEach((dia) => {
        dia.classList.remove("active");
      });

      if (target.classList.contains("prev-date")) {
        mesAnterior();
        setTimeout(() => {
          const dias = document.querySelectorAll(".day");
          dias.forEach((dia) => {
            if (!dia.classList.contains("prev-date") && parseInt(dia.innerText) === diaNum) {
              dia.classList.add("active");
            }
          });
        }, 100);
      } else if (target.classList.contains("next-date")) {
        proximoMes();
        setTimeout(() => {
          const dias = document.querySelectorAll(".day");
          dias.forEach((dia) => {
            if (!dia.classList.contains("next-date") && parseInt(dia.innerText) === diaNum) {
              dia.classList.add("active");
            }
          });
        }, 100);
      } else {
        target.classList.add("active");
      }
    });
  });
}

btnAdicionarEvento.addEventListener("click", () => {
  wrapperAdicionarEvento.classList.toggle("active");
});

btnFecharAdicionarEvento.addEventListener("click", () => {
  wrapperAdicionarEvento.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== btnAdicionarEvento && !wrapperAdicionarEvento.contains(e.target)) {
    wrapperAdicionarEvento.classList.remove("active");
  }
});

tituloAdicionarEvento.addEventListener("input", (e) => {
  tituloAdicionarEvento.value = tituloAdicionarEvento.value.slice(0, 60);
});

horaInicioAdicionarEvento.addEventListener("input", (e) => {
  horaInicioAdicionarEvento.value = horaInicioAdicionarEvento.value.replace(/[^0-9:]/g, "");
  if (horaInicioAdicionarEvento.value.length === 2) {
    horaInicioAdicionarEvento.value += ":";
  }
  if (horaInicioAdicionarEvento.value.length > 5) {
    horaInicioAdicionarEvento.value = horaInicioAdicionarEvento.value.slice(0, 5);
  }
});

horaFimAdicionarEvento.addEventListener("input", (e) => {
  horaFimAdicionarEvento.value = horaFimAdicionarEvento.value.replace(/[^0-9:]/g, "");
  if (horaFimAdicionarEvento.value.length === 2) {
    horaFimAdicionarEvento.value += ":";
  }
  if (horaFimAdicionarEvento.value.length > 5) {
    horaFimAdicionarEvento.value = horaFimAdicionarEvento.value.slice(0, 5);
  }
});

btnSubmeterAdicionarEvento.addEventListener("click", async () => {
  const tituloEvento = tituloAdicionarEvento.value;
  const horaInicioEvento = horaInicioAdicionarEvento.value;
  const horaFimEvento = horaFimAdicionarEvento.value;
  const nivelComplexidade = document.getElementById('mySelect').value;

  if (tituloEvento === "" || horaInicioEvento === "" || horaFimEvento === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }

  const horaInicio = converterHora(horaInicioEvento);
  const horaFim = converterHora(horaFimEvento);

  let eventoExiste = false;
  eventosArr.forEach((evento) => {
    if (
      evento.dia === diaAtivo &&
      evento.mes === mes + 1 &&
      evento.ano === ano
    ) {
      evento.eventos.forEach((evento) => {
        if (evento.title === tituloEvento) {
          eventoExiste = true;
        }
      });
    }
  });
  if (eventoExiste) {
    alert("Evento já adicionado");
    return;
  }

  const novoEvento = {
    titulo: tituloEvento,
    data: `${ano}-${(mes + 1).toString().padStart(2, '0')}-${diaAtivo.toString().padStart(2, '0')}`,
    hora_inicio: horaInicio,
    hora_fim: horaFim,
    status: false
  };

  const eventoSalvo = await salvarEvento(novoEvento);

  if (eventoSalvo) {
    let eventoAdicionado = false;
    if (eventosArr.length > 0) {
      eventosArr.forEach((item) => {
        if (
          item.dia === diaAtivo &&
          item.mes === mes + 1 &&
          item.ano === ano
        ) {
          item.eventos.push({ ...novoEvento, id: eventoSalvo.insertId, title: tituloEvento });
          eventoAdicionado = true;
        }
      });
    }

    if (!eventoAdicionado) {
      eventosArr.push({
        dia: diaAtivo,
        mes: mes + 1,
        ano: ano,
        eventos: [{ ...novoEvento, id: eventoSalvo.insertId, title: tituloEvento }],
      });
    }

    await criarEventosAutomaticos(nivelComplexidade, tituloEvento, diaAtivo, mes + 1, ano, eventosArr);

    wrapperAdicionarEvento.classList.remove("active");
    tituloAdicionarEvento.value = "";
    horaInicioAdicionarEvento.value = "";
    horaFimAdicionarEvento.value = "";
    iniciarCalendario(diaAtivo); // Atualizar o calendário mantendo o dia ativo
  }
});

containerEventos.addEventListener("click", async (e) => {
  if (e.target.closest(".event")) {
    const eventElement = e.target.closest(".event");
    const tituloEvento = eventElement.querySelector(".event-title").innerHTML;
    let eventoSelecionado = null;

    eventosArr.forEach((evento) => {
      if (
        evento.dia === diaAtivo &&
        evento.mes === mes + 1 &&
        evento.ano === ano
      ) {
        evento.eventos.forEach((item) => {
          if (item.title === tituloEvento) {
            eventoSelecionado = item;
          }
        });
      }
    });

    if (eventoSelecionado) {
      const markCompleteBtn = document.createElement("button");
      markCompleteBtn.classList.add("add-event-btn");
      markCompleteBtn.textContent = "Concluído";

      markCompleteBtn.addEventListener("click", async () => {
        const [hora_inicio, hora_fim] = eventoSelecionado.time.split(" - ");
        const eventoAtualizado = {
          ...eventoSelecionado,
          data: `${ano}-${(mes + 1).toString().padStart(2, '0')}-${diaAtivo.toString().padStart(2, '0')}`,
          hora_inicio,
          hora_fim,
          status: true
        };
        await atualizarEvento(eventoSelecionado.id, eventoAtualizado);
        obterEventos(); // Atualizar eventos após marcar como concluído
      });

      const deleteEventBtn = document.createElement("button");
      deleteEventBtn.classList.add("add-event-btn");
      deleteEventBtn.textContent = "Excluir";

      deleteEventBtn.addEventListener("click", async () => {
        if (confirm("Tem certeza de que deseja excluir este evento?")) {
          await excluirEvento(eventoSelecionado.id);
          eventosArr.forEach((evento) => {
            if (
              evento.dia === diaAtivo &&
              evento.mes === mes + 1 &&
              evento.ano === ano
            ) {
              const eventoIndex = evento.eventos.findIndex(
                (item) => item.title === tituloEvento
              );
              if (eventoIndex !== -1) {
                evento.eventos.splice(eventoIndex, 1);
                if (evento.eventos.length === 0) {
                  const diaIndex = eventosArr.findIndex(
                    (e) => e.dia === diaAtivo && e.mes === mes + 1 && e.ano === ano
                  );
                  if (diaIndex !== -1) {
                    eventosArr.splice(diaIndex, 1);
                  }
                }
                obterEventos(); // Atualizar eventos após exclusão
              }
            }
          });
        }
      });

      const closeBtn = document.createElement("i");
      closeBtn.classList.add("fas", "fa-times", "close");

      const addEventFooter = document.createElement("div");
      addEventFooter.classList.add("add-event-footer");
      addEventFooter.appendChild(markCompleteBtn);
      addEventFooter.appendChild(deleteEventBtn);
      addEventFooter.appendChild(closeBtn);

      const container = document.querySelector('.container');
      const right = container.querySelector('.right');
      const events = right.querySelector('.events');
      const addEventWrapper = document.createElement("div");
      addEventWrapper.classList.add("add-event-wrapper", "active");

      const addEventHeader = document.createElement("div");
      addEventHeader.classList.add("add-event-header");

      const titleInput = document.createElement("input");
      titleInput.setAttribute("type", "text");
      titleInput.setAttribute("placeholder", "Nome do Evento");
      titleInput.classList.add("add-event-input");
      titleInput.value = eventoSelecionado.title;

      const timeFromInput = document.createElement("input");
      timeFromInput.setAttribute("type", "text");
      timeFromInput.setAttribute("placeholder", "Hora de Início do Evento");
      timeFromInput.classList.add("add-event-input");
      timeFromInput.value = eventoSelecionado.time.split(" - ")[0];

      const timeToInput = document.createElement("input");
      timeToInput.setAttribute("type", "text");
      timeToInput.setAttribute("placeholder", "Hora de Término do Evento");
      timeToInput.classList.add("add-event-input");
      timeToInput.value = eventoSelecionado.time.split(" - ")[1];

      addEventHeader.appendChild(titleInput);
      addEventHeader.appendChild(closeBtn);

      const addEventBody = document.createElement("div");
      addEventBody.classList.add("add-event-body");
      addEventBody.appendChild(timeFromInput);
      addEventBody.appendChild(timeToInput);

      addEventWrapper.appendChild(addEventHeader);
      addEventWrapper.appendChild(addEventBody);
      addEventWrapper.appendChild(addEventFooter);

      events.appendChild(addEventWrapper);

      closeBtn.addEventListener("click", () => {
        addEventWrapper.remove();
      });

      closeBtn.addEventListener("click", async () => {
        const updatedTitle = titleInput.value;
        const updatedTimeFrom = timeFromInput.value;
        const updatedTimeTo = timeToInput.value;
        const [hora_inicio, hora_fim] = `${updatedTimeFrom} - ${updatedTimeTo}`.split(" - ");
        const eventoAtualizado = {
          ...eventoSelecionado,
          title: updatedTitle,
          data: `${ano}-${(mes + 1).toString().padStart(2, '0')}-${diaAtivo.toString().padStart(2, '0')}`,
          time: `${updatedTimeFrom} - ${updatedTimeTo}`,
          hora_inicio,
          hora_fim,
          status: eventoSelecionado.status
        };
        await atualizarEvento(eventoSelecionado.id, eventoAtualizado);
        obterEventos(); // Atualizar eventos após edição
      });
    }
  }
});

function converterHora(hora) {
  let horaArr = hora.split(":");
  let horaHora = parseInt(horaArr[0]);
  let horaMin = horaArr[1];
  let formatoHora = horaHora >= 12 ? "PM" : "AM";
  horaHora = horaHora % 12 || 0;
  if (formatoHora === "PM") {
    horaHora += 12;
  }
  hora = horaHora.toString().padStart(2, "0") + ":" + horaMin;
  return hora;
}

function gerarHoraAleatoria() {
  const hora = Math.floor(Math.random() * (23 - 8 + 1)) + 8;
  const minutos = Math.floor(Math.random() * 60);
  const horaStr = hora < 10 ? `0${hora}` : `${hora}`;
  const minutosStr = minutos < 10 ? `0${minutos}` : `${minutos}`;
  return `${horaStr}:${minutosStr}`;
}

function gerarHoraFim(horaInicio) {
  const [hora, minutos] = horaInicio.split(':').map(Number);
  const duracao = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
  const novaHora = new Date();
  novaHora.setHours(hora);
  novaHora.setMinutes(minutos + duracao);
  const horaFim = novaHora.getHours();
  const minutosFim = novaHora.getMinutes();
  const horaFimStr = horaFim < 10 ? `0${horaFim}` : `${horaFim}`;
  const minutosFimStr = minutosFim < 10 ? `0${minutosFim}` : `${minutosFim}`;
  return `${horaFimStr}:${minutosFimStr}`;
}

async function criarEventosAutomaticos(nivelComplexidade, tituloEvento, diaEventoPrincipal, mesEventoPrincipal, anoEventoPrincipal, eventosArr) {
  const niveis = {
    novato: 1,
    aventureiro: 2,
    cavaleiro: 3,
    lendario: 4,
    Codigo_Sombrio: 5
  };

  const quantidadeEventos = niveis[nivelComplexidade];
  if (quantidadeEventos > 0) {
    const hoje = new Date();
    const dataEventoPrincipal = new Date(anoEventoPrincipal, mesEventoPrincipal - 1, diaEventoPrincipal);
    const diasDisponiveis = Math.ceil((dataEventoPrincipal - hoje) / (1000 * 60 * 60 * 24));

    if (diasDisponiveis < quantidadeEventos) {
      console.error("Não há dias suficientes entre hoje e a data do evento principal.");
      return;
    }

    const intervaloDias = Math.floor(diasDisponiveis / quantidadeEventos);

    let eventosCriados = 0;
    let dataEvento = new Date(hoje);

    while (eventosCriados < quantidadeEventos) {
      if (eventosCriados === quantidadeEventos - 1) {
        dataEvento.setDate(dataEvento.getDate() + intervaloDias - 1);
        if (dataEvento >= dataEventoPrincipal) {
          dataEvento.setDate(dataEventoPrincipal.getDate() - 1);
        }
      } else {
        dataEvento.setDate(dataEvento.getDate() + intervaloDias);
      }

      const novoTitulo = `${tituloEvento} - Quest Épico ${eventosCriados + 1}`;
      const horaInicioEvento = gerarHoraAleatoria();
      const horaFimEvento = gerarHoraFim(horaInicioEvento);

      const novoEvento = {
        titulo: novoTitulo,
        data: `${dataEvento.getFullYear()}-${(dataEvento.getMonth() + 1).toString().padStart(2, '0')}-${dataEvento.getDate().toString().padStart(2, '0')}`,
        hora_inicio: horaInicioEvento,
        hora_fim: horaFimEvento,
        status: false
      };

      const eventoSalvo = await salvarEvento(novoEvento);

      if (eventoSalvo) {
        let eventoAdicionado = false;
        eventosArr.forEach((item) => {
          if (item.dia === dataEvento.getDate() &&
            item.mes === dataEvento.getMonth() + 1 &&
            item.ano === dataEvento.getFullYear()) {
            item.eventos.push({ ...novoEvento, id: eventoSalvo.insertId });
            eventoAdicionado = true;
          }
        });

        if (!eventoAdicionado) {
          eventosArr.push({
            dia: dataEvento.getDate(),
            mes: dataEvento.getMonth() + 1,
            ano: dataEvento.getFullYear(),
            eventos: [{ ...novoEvento, id: eventoSalvo.insertId }],
          });
        }
      }

      eventosCriados++;
    }
    obterEventos();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  obterEventos();
  function checkEventsForToday() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = `${yyyy}-${mm}-${dd}`;

    eventosArr.forEach(evento => {
      if (evento.data === todayStr) {
        const dayElement = document.querySelector(`.day[data-date="${todayStr}"]`);
        if (dayElement) {
          const indicator = document.createElement('span');
          indicator.textContent = ' *';
          indicator.style.color = 'red';
          dayElement.appendChild(indicator);
        }
      }
    });
  }

  checkEventsForToday();
});
