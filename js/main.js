/* =====================================================================
   LÓGICA PRINCIPAL — lê o CONFIG (js/videos.js) e monta o site.
   ===================================================================== */

/* ---------- Lista do que a tela de carregamento espera ---------- */
const esperas = [];                                            // cada vídeo coloca uma "promessa" aqui

/* ---------- Loop infinito dos trechos (API oficial do YouTube) ---------- */
const jogadores = [];                                          // todos os players que precisam ficar em loop
const apiPronta = new Promise(ok => { window.onYouTubeIframeAPIReady = ok; }); // o YouTube chama isso quando a API carrega
const apiScript = document.createElement("script");            // script da API
apiScript.src = "https://www.youtube.com/iframe_api";          // endereço oficial
document.head.appendChild(apiScript);                          // começa a carregar

function loopar(alvo, id, inicio = 0, fim = 0) {               // alvo = div que vira o player
  return new Promise(pronto => apiPronta.then(() => {          // espera a API existir
    const p = new YT.Player(alvo, {                            // cria o player no lugar do div
      videoId: id,                                             // qual vídeo
      playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, rel: 0, iv_load_policy: 3, start: inicio }, // mudo, sem controles, começa no trecho
      events: { onReady: e => { e.target.mute(); e.target.playVideo(); pronto(); } } // ao abrir: toca e avisa que carregou
    });
    jogadores.push({ p, inicio, fim });                        // entra na lista de vigilância
  }));
}

/* Vigia a cada 0,3s: chegou no fim do trecho (ou o vídeo acabou)? volta pro início e toca de novo */
setInterval(() => jogadores.forEach(({ p, inicio, fim }) => {
  if (typeof p.getPlayerState !== "function") return;          // player ainda não ficou pronto
  const estado = p.getPlayerState();                           // 0 acabou, 1 tocando, 2 pausado, 5 na fila, -1 parado
  if (estado === 0 || (fim && estado === 1 && p.getCurrentTime() >= fim)) { p.seekTo(inicio, true); p.playVideo(); } // fim do trecho → recomeça
  else if (estado === 2 || estado === 5 || estado === -1) p.playVideo(); // parou por algum motivo → toca de novo
}), 300);

/* ---------- HERO: vídeo dentro do balão ---------- */
const heroEl = document.getElementById("heroVideo");           // onde o vídeo entra
const h = CONFIG.hero;                                         // configurações do topo
if (h.formato === "horizontal") document.getElementById("balao").classList.add("horizontal"); // vídeo horizontal usa caixa 16:9
if (h.mp4) heroEl.innerHTML = `<video src="${h.mp4}" autoplay muted loop playsinline></video>`; // .mp4 local (já repete sozinho)
else { const alvo = document.createElement("div"); heroEl.appendChild(alvo); esperas.push(loopar(alvo, h.id, h.inicio, h.fim)); } // YouTube em loop infinito

/* ---------- CLIENTES: carrossel infinito ---------- */
const trilho = document.getElementById("trilho");              // faixa que desliza
const grupo = document.createElement("div");                   // 1º grupo de clientes
grupo.className = "grupo";
CONFIG.clientes.forEach(c => grupo.insertAdjacentHTML("beforeend",     // um item por cliente
  `<div class="clienteItem"><img src="${c.foto}" alt="${c.nome}"><span class="nomeCliente">${c.nome}</span>` +
  `<div class="feedbackBox"><strong>${c.nome}</strong><p>${c.feedback}</p></div></div>`));
trilho.appendChild(grupo);                                     // põe o grupo na faixa
const copia = grupo.cloneNode(true);                           // cópia idêntica: o loop volta sem "pulo"
copia.setAttribute("aria-hidden", "true");                     // leitores de tela ignoram a cópia
trilho.appendChild(copia);                                     // cola a cópia ao lado
/* Movimento do carrossel (JS, não depende de animação CSS) */
let L = 0, Wc = 0, pos = 0, pausado = false, antes = performance.now(); // L = tamanho de uma volta, Wc = largura dos clientes, pos = posição
function ajustar() {
  [...trilho.children].forEach(g => g.style.width = "");       // tamanho natural para medir
  Wc = grupo.offsetWidth;                                      // largura só dos clientes configurados
  L = Wc + 64 >= innerWidth ? Wc + 64 : innerWidth + Wc + 64;  // poucos clientes: a volta inclui a tela toda (ninguém aparece repetido)
  [...trilho.children].forEach(g => g.style.width = L + "px"); // aplica nos dois grupos
}
ajustar();                                                     // mede ao abrir
pos = Wc + 64 < innerWidth ? -(innerWidth - Wc) / 2 : 0;       // poucos clientes: começam centralizados
window.addEventListener("resize", ajustar);                    // remede ao redimensionar a janela
document.fonts.ready.then(ajustar);                            // remede quando a fonte dos nomes carregar
const VEL = 90;                                                // velocidade em pixels por segundo
trilho.addEventListener("pointerenter", e => pausado = e.pointerType === "mouse"); // mouse em cima: pausa
trilho.addEventListener("pointerleave", () => pausado = false);                    // mouse saiu: volta a andar
function andar(agora) {
  const dt = Math.min((agora - antes) / 1000, 0.1);            // tempo desde o último quadro (limitado)
  antes = agora;                                               // guarda o tempo atual
  if (!pausado && L) {                         // só anda se não estiver pausado
    pos = (pos + VEL * dt) % L;                // avança e volta ao 0 ao completar um grupo (sem emenda)
    trilho.style.transform = `translate3d(${-pos}px, 0, 0)`;   // desliza para a esquerda
  }
  requestAnimationFrame(andar);                                // pede o próximo quadro
}
requestAnimationFrame(andar);                                  // começa

