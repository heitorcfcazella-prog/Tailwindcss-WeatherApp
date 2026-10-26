/*
tela de erro
favicon
*/

function codigoClima(code) {
  if (code >= 0 && code <= 1) {
    return "Céu Limpo";
  }
  if ((code >= 2 && code <= 3) || code === 45 || code === 48) {
    return "Nublado";
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) {
    return "Chovendo";
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return "Nevando";
  }
}

function personalizacaoClima(hora, clima) {
  if (clima === "Céu Limpo") {
    if (hora >= 6 && hora < 18) {
      return {
        fundo: "bg-ensolarado-erro",
        icone: "./assets/sun.svg",
        modoEscuro: false,
        limiteNuvens: 5,
        quantidadePrecipitacao: 0,
        tipoPrecipitacao: "chuva"
      };
    }
    return {
      fundo: "bg-chuva-noite",
      icone: "./assets/moon.svg",
      modoEscuro: true,
      limiteNuvens: 5,
      quantidadePrecipitacao: 0,
      tipoPrecipitacao: "chuva"
    };
  }
  if (clima === "Nublado") {
    return {
      fundo: "bg-chuva-noite",
      icone: "./assets/cloud.svg",
      modoEscuro: true,
      limiteNuvens: 12,
      quantidadePrecipitacao: 0,
      tipoPrecipitacao: "chuva"
    };
  }

  if (clima === "Chovendo") {
    return {
      fundo: "bg-chuva-noite",
      icone: "./assets/cloud.svg",
      modoEscuro: true,
      limiteNuvens: 12,
      quantidadePrecipitacao: 70,
      tipoPrecipitacao: "chuva"
    };
  }

  if (clima === "Nevando") {
    return {
      fundo: "bg-nevando",
      icone: "./assets/snowflake.svg",
      modoEscuro: false,
      limiteNuvens: 0,
      quantidadePrecipitacao: 200,
      tipoPrecipitacao: "flocos"
    };
  }
  return {
    fundo: "bg-ensolarado-erro",
    icone: "./assets/warning.svg",
    modoEscuro: false,
    limiteNuvens: 0,
    quantidadePrecipitacao: 0,
    tipoPrecipitacao: "chuva"
  };
}

