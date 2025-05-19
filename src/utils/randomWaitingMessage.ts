const waitingMessages = [
  'Segura aí, surfista! Estou conferindo as ondas mais iradas pra você agora mesmo!',
  'Já estou olhando o mar... Só um instante e te trago a previsão perfeita!',
  'Mar calmo ou ondas gigantes? Já te conto! 🌊🕵️',
  'O swell está vindo e a informação também! Só mais um segundinho...',
  'Surfando pelos dados… Já volto com a previsão fresquinha! 🏄‍♂️🌞',
  'To de olho no horizonte! Já já te mando a melhor hora pra cair na água!',
  'Consultando Netuno e os ventos... A previsão está quase aí! 🌬️🌊',
  'Pranchas prontas? A previsão está chegando em instantes! 🏄‍♀️✨',
  'Já estou analisando as marés e o swell... Prepare-se pro drop!',
  'Enquanto você respira fundo, eu busco as melhores ondas pra você! 🌊🙏',
];

export const randomWaitingMessage = () =>
  waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