/* ---------- Cards de vídeo (já carregam e tocam ao abrir o site) ---------- */
const grade = document.getElementById("videoContainer");       // onde os cards entram
CONFIG.videos.forEach(v => {
  const card = document.createElement("button");               // o card é um botão
  card.className = "card " + (v.categoria === "shorts" ? "vertical" : "horizontal"); // formato por categoria
  card.dataset.categoria = v.categoria;                        // usado pelo filtro
  card.setAttribute("aria-label", "Abrir vídeo");              // acessibilidade
  card.innerHTML = `<div class="yt"></div><span class="play"></span>`; // espaço do player + ícone de play
  esperas.push(loopar(card.querySelector(".yt"), v.id, v.inicio, v.fim)); // trecho em loop infinito
  card.addEventListener("click", () => abrirVideo(v));         // clique: abre o vídeo completo
  grade.appendChild(card);                                     // adiciona na grade
});

/* ---------- Filtro de categorias ---------- */
const botoes = document.querySelectorAll("#botoes button");    // Todos/Gameplays/Shorts
const vazio = document.getElementById("vazio");                // aviso de categoria vazia
botoes.forEach(b => b.addEventListener("click", () => {
  const cat = b.dataset.categoria;                             // categoria clicada
  botoes.forEach(x => x.classList.remove("ativo"));            // desmarca todos
  b.classList.add("ativo");                                    // marca o clicado
  let visiveis = 0;                                            // contador
  grade.querySelectorAll(".card").forEach(c => {
    const mostrar = cat === "todos" || c.dataset.categoria === cat; // combina?
    c.classList.toggle("oculto", !mostrar);                    // esconde SEM descarregar o vídeo
    if (mostrar) visiveis++;                                   // soma
  });
  vazio.hidden = visiveis > 0;                                 // avisa se não há vídeos
}));

/* ---------- Modal do vídeo completo ---------- */
const modalVideo = document.getElementById("modalVideo");      // janela do vídeo
const player = document.getElementById("player");              // caixa do player
function abrirVideo(v) {
  player.className = "player " + (v.categoria === "shorts" ? "vertical" : "horizontal"); // formato
  player.innerHTML = `<iframe src="https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1" allow="autoplay; fullscreen" allowfullscreen title="vídeo"></iframe>`; // vídeo inteiro
  document.getElementById("vTag").textContent = v.categoria;   // etiqueta
  document.getElementById("vTitulo").textContent = v.titulo || ""; // título (só aqui)
  document.getElementById("vDesc").textContent = v.descricao || ""; // descrição
  abrir(modalVideo);                                           // mostra
}

/* ---------- Modal Contratar ---------- */
const modalContato = document.getElementById("modalContato");  // janela de contato
document.querySelectorAll("[data-abrir-contato]").forEach(b => b.addEventListener("click", () => abrir(modalContato)));

/* ---------- Abrir/fechar modais ---------- */
function abrir(m) { m.hidden = false; document.body.classList.add("travado"); } // mostra e trava a rolagem
function fechar() {
  [modalVideo, modalContato].forEach(m => m.hidden = true);    // esconde os dois
  player.innerHTML = "";                                       // remove o vídeo (para o som)
  document.body.classList.remove("travado");                  // libera a rolagem
}
document.querySelectorAll("[data-fechar]").forEach(b => b.addEventListener("click", fechar)); // botão X
[modalVideo, modalContato].forEach(m => m.addEventListener("click", e => { if (e.target === m) fechar(); })); // clique fora
document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); }); // ESC

/* ---------- Seções aparecem suavemente ao rolar ---------- */
const obsSecoes = new IntersectionObserver(entradas => {
  entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visivel"); obsSecoes.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".secao").forEach(s => { s.classList.add("revelar"); obsSecoes.observe(s); });

/* ---------- TELA DE CARREGAMENTO ---------- */
const tela = document.getElementById("carregando");            // overlay preto
const barra = document.getElementById("barra");                // barra de progresso
let prontos = 0;                                               // quantos já carregaram
const marcar = () => { prontos++; barra.style.width = Math.min(100, prontos / esperas.length * 100) + "%"; }; // atualiza a barra

esperas.forEach((p, i) => esperas[i] = p.then(marcar));                          // players do YouTube: pronto quando o player abre
document.querySelectorAll("#heroVideo video, .heroFundo video").forEach(v =>                        // ou o mp4 do topo
  esperas.push(new Promise(ok => v.addEventListener("loadeddata", ok, { once: true })).then(marcar)));
document.querySelectorAll(".grupo img").forEach(i =>                              // fotos dos clientes
  esperas.push(new Promise(ok => i.complete ? ok() : (i.onload = i.onerror = ok)).then(marcar)));
esperas.push(document.fonts.ready.then(marcar));                                  // fontes

Promise.race([Promise.all(esperas), new Promise(ok => setTimeout(ok, 12000))])    // espera tudo OU no máximo 12s (evita travar)
  .then(() => {
    barra.style.width = "100%";                                // completa a barra
    setTimeout(() => {                                         // pequena pausa para ver 100%
      tela.classList.add("saiu");                              // some com fade
      document.body.classList.remove("travado");              // libera a rolagem
      setTimeout(() => tela.remove(), 800);                    // remove do HTML
    }, 300);
  });
