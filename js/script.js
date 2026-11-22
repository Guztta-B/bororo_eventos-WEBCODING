
const CHAVE_EVENTOS = "bororo_eventos";
const CHAVE_ORGANIZADORES = "bororo_organizadores";

function obterEventos() {
  return JSON.parse(localStorage.getItem(CHAVE_EVENTOS) || "[]");
}
function salvarEventos(eventos) {
  localStorage.setItem(CHAVE_EVENTOS, JSON.stringify(eventos));
}
function formatarData(data) {
  if (!data) return "Data a definir";
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
function criarCard(evento) {
  return `<article class="evento-card">
    <div class="evento-topo"><span class="data">${formatarData(evento.data)}</span><h3>${evento.titulo}</h3></div>
    <div class="evento-info"><p class="local">⌖ ${evento.local}</p><p>${evento.descricao}</p><p>Organização: ${evento.responsavel}</p></div>
  </article>`;
}
function mostrarEventos(id, limite) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  const eventos = obterEventos().sort((a,b) => a.data.localeCompare(b.data));
  const lista = limite ? eventos.slice(0, limite) : eventos;
  elemento.innerHTML = lista.length ? lista.map(criarCard).join("") : "";
  const vazio = document.getElementById("vazio");
  if (vazio) vazio.hidden = eventos.length !== 0;
}
mostrarEventos("lista-eventos");
mostrarEventos("destaques", 3);

const formOrganizador = document.getElementById("form-organizador");
if (formOrganizador) {
  formOrganizador.addEventListener("submit", function(event) {
    event.preventDefault();
    const dados = new FormData(formOrganizador);
    const senha = dados.get("senha");
    if (senha !== dados.get("confirmar")) {
      document.getElementById("mensagem-organizador").textContent = "As senhas não são iguais.";
      return;
    }
    const organizadores = JSON.parse(localStorage.getItem(CHAVE_ORGANIZADORES) || "[]");
    const email = dados.get("email").toLowerCase();
    if (organizadores.some(o => o.email === email)) {
      document.getElementById("mensagem-organizador").textContent = "Este e-mail já foi cadastrado.";
      return;
    }
    organizadores.push({nome:dados.get("nome"),email,telefone:dados.get("telefone"),organizacao:dados.get("organizacao")});
    localStorage.setItem(CHAVE_ORGANIZADORES, JSON.stringify(organizadores));
    document.getElementById("mensagem-organizador").textContent = "Cadastro demonstrativo realizado! Agora você pode preencher seu evento.";
    formOrganizador.reset();
  });
}
const formEvento = document.getElementById("form-evento");
if (formEvento) {
  formEvento.addEventListener("submit", function(event) {
    event.preventDefault();
    const dados = new FormData(formEvento);
    const eventos = obterEventos();
    eventos.push({titulo:dados.get("titulo"),data:dados.get("data"),local:dados.get("local"),descricao:dados.get("descricao"),responsavel:dados.get("responsavel")});
    salvarEventos(eventos);
    document.getElementById("mensagem-evento").textContent = "Evento publicado neste navegador! Confira na página Eventos.";
    formEvento.reset();
  });
}
