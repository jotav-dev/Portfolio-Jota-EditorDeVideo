/* ===== Idioma PT | EN ===== */
const textos = {
  pt: {
    comissoes: "COMMISSIONS: ON", navClientes: "CLIENTES", navTrabalhos: "TRABALHOS",
    navSobre: "SOBRE MIM", navContato: "CONTATO", contratar: "CONTRATAR",
    subtitulo: "Editor de Vídeos", verProjetos: "VER PROJETOS",
    tClientes: "CLIENTES", tTrabalhos: "TRABALHOS", tSobre: "SOBRE MIM", tContato: "CONTATO",
    fTodos: "Todos", vazio: "Em breve, novos trabalhos nessa categoria.",
    sobreTexto: "Sou o Jota, editor de vídeos focado em Shorts e Gameplays. Trabalho com ritmo, transparência e prazos curtos, mostrando cada etapa do processo para você acompanhar de perto.",
    contatoTxt: "Gostou do meu trabalho e tem algo em mente? Me contrate e vamos trabalhar juntos!",
    modalTxt: "Entre em contato por uma dessas redes.", direitos: "Todos os direitos reservados."
  },
  en: {
    comissoes: "COMMISSIONS: ON", navClientes: "CLIENTS", navTrabalhos: "WORK",
    navSobre: "ABOUT ME", navContato: "CONTACT", contratar: "HIRE ME",
    subtitulo: "Video Editor", verProjetos: "VIEW PROJECTS",
    tClientes: "CLIENTS", tTrabalhos: "WORK", tSobre: "ABOUT ME", tContato: "CONTACT",
    fTodos: "All", vazio: "New work in this category coming soon.",
    sobreTexto: "I'm Jota, a video editor focused on Shorts and Gameplays. I work with rhythm, transparency and tight deadlines, showing every step of the process so you can follow along.",
    contatoTxt: "Liked my work and have something in mind? Hire me and let's work together!",
    modalTxt: "Get in touch through one of these networks.", direitos: "All rights reserved."
  }
};

const btnIdioma = document.getElementById("idioma");
function aplicarIdioma(lang) {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const t = textos[lang][el.dataset.i18n];
    if (t) el.textContent = t;
  });
  btnIdioma.textContent = lang.toUpperCase();
  try { localStorage.setItem("idioma", lang); } catch (e) {}
}
btnIdioma.addEventListener("click", () => {
  aplicarIdioma(document.documentElement.lang.startsWith("pt") ? "en" : "pt");
});
try {
  const salvo = localStorage.getItem("idioma");
  if (salvo === "en") aplicarIdioma("en");
} catch (e) {}
