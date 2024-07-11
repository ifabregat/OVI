const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id === null) {
    window.location.href = "/Aviones/index.html";
}

function respuesta_recibida(respuesta) {
    return respuesta.json();
}

function analizar_data(data) {
const avion = data.avion;

const fabricanteElement = document.getElementById("fabricante");
fabricanteElement.innerText = `Fabricante: ${avion.fabricante}`;

const modeloElement = document.getElementById("modelo");
modelo.setAttribute("class", "text-decoration-underline")
modeloElement.innerText = avion.modelo;

const foto = document.getElementById("foto");
foto.setAttribute("src", avion.foto);
foto.setAttribute("class", "img-fluid")

const aniofabricacion = document.getElementById("aniofabricacion");
aniofabricacion.innerText = avion.aniofabricacion? `Año de fabricacion: ${avion.aniofabricacion}` : 'Año de fabricacion: desconocido';

const paisfabricacion = document.getElementById("paisfabricacion");
paisfabricacion.innerText = avion.paisfabricacion? `Pais de fabricacion: ${avion.paisfabricacion}` : 'Pais de fabricacion: desconocido';

const propulsion = document.getElementById("propulsion");
propulsion.innerText = avion.propulsion? `Tipo de propulsion: ${avion.propulsion}` : 'Tipo de propulsion: desconocido';
}

function error_solicitud(error) {
    console.log(`Error: ${error}`);
}

function eliminar_respuesta (data){
    if (!data || !data.error){
        alert("Avion eliminado");
        window.location.href = "/Aviones/index.html";
    }
    else{
        alert("No se pudo eliminar el avion");
    }
}

fetch(`http://localhost:5000/aviones/${id}`)
   .then(respuesta_recibida)
   .then(analizar_data)
   .catch(error_solicitud);

function eliminar_avion(){
    const confirmation = confirm(`Queres borrar el ${modelo.innerText}`);

    if(!confirmation){
        return;
    }

    fetch(`http://localhost:5000/aviones/${id}`, {
        method: "DELETE"
    })
    .then(respuesta_recibida)
    .then(eliminar_respuesta)
    .catch(error_solicitud);
}