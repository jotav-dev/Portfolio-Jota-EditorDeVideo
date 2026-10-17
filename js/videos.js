/* =====================================================================
   ARQUIVO DE CONFIGURAÇÃO — é o ÚNICO que você precisa editar para
   trocar vídeos, trechos e o vídeo do topo do site.
   ===================================================================== */

const CONFIG = {                                  // objeto com tudo do site

  /* ---------- Vídeo que roda de fundo no topo (aba inicial) ---------- */
  hero: {
    mp4: "",                                      // caminho de um .mp4 local (ex: "assets/topo.mp4"). Se preencher, ele vence o YouTube
    formato: "vertical",                          // formato do vídeo do topo: "vertical" (short) ou "horizontal"
    id: "o4ACw7COgx0",                            // ID do vídeo do YouTube (o código depois de /embed/ ou ?v=)
    inicio: 3,                                    // segundo em que o trecho do topo começa
    fim: 15                                       // segundo em que o trecho termina (depois volta pro início)
  },


  /* ---------- Clientes do carrossel (foto + nome + feedback no hover) ---------- */
  clientes: [
    {
      nome: "Kvothe",                                      // nome que aparece embaixo da foto
      foto: "img/fotosPerfil/KvotheDiscord.jpg",           // caminho da foto
      feedback: "Extremamente rápido e competente, sempre com muita transparência e mostrando o trabalho, gostei bastante!" // balão ao passar o mouse
    },
    {
      nome: "Alencar",                                     // segundo cliente
      foto: "img/fotosPerfil/AlencarDiscord.jpg",
      feedback: "Ficou muito bom, agora é esperar o YT recomendar."
    }
  ],

  /* ---------- Seus vídeos (os mesmos links de antes) ---------- */
  videos: [
    {
      id: "aopzr8qWNIM",                          // ID do vídeo (do link: youtube.com/embed/ID)
      categoria: "shorts",                        // "shorts" (vertical) ou "gameplays" (horizontal)
      inicio: 3, fim: 10,                         // MELHOR MOMENTO: trecho que roda em loop no card (em segundos)
      titulo: "Demon Fall Shorts",                          // título que aparece só no painel ao clicar (pode deixar "")
      descricao: "Edição estilo vertical"      // texto do painel ao clicar
    },
    {
      id: "q1ufbL5SexI",                          // segundo vídeo
      categoria: "shorts",
      inicio: 3, fim: 10,
      titulo: "Demon Fall Shorts",
      descricao: "Edição estilo vertical"
    },
    {
      id: "o4ACw7COgx0",                          // terceiro vídeo
      categoria: "shorts",
      inicio: 3, fim: 10,
      titulo: "Blox Fruits Shorts",
      descricao: "Edição estilo vertical"
    },
    {
      id: "MaRvpN6MFOU",                          // quarto vídeo
      categoria: "shorts",
      inicio: 3, fim: 10,
      titulo: "Curta Metragem - Procrastinação",
      descricao: "Edição estilo vertical"
    },
    {
      id: "vbNUawt3pJc",                          // quinto vídeo
      categoria: "shorts",
      inicio: 3, fim: 10,
      titulo: "Publicidade Mania Shop",
      descricao: "Edição estilo vertical"
    }
  ]
};
