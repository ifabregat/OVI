const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id === null) {
    window.location.href = "/LineasAereas/index.html";
}

document.getElementById("btnEditar").setAttribute("href",`/LineasAereas/Editar/?id=${id}`)

function respuesta_recibida(respuesta) {
    return respuesta.json();
}

function analizar_data(data) {
    const linea = data.linea
    console.log(linea); 

    const nombre = document.getElementById("nombre");
    nombre.innerText = `${linea.nombre}`;

    const codigo = document.getElementById("codigo");
    codigo.innerText = `Codigo IATA: ${linea.codigo}`;

    const foto = document.getElementById("foto");
    foto.setAttribute("src", linea.foto);
}

function error_solicitud(error) {
    console.log(`Error: ${error}`);
}

fetch(`http://localhost:5000/lineasaereas/${id}`)
    .then(respuesta_recibida)
    .then(analizar_data)
    .catch(error_solicitud);