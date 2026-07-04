const botoes = document.querySelectorAll(".botoes button");
const videos = document.querySelectorAll(".videoContainer iframe");

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    const categoria = botao.getAttribute("data-categoria"); // pega o atributo

    videos.forEach(video => {
      const videoCategoria = video.getAttribute("data-categoria");

      if (categoria === "todos" || videoCategoria === categoria) {
        video.style.display = "block"; // mostra
      } else {
        video.style.display = "none";  // esconde
      }
    });
  });
});
