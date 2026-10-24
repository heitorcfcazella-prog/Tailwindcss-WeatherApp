/*
atualizar para as informações atuais
criar função para os icones
tela de erro
*/

const iconeClima = document.getElementById("iconeClima");

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

async function buscarCidade() {
  try {
    const inputCidade = document.getElementById("nomeCidade").value.trim();

    const nomeCidade = inputCidade || "São Paulo";
    const cidadeFormatada = encodeURIComponent(nomeCidade);

    const respostaLatLog = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeFormatada}&count=1&language=pt`);

    if (!respostaLatLog.ok) {
      throw new Error("Erro para localizar a latitude e longitude");
    }

    const dadosLatLog = await respostaLatLog.json();
    console.log(dadosLatLog);

    const latitude = dadosLatLog.results[0].latitude;
    const longitude = dadosLatLog.results[0].longitude;

    console.log(`Latitude: ${latitude} e Longitude: ${longitude}`);

    const respostaClima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&forecast_days=2&timezone=auto`);

    if (!respostaClima.ok) {
      throw new Error("Erro para extrair informações do clima");
    }

    const dadosClima = await respostaClima.json();
    console.log(dadosClima);

    const climaAgora = dadosClima.daily.weather_code[0];

    const agora = dadosClima.current.time;
    const hora = Number(agora.split("T")[1].split(":")[0]);
    //const hora = 20;

    const temperaturaAgora = Math.round(dadosClima.current.temperature_2m);
    const ventoAgora = Math.round(dadosClima.current.wind_speed_10m);
    const umidadeAgora = dadosClima.current.relative_humidity_2m;
    const pressaoAgora = Math.round(dadosClima.current.surface_pressure);

    // renderização no HTML
    const inputTexto = document.getElementById("nomeCidade");

    // ajuste para fundo animado
    const containerNuvens = document.getElementById('fundo-nuvens');
    containerNuvens.querySelectorAll(".nuvem").forEach((nuvem) => {
      nuvem.remove();
    });
    
    let limite = 0;

    if ((hora >= 6 && hora <= 18) && (codigoClima(climaAgora) == "Céu Limpo")) {
      document.body.className = "bg-ensolarado-erro";
      inputTexto.classList.remove('modo-escuro');
      iconeClima.src = './assets/sun.svg';
      limite = 5;
      precipitacao(containerNuvens, 0, "chuva");
    } else if((hora <= 6 || hora >= 18) && (codigoClima(climaAgora) == "Céu Limpo"))  {
      document.body.className = "bg-chuva-noite";
      inputTexto.classList.add('modo-escuro');
      iconeClima.src = './assets/moon.svg';
      limite = 5;
      precipitacao(containerNuvens, 0, "chuva");
    } else if (codigoClima(climaAgora) == "Nublado") {
      document.body.className = "bg-chuva-noite";
      inputTexto.classList.add('modo-escuro');
      iconeClima.src = './assets/cloud.svg';
      limite = 12;
      precipitacao(containerNuvens, 0, "chuva");
    } else if (codigoClima(climaAgora) == "Chovendo") {
      document.body.className = "bg-chuva-noite";
      inputTexto.classList.add('modo-escuro');
      iconeClima.src = './assets/cloud.svg';
      limite = 12;
      precipitacao(containerNuvens, 70, "chuva");
    } else if (codigoClima(climaAgora) == "Nevando") {
      document.body.className = "bg-nevando";
      inputTexto.classList.remove('modo-escuro');
      iconeClima.src = './assets/snowflake.svg';
      limite = 0;
      precipitacao(containerNuvens, 200, "flocos");
    }

    // geração das nuvens
    

    for (let i = 1; i <= limite; i++) {
      const nuvem = document.createElement("img");
      nuvem.src = "./assets/cloud.svg";
      nuvem.alt = "";
      nuvem.classList.add("nuvem");
      animarNuvens(nuvem);
      containerNuvens.appendChild(nuvem);
    }

    const containerPrincipal = document.getElementById("conteudo");

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

      let iconeClima;

      if (indice >= 6 && indice <= 18) {
        iconeClima = "./assets/sun.svg";
      } else {
        iconeClima = "./assets/moon.svg";
      }

      return `
          <div class="mini-cards">
            <p>${indice}:00</p>
            <img src="${iconeClima}" alt="Ícone do período" class="img-pequena">
            <p>${temperatura}°C</p>
          </div>
        `;
    });

    const containerPrevisao = document.getElementById("informacoes-previstas");

    containerPrevisao.innerHTML = proximosCards.join("");

  } catch (erro) {
    console.error(erro);
    return null;
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

function precipitacao(container, quantidade, tipo){
  container.querySelectorAll(".gotas").forEach(gota => gota.remove());

  for (let i = 0; i < quantidade; i++) {
    let classe = "";
    if (tipo == "chuva"){
      classe = "gotas";
    } else {
      classe = "flocos";
    }

    const gota = document.createElement("div");
    gota.classList.add(classe);
    gota.style.left = `${Math.random() * 100}vw`;

    if(tipo == "chuva"){
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