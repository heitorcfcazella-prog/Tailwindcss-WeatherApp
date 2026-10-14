/*
https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&daily=weather_code&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&forecast_days=1

extrair as informações da API
Popular os cards com as informações

function codigoClima(code){
	if (code >= 0 && <= 1) return clima = "Ensolarado";
	if (code >= 2 && <= 3) return clima = "Nublado";
	if ((code >= 51 && code <= 67) && (code >= 80 && code <= 82)) return clima = "Chovendo";
	if (code >= 71 && code <= 77) return clima = "Nevando";
}

if (hora >= 6 && hora <= 18){
	document.body.className = "bg-ensolarado-erro";
	iconeClima.src = './assets/sun.svg';
} else {
	document.body.className = "bg-chuva-noite dark";
	iconeClima.src = './assets/moon.svg';
}
 */

const iconeClima = document.getElementById("iconeClima");

  async function buscarCidade() {
    try {
      const nomeCidade = document.getElementById("nomeCidade").value.toLowerCase();
      const cidadeFormatada = encodeURIComponent(nomeCidade.trim());

      const resposta = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeFormatada}&count=1&language=pt`);

      if (!resposta.ok) {
        throw new Error("Erro para localizar a latitude e longitude");
      }

      const dados = await resposta.json();
      console.log(dados);
      const latitude = dados.results[0].latitude;
      const longitude = dados.results[0].longitude;

      console.log(`Latitude: ${latitude} e Longitude: ${longitude}`);
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