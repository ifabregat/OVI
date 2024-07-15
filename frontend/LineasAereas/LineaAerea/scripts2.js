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

function eliminar_respuesta (data){
    if (!data || !data.error){
         alert("Linea eliminado");
        window.location.href = "/LineasAereas/index.html";
    }
    else{
        alert("No se pudo eliminar la aerolinea");        
    }
    }

function eliminar_aerolinea(){
    const confirmation = confirm(`Queres borrar la aerolinea ${nombre.innerText}`);

    if(!confirmation){
        return;
    }

    fetch(`http://localhost:5000/lineasaereas/${id}`, {
        method: "DELETE"
    })
    .then(respuesta_recibida)
    .then(eliminar_respuesta)
    .catch(error_solicitud);
}

function data_recibida_flotas(data) {
    const container = document.getElementById('flota');

    if (data.flotas) {
        for (let i = 0; i < data.flotas.length; i++) {
            const avion = data.flotas[i].avion;

            if (avion) {
                const li = document.createElement('li');
                li.className = 'flota-item mb-2';
                li.innerText = `${avion.fabricante} ${avion.modelo}`;
                container.appendChild(li);
            }
        }
    } else {
        console.error("No se recibieron datos de las flotas");
    }
}

fetch(`http://localhost:5000/flotas/${id}`)
.then(respuesta_recibida)
.then(data_recibida_flotas)
.catch(error_solicitud);