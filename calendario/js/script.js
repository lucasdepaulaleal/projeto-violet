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
  wrapperAdicionarEvento = document.querySelector(".add-event-wrapper "),
  btnFecharAdicionarEvento = document.querySelector(".close "),
  tituloAdicionarEvento = document.querySelector(".event-name "),
  horaInicioAdicionarEvento = document.querySelector(".event-time-from "),
  horaFimAdicionarEvento = document.querySelector(".event-time-to "),
  btnSubmeterAdicionarEvento = document.querySelector(".add-event-btn ");


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
obterEventos();
console.log(eventosArr);

//descrever
function iniciarCalendario() {
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
    //checar se evento é
    let evento = false;
    eventosArr.forEach((eventoObj) => {
      if (
        eventoObj.diaSemana === i &&
        eventoObj.mes === mes + 1 &&
        eventoObj.ano === ano
      ) {
        evento = true;
      }
    });
    if (
      i === new Date().getDate() &&
      ano === new Date().getFullYear() &&
      mes === new Date().getMonth()
    ) {
      diaAtivo = i;
      obterDiaAtivo(i);
      atualizarEventos(i);
      if (evento) {
        dias += `<div class="day today active event">${i}</div>`;
      } else {
        dias += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (evento) {
        dias += `<div class="day event">${i}</div>`;
      } else {
        dias += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= proximosDias; j++) {
    dias += `<div class="day next-date">${j}</div>`;
  }
  containerDias.innerHTML = dias;
  adicionarOuvinte();
}

//adicionar mes e ano
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

iniciarCalendario();

//adicionar
function adicionarOuvinte() {
  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    dia.addEventListener("click", (e) => {
      obterDiaAtivo(e.target.innerHTML);
      atualizarEventos(Number(e.target.innerHTML));
      diaAtivo = Number(e.target.innerHTML);
      //remove
      dias.forEach((dia) => {
        dia.classList.remove("active");
      });
      //se clicar
      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
        //
        setTimeout(() => {
          //
          const dias = document.querySelectorAll(".day");
          dias.forEach((dia) => {
            if (
              !dia.classList.contains("prev-date") &&
              dia.innerHTML === e.target.innerHTML
            ) {
              dia.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        proximoMes();
        //
        setTimeout(() => {
          const dias = document.querySelectorAll(".day");
          dias.forEach((dia) => {
            if (
              !dia.classList.contains("next-date") &&
              dia.innerHTML === e.target.innerHTML
            ) {
              dia.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

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
  console.log("aqui");
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

//
function obterDiaAtivo(data) {
  const dia = new Date(ano, mes, data);
  const diaDaSemana = dia.getDay(); // Obtendo o dia da semana como um número (0-6)
  const nomeDia = diasSemana[diaDaSemana]; // Obtendo a abreviação do dia da semana em português
  diaEvento.innerHTML = nomeDia;
  dataEvento.innerHTML = data + " " + meses[mes] + " " + ano;
}
//
function atualizarEventos(data) {
  let eventos = "";
  eventosArr.forEach((evento) => {
    if (
      data === evento.dia &&
      mes + 1 === evento.mes &&
      ano === evento.ano
    ) {
      evento.eventos.forEach((evento) => {
        eventos += `<div class="event">
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
  salvarEventos();
}

//adicionar evento
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

// mais de 50 caracter é invalido
tituloAdicionarEvento.addEventListener("input", (e) => {
  tituloAdicionarEvento.value = tituloAdicionarEvento.value.slice(0, 60);
});

// function definirPropriedade() {
//   var osccred = document.createElement("div");
//   osccred.innerHTML =
//     "Um Projeto Por <a href='  ' target=_blank></a>";
//   osccred.style.position = "absolute";
//   osccred.style.bottom = "0";
//   osccred.style.right = "0";
//   osccred.style.fontSize = "10px";
//   osccred.style.color = "#ccc";
//   osccred.style.fontFamily = "sans-serif";
//   osccred.style.padding = "5px";
//   osccred.style.background = "#fff";
//   osccred.style.borderTopLeftRadius = "5px";
//   osccred.style.borderBottomRightRadius = "5px";
//   osccred.style.boxShadow = "0 0 5px #ccc";
//   document.body.appendChild(osccred);
// }

// definirPropriedade();

//
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

//adicionar evento em eventosArr
// btnSubmeterAdicionarEvento.addEventListener("click", () => {
//   const tituloEvento = tituloAdicionarEvento.value;
//   const horaInicioEvento = horaInicioAdicionarEvento.value;
//   const horaFimEvento = horaFimAdicionarEvento.value;
//   const nivelComplexidade = document.getElementById('mySelect').value; // Adicionar a seleção do nível de complexidade

//   if (tituloEvento === "" || horaInicioEvento === "" || horaFimEvento === "") {
//     alert("Por favor, preencha todos os campos");
//     return;
//   }

//   // Verificar o formato das horas
//   const horaInicioArr = horaInicioEvento.split(":");
//   const horaFimArr = horaFimEvento.split(":");
//   if (
//     horaInicioArr.length !== 2 ||
//     horaFimArr.length !== 2 ||
//     horaInicioArr[0] > 23 ||
//     horaInicioArr[1] > 59 ||
//     horaFimArr[0] > 23 ||
//     horaFimArr[1] > 59
//   ) {
//     alert("Formato de Hora Inválido");
//     return;
//   }

//   const horaInicio = converterHora(horaInicioEvento);
//   const horaFim = converterHora(horaFimEvento);

//   // Verificar se o evento já existe
//   let eventoExiste = false;
//   eventosArr.forEach((evento) => {
//     if (
//       evento.dia === diaAtivo &&
//       evento.mes === mes + 1 &&
//       evento.ano === ano
//     ) {
//       evento.eventos.forEach((evento) => {
//         if (evento.title === tituloEvento) {
//           eventoExiste = true;
//         }
//       });
//     }
//   });
//   if (eventoExiste) {
//     alert("Evento já adicionado");
//     return;
//   }

//   const novoEvento = {
//     title: tituloEvento,
//     time: horaInicio + " - " + horaFim,
//     status: false
//   };
//   console.log(novoEvento);
//   console.log(diaAtivo);
//   let eventoAdicionado = false;
//   if (eventosArr.length > 0) {
//     eventosArr.forEach((item) => {
//       if (
//         item.dia === diaAtivo &&
//         item.mes === mes + 1 &&
//         item.ano === ano
//       ) {
//         item.eventos.push(novoEvento);
//         eventoAdicionado = true;
//       }
//     });
//   }

//   if (!eventoAdicionado) {
//     eventosArr.push({
//       dia: diaAtivo,
//       mes: mes + 1,
//       ano: ano,
//       eventos: [novoEvento],
//     });
//   }

//   // Criar eventos automáticos com base no nível de complexidade
//   criarEventosAutomaticos(nivelComplexidade, tituloEvento, diaAtivo, mes + 1, ano, eventosArr);

//   console.log(eventosArr);
//   wrapperAdicionarEvento.classList.remove("active");
//   tituloAdicionarEvento.value = "";
//   horaInicioAdicionarEvento.value = "";
//   horaFimAdicionarEvento.value = "";
//   atualizarEventos(diaAtivo);

//   const diaAtivoEl = document.querySelector(".day.active");
//   if (!diaAtivoEl.classList.contains("event")) {
//     diaAtivoEl.classList.add("event");
//   }
// });

//deletar evento ao clicar
// containerEventos.addEventListener("click", (e) => {
//   if (e.target.classList.contains("event")) {
//     if (confirm("Tem certeza de que deseja excluir este evento?")) {
//       const tituloEvento = e.target.children[0].children[1].innerHTML;
//       eventosArr.forEach((evento) => {
//         if (
//           evento.dia === diaAtivo &&
//           evento.mes === mes + 1 &&
//           evento.ano === ano
//         ) {
//           evento.eventos.forEach((item, index) => {
//             if (item.title === tituloEvento) {
//               evento.eventos.splice(index, 1);
//             }
//           });
//           //
//           if (evento.eventos.length === 0) {
//             eventosArr.splice(eventosArr.indexOf(evento), 1);
//             //
//             const diaAtivoEl = document.querySelector(".day.active");
//             if (diaAtivoEl.classList.contains("event")) {
//               diaAtivoEl.classList.remove("event");
//             }
//           }
//         }
//       });
//       atualizarEventos(diaAtivo);
//     }
//   }
// });

containerEventos.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    const tituloEvento = e.target.querySelector(".event-title").innerHTML;
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

      markCompleteBtn.addEventListener("click", () => {
        eventoSelecionado.status = true; // Alterando o status para true
        localStorage.setItem("eventos", JSON.stringify(eventosArr));
        atualizarEventos(diaAtivo);
        addEventWrapper.remove(); // Fechando a tela do evento
        
        
    });
    

      const deleteEventBtn = document.createElement("button");
      deleteEventBtn.classList.add("add-event-btn");
      deleteEventBtn.textContent = "Excluir";

      deleteEventBtn.addEventListener("click", () => {
        if (confirm("Tem certeza de que deseja excluir este evento?")) {
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
                // Atualizar eventos na interface
                atualizarEventos(diaAtivo);
                addEventWrapper.remove(); // Fechando a tela do evento
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
      const events = right
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
        addEventWrapper.remove(); // Fechando a tela do evento
      });

      // Adicionar event listener para o botão de salvar alterações
      closeBtn.addEventListener("click", () => {
        eventoSelecionado.title = titleInput.value;
        eventoSelecionado.time = timeFromInput.value + " - " + timeToInput.value;
        localStorage.setItem("eventos", JSON.stringify(eventosArr));
        atualizarEventos(diaAtivo);
        addEventWrapper.remove(); // Fechando a tela do evento
      });
    }
  }
});

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
  salvarEventos();
}









//salvar evento na local storage
function salvarEventos() {
  localStorage.setItem("eventos", JSON.stringify(eventosArr));
}

//
function obterEventos() {
  if (localStorage.getItem("eventos") === null) {
    return;
  }
  eventosArr.push(...JSON.parse(localStorage.getItem("eventos")));
}

// function converterHora(hora) {
//   let horaArr = hora.split(":");
//   let horaHora = horaArr[0];
//   let horaMin = horaArr[1];
//   let formatoHora = horaHora >= 12 ? "PM" : "AM";
//   horaHora = horaHora % 12 || 12;
//   hora = horaHora + ":" + horaMin + " " + formatoHora;
//   return hora;
// }
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


// Função para criar eventos automáticos
function criarEventosAutomaticos(nivelComplexidade, tituloEvento, diaEventoPrincipal, mesEventoPrincipal, anoEventoPrincipal, eventosArr) {
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
        // Último evento - ajusta para um dia antes do evento principal, se possível
        dataEvento.setDate(dataEvento.getDate() + intervaloDias - 1);
        if (dataEvento >= dataEventoPrincipal) {
          dataEvento.setDate(dataEventoPrincipal.getDate() - 1);
        }
      } else {
        dataEvento.setDate(dataEvento.getDate() + intervaloDias); // Adiciona o intervalo de dias
      }

      const novoTitulo = `${tituloEvento} - Quest Épico ${eventosCriados + 1}`;
      const horaInicioEvento = gerarHoraAleatoria();
      const horaFimEvento = gerarHoraFim(horaInicioEvento);

      const novoEvento = {
        title: novoTitulo,
        time: horaInicioEvento + " - " + horaFimEvento,
        status: false
      };

      let eventoAdicionado = false;
      eventosArr.forEach((item) => {
        if (item.dia === dataEvento.getDate() &&
          item.mes === dataEvento.getMonth() + 1 &&
          item.ano === dataEvento.getFullYear()) {
          item.eventos.push(novoEvento);
          eventoAdicionado = true;
        }
      });

      if (!eventoAdicionado) {
        eventosArr.push({
          dia: dataEvento.getDate(),
          mes: dataEvento.getMonth() + 1,
          ano: dataEvento.getFullYear(),
          eventos: [novoEvento],
        });
      }

      eventosCriados++;
    }

    salvarEventos();
  }
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
  const duracao = Math.floor(Math.random() * (60 - 20 + 1)) + 20;  // Duração entre 20 minutos e 1 hora
  const novaHora = new Date();
  novaHora.setHours(hora);
  novaHora.setMinutes(minutos + duracao);
  const horaFim = novaHora.getHours();
  const minutosFim = novaHora.getMinutes();
  const horaFimStr = horaFim < 10 ? `0${horaFim}` : `${horaFim}`;
  const minutosFimStr = minutosFim < 10 ? `0${minutosFim}` : `${minutosFim}`;
  return `${horaFimStr}:${minutosFimStr}`;
}

// Adicionar evento em eventosArr
btnSubmeterAdicionarEvento.addEventListener("click", () => {
  const tituloEvento = tituloAdicionarEvento.value;
  const horaInicioEvento = horaInicioAdicionarEvento.value;
  const horaFimEvento = horaFimAdicionarEvento.value;
  const nivelComplexidade = document.getElementById('mySelect').value; // Adicionar a seleção do nível de complexidade

  if (tituloEvento === "" || horaInicioEvento === "" || horaFimEvento === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }

  // Verificar o formato das horas
  const horaInicioArr = horaInicioEvento.split(":");
  const horaFimArr = horaFimEvento.split(":");
  if (
    horaInicioArr.length !== 2 ||
    horaFimArr.length !== 2 ||
    horaInicioArr[0] > 23 ||
    horaInicioArr[1] > 59 ||
    horaFimArr[0] > 23 ||
    horaFimArr[1] > 59
  ) {
    alert("Formato de Hora Inválido");
    return;
  }

  const horaInicio = converterHora(horaInicioEvento);
  const horaFim = converterHora(horaFimEvento);

  // Verificar se o evento já existe
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
    title: tituloEvento,
    time: horaInicio + " - " + horaFim,
    status: false
  };
  console.log(novoEvento);
  console.log(diaAtivo);
  let eventoAdicionado = false;
  if (eventosArr.length > 0) {
    eventosArr.forEach((item) => {
      if (
        item.dia === diaAtivo &&
        item.mes === mes + 1 &&
        item.ano === ano
      ) {
        item.eventos.push(novoEvento);
        eventoAdicionado = true;
      }
    });
  }

  if (!eventoAdicionado) {
    eventosArr.push({
      dia: diaAtivo,
      mes: mes + 1,
      ano: ano,
      eventos: [novoEvento],
    });
  }

  // Criar eventos automáticos com base no nível de complexidade
  criarEventosAutomaticos(nivelComplexidade, tituloEvento, diaAtivo, mes + 1, ano, eventosArr);

  console.log(eventosArr);
  wrapperAdicionarEvento.classList.remove("active");
  tituloAdicionarEvento.value = "";
  horaInicioAdicionarEvento.value = "";
  horaFimAdicionarEvento.value = "";
  atualizarEventos(diaAtivo);

  const diaAtivoEl = document.querySelector(".day.active");
  if (!diaAtivoEl.classList.contains("event")) {
    diaAtivoEl.classList.add("event");
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Função para verificar se há eventos registrados no localStorage para o dia atual
  function checkEventsForToday() {
      // Obter a data atual
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + '-' + mm + '-' + dd;

      // Verificar se há eventos registrados para o dia atual no localStorage
      var events = JSON.parse(localStorage.getItem('events')) || {};
      if (events[today]) {
          // Se houver eventos, encontrar o elemento HTML correspondente e adicionar um indicador
          var dayElement = document.querySelector('.day[data-date="' + today + '"]');
          if (dayElement) {
              var indicator = document.createElement('span');
              indicator.textContent = ' *';
              indicator.style.color = 'red'; // Estilize como preferir
              dayElement.appendChild(indicator);
          }
      }
  }

  // Chamar a função para verificar eventos ao carregar a página
  checkEventsForToday();
});

