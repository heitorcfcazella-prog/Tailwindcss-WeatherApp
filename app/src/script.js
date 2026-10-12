const nuvens = document.querySelectorAll(".nuvem");

nuvens.forEach((nuvem) => {
  const inicio = Math.random() * 100;
  const iniciarFora = Math.random() < 0.5;

  const posicaoInicial = iniciarFora ? -150 : inicio;

  const altura = Math.random() * 70 + 5;
  const duracao = Math.random() * 20 + 25;

  nuvem.style.top = `${altura}%`;
  nuvem.style.setProperty("--inicio", 
    typeof posicaoInicial === "number" && iniciarFora
    ? `${posicaoInicial}px`
    : `${posicaoInicial}vw`
  );
  nuvem.style.setProperty("--duracao", `${duracao}s`);
});