const iconeClima = document.getElementById("iconeClima");

async function latitudeLongitude(){
  try {
    const nomeCidade = document.getElementById("nomeCidade").value.toLowerCase();
    const cidadeFormatada = encodeURIComponent(nomeCidade.trim());

    const respostaLatitudeLongitude = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidadeFormatada}&count=1&language=pt`);

    if (!respostaLatitudeLongitude.ok) {
      throw new Error ("Erro para localizar a latitude e longitude");
    }

    const latitudeLongitude = await respostaLatitudeLongitude.json();
    console.log(latitudeLongitude);
    const latitude = latitudeLongitude.results[0].latitude;
    const longitude = latitudeLongitude.results[0].longitude;
    console.log(`Latitude: ${latitude} e Longitude: ${longitude}`)
  } catch (erro) {
    console.error(erro);
  }
}






























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