async function buscarCidade() {

  const inputTexto = document.getElementById("nomeCidade");
  const iconeClima = document.getElementById("iconeClima");
  const iconeFavicon = document.getElementById("iconeFavicon");
  const containerPrincipal = document.getElementById("conteudo");
  const containerNuvens = document.getElementById('fundo-nuvens');

  try {
    const inputCidade = inputTexto.value.trim();
    const nomeCidade = inputCidade || "São Paulo";
    const cidadeFormatada = encodeURIComponent(nomeCidade);

    const respostaLatLog = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeFormatada}&count=1&language=pt`);

    if (!respostaLatLog.ok) {
      throw new Error("Erro para localizar a latitude e longitude");
    }

    const dadosLatLog = await respostaLatLog.json();

    if (!dadosLatLog.results || dadosLatLog.results.length === 0) {
      throw new Error("CIDADE_NAO_ENCONTRADA");
    }

    const latitude = dadosLatLog.results[0].latitude;
    const longitude = dadosLatLog.results[0].longitude;

    const respostaClima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&forecast_days=2&timezone=auto`);

    if (!respostaClima.ok) {
      throw new Error("Erro para extrair informações do clima");
    }

    const dadosClima = await respostaClima.json();

    const climaAgora = dadosClima.daily.weather_code[0];

    const agora = dadosClima.current.time;
    const hora = Number(agora.split("T")[1].split(":")[0]);
    //const hora = 20;

    const temperaturaAgora = Math.round(dadosClima.current.temperature_2m);
    const ventoAgora = Math.round(dadosClima.current.wind_speed_10m);
    const umidadeAgora = dadosClima.current.relative_humidity_2m;
    const pressaoAgora = Math.round(dadosClima.current.surface_pressure);

    // renderização no HTML

    // ajuste para fundo animado
    containerNuvens.querySelectorAll(".nuvem").forEach((nuvem) => {
      nuvem.remove();
    });


    const climaVisual = personalizacaoClima(hora, codigoClima(climaAgora));

    document.body.className = climaVisual.fundo;
    iconeClima.src = climaVisual.icone;
    iconeFavicon.href = climaVisual.icone;

    inputTexto.classList.toggle("modo-escuro", climaVisual.modoEscuro);

    containerNuvens.querySelectorAll(".nuvem").forEach((nuvem) => {
      nuvem.remove();
    });

    precipitacao(containerNuvens, climaVisual.quantidadePrecipitacao, climaVisual.tipoPrecipitacao);

    const limite = climaVisual.limiteNuvens;


    // geração das nuvens


    for (let i = 1; i <= limite; i++) {
      const nuvem = document.createElement("img");
      nuvem.src = "./assets/cloud.svg";
      nuvem.alt = "";
      nuvem.classList.add("nuvem");
      animarNuvens(nuvem);
      containerNuvens.appendChild(nuvem);
    }

    containerPrincipal.innerHTML = `
      <div class="clima-atual">
        <p class="texto-medio">${nomeCidade}</p>
        <h2 class="texto-grande">${temperaturaAgora}°C</h2>
        <p class="texto-medio">${codigoClima(climaAgora)}</p>
      </div>
      <div class="mini-cards-container">
        <div class="mini-cards">
          <img src="./assets/wind.svg" alt="Vento" class="img-pequena">
          <p class="texto-pequeno">${ventoAgora} km/h</p>
          <p class="texto-pequeno">Vento</p>
        </div>
        <div class="mini-cards">
          <img src="./assets/gota.svg" alt="Umidade" class="img-pequena">
          <p class="texto-pequeno">${umidadeAgora}%</p>
          <p class="texto-pequeno">Umidade</p>
        </div>
        <div class="mini-cards">
          <img src="./assets/barometer.svg" alt="Pressão" class="img-pequena">
          <p class="texto-pequeno">${pressaoAgora} hPa</p>
          <p class="texto-pequeno">Pressão</p>
        </div>
      </div>
      <div class="mini-cards-container" id="informacoes-previstas"></div>`;

    const proximasHoras = [hora + 2, hora + 4, hora + 6];

    const proximosCards = proximasHoras.map(indice => {
      indice = indice % 24;

      const temperatura = Math.round(
        dadosClima.hourly.temperature_2m[indice]
      );

      const climaPrevisto = codigoClima(dadosClima.hourly.weather_code[indice]);

      const climaVisual = personalizacaoClima(Number(dadosClima.hourly.time[indice].slice(11, 13)), climaPrevisto);

      return `
          <div class="mini-cards">
            <p>${dadosClima.hourly.time[indice].slice(11, 16)}</p>
            <img src="${climaVisual.icone}" alt="Ícone do período" class="img-pequena">
            <p>${temperatura}°C</p>
          </div>
        `;
    });

    const containerPrevisao = document.getElementById("informacoes-previstas");

    containerPrevisao.innerHTML = proximosCards.join("");

  } catch (erro) {
    console.error(erro);
    const climaVisual = personalizacaoClima();

    document.body.className = climaVisual.fundo;
    iconeClima.src = climaVisual.icone;
    iconeFavicon.href = climaVisual.icone;
    inputTexto.classList.toggle("modo-escuro", climaVisual.modoEscuro);

    containerNuvens.querySelectorAll(".nuvem, .gotas, .flocos").forEach(
      (elemento) => elemento.remove()
    );

    let mensagem;

    if (erro.message === "CIDADE_NAO_ENCONTRADA") {
      mensagem = "Cidade não encontrada. Verifique o nome e tente novamente."
    } else {
      mensagem = "Não foi possível consultar o clima. Tente novamente.";
    }

    conteudo.innerHTML = `
      <p class="texto-grande text-center">${mensagem}</p>
    `;
  }
}
document.getElementById("buscarCidade").addEventListener("click", buscarCidade);
buscarCidade();



//script para renderização das nuvens
function animarNuvens(nuvem) {
  const inicio = Math.random() * 100;
  const iniciarFora = Math.random() < 0.5;

  const posicaoInicial = iniciarFora ? -150 : inicio;

  const altura = Math.random() * 30 + 5;
  const duracao = Math.random() * 20 + 25;

  nuvem.style.top = `${altura}%`;
  nuvem.style.setProperty("--inicio",
    typeof posicaoInicial === "number" && iniciarFora
      ? `${posicaoInicial}px`
      : `${posicaoInicial}vw`
  );
  nuvem.style.setProperty("--duracao", `${duracao}s`);
}

function precipitacao(container, quantidade, tipo) {
  container.querySelectorAll(".gotas, .flocos").forEach((elemento) => elemento.remove());

  for (let i = 0; i < quantidade; i++) {
    let classe = "";
    if (tipo == "chuva") {
      classe = "gotas";
    } else {
      classe = "flocos";
    }

    const gota = document.createElement("div");
    gota.classList.add(classe);
    gota.style.left = `${Math.random() * 100}vw`;

    if (tipo == "chuva") {
      gota.style.top = `${Math.random() * 25}%`;

      const duracao = Math.random() * 0.6 + 0.5;

      gota.style.setProperty("--duracao-chuva", `${duracao}s`);

      const atraso = Math.random() * -2;

      gota.style.setProperty("--atraso-chuva", `${atraso}s`);
    } else {
      const duracao = Math.random() * 4 + 5;
      const atraso = Math.random() * -9;

      gota.style.top = `${Math.random() * 100}%`;

      gota.style.setProperty("--duracao-neve", `${duracao}s`);
      gota.style.setProperty("--atraso-neve", `${atraso}s`);
    }

    container.appendChild(gota);

  }
}