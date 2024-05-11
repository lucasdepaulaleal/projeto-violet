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

const eventos = [];
obterEventos();
console.log(eventos);

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
    let evento = false;
    eventos.forEach((eventoObj) => {
      if (
        eventoObj.dia === i &&
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

function adicionarOuvinte() {
  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    dia.addEventListener("click", (e) => {
      obterDiaAtivo(e.target.innerHTML);
      atualizarEventos(Number(e.target.innerHTML));
      diaAtivo = Number(e.target.innerHTML);
      dias.forEach((dia) => {
        dia.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
        setTimeout(() => {
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

function obterDiaAtivo(data) {
  const dia = new Date(ano, mes, data);
  const diaDaSemana = dia.getDay(); // Obtendo o dia da semana como um número (0-6)
  const nomeDia = diasSemana[diaDaSemana]; // Obtendo a abreviação do dia da semana em português
  diaEvento.innerHTML = nomeDia;
  dataEvento.innerHTML = data + " " + meses[mes] + " " + ano;
}


function atualizarEventos(data) {
  let eventosHtml = "";
  eventos.forEach((evento) => {
    if (
      data === evento.dia &&
      mes + 1 === evento.mes &&
      ano === evento.ano
    ) {
      evento.eventos.forEach((evento) => {
        eventosHtml += `<div class="event">
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
  if (eventosHtml === "") {
    eventosHtml = `<div class="no-event">
            <h3>Sem Eventos</h3>
        </div>`;
  }
  containerEventos.innerHTML = eventosHtml;
  salvarEventos();
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

definirPropriedade();

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

btnSubmeterAdicionarEvento.addEventListener("click", () => {
  const tituloEvento = tituloAdicionarEvento.value;
  const horaInicioEvento = horaInicioAdicionarEvento.value;
  const horaFimEvento = horaFimAdicionarEvento.value;
  if (tituloEvento === "" || horaInicioEvento === "" || horaFimEvento === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }

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

  let eventoExiste = false;
  eventos.forEach((evento) => {
    if (
      evento.dia === diaAtivo &&
      evento.mes === mes + 1 &&
      evento.ano === ano
    ) {
      evento.eventos.forEach((item) => {
        if (item.title === tituloEvento) {
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
  };
  console.log(novoEvento);
  console.log(diaAtivo);
  let eventoAdicionado = false;
  if (eventos.length > 0) {
    eventos.forEach((item) => {
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
    eventos.push({
      dia: diaAtivo,
      mes: mes + 1,
      ano: ano,
      eventos: [novoEvento],
    });
  }

  console.log(eventos);
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

containerEventos.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Tem certeza de que deseja excluir este evento?")) {
      const tituloEvento = e.target.children[0].children[1].innerHTML;
      eventos.forEach((evento) => {
        if (
          evento.dia === diaAtivo &&
          evento.mes === mes + 1 &&
          evento.ano === ano
        ) {
          evento.eventos.forEach((item, index) => {
            if (item.title === tituloEvento) {
              evento.eventos.splice(index, 1);
            }
          });
          if (evento.eventos.length === 0) {
            eventos.splice(eventos.indexOf(evento), 1);
            const diaAtivoEl = document.querySelector(".day.active");
            if (diaAtivoEl.classList.contains("event")) {
              diaAtivoEl.classList.remove("event");
            }
          }
        }
      });
      atualizarEventos(diaAtivo);
    }
  }
});

function salvarEventos() {
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

function obterEventos() {
  if (localStorage.getItem("eventos") === null) {
    return;
  }
  eventos.push(...JSON.parse(localStorage.getItem("eventos")));
}

function converterHora(hora) {
  let horaArr = hora.split(":");
  let horaHora = horaArr[0];
  let horaMin = horaArr[1];
  let formatoHora = horaHora >= 12 ? "PM" : "AM";
  horaHora = horaHora % 12 || 12;
  hora = horaHora + ":" + horaMin + " " + formatoHora;
  return hora;
}
