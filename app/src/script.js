/*
extrair as informações da API
Popular os cards com as informações

if (hora >= 6 && hora <= 18){
  document.body.className = "bg-ensolarado-erro";
  iconeClima.src = './assets/sun.svg';
} else {
  document.body.className = "bg-chuva-noite dark";
  iconeClima.src = './assets/moon.svg';
}
 */

const iconeClima = document.getElementById("iconeClima");

function codigoClima(code) {
  if (code >= 0 && code <= 1) return clima = "Céu Limpo";
  if (code >= 2 && code <= 3) return clima = "Nublado";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return clima = "Chovendo";
  if (code >= 71 && code <= 77) return clima = "Nevando";
}

async function buscarCidade() {
  try {
    const nomeCidade = document.getElementById("nomeCidade").value.toLowerCase();
    const cidadeFormatada = encodeURIComponent(nomeCidade.trim());

    const respostaLatLog = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeFormatada}&count=1&language=pt`);

    if (!respostaLatLog.ok) {
      throw new Error("Erro para localizar a latitude e longitude");
    }

    const dadosLatLog = await respostaLatLog.json();
    console.log(dadosLatLog);

    const latitude = dadosLatLog.results[0].latitude;
    const longitude = dadosLatLog.results[0].longitude;

    console.log(`Latitude: ${latitude} e Longitude: ${longitude}`);

    const respostaClima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&forecast_days=1`);

    if (!respostaClima.ok) {
      throw new Error("Erro para extrair informações do clima");
    }

    const dadosClima = await respostaClima.json();
    console.log(dadosClima);

    const climaAgora = dadosClima.daily.weather_code[0];
    console.log(codigoClima(climaAgora));

    const agora = new Date();
    const hora = agora.getHours();
    console.log(hora);

    const temperaturaAgora = Math.round(dadosClima.hourly.temperature_2m[hora]);
    console.log(temperaturaAgora);
    const ventoAgora = Math.round(dadosClima.hourly.wind_speed_10m[hora]);
    console.log(ventoAgora);
    const umidadeAgora = dadosClima.hourly.relative_humidity_2m[hora];
    console.log(umidadeAgora);
    const pressaoAgora = Math.round(dadosClima.hourly.surface_pressure[hora]);
    console.log(pressaoAgora);

    if (hora >= 6 && hora <= 18){
      document.body.className = "bg-ensolarado-erro";
      iconeClima.src = './assets/sun.svg';
    } else {
      document.body.className = "bg-chuva-noite";
      iconeClima.src = './assets/moon.svg';
    }

  } catch (erro) {
    console.error(erro);
    return null;
  }
}
document.getElementById("buscarCidade").addEventListener("click", buscarCidade);






























//script para renderização das nuvens
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