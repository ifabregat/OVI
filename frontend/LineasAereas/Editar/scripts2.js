const params = new URLSearchParams(window.location.search);
const id_linea = params.get('id');

function data_recibida(data) {
    return data.json();
}

function analizar_error(error) {
    console.log(error);
}

function analizar_data(data) {
    document.getElementById('nombre').value = data.linea.nombre;
    document.getElementById('codigo').value = data.linea.codigo;
    document.getElementById('foto').value = data.linea.foto;
}

fetch (`http://localhost:5000/lineasaereas/${id_linea}`)
.then(data_recibida)
.then(analizar_data)
.catch(analizar_error)

function respuesta_recibida (data) {
    if (data.mensaje === "Linea editada exitosamente") {
        alert("Linea editada exitosamente");
        window.location.href = `/LineasAereas/LineaAerea/?id=${id_linea}`;
    } else {
        alert("Error al editar la linea");
    }
}

function editar_linea(event){
    event.preventDefault();

    const formData = new FormData(event.target);

    const nombre = formData.get('nombre');
    const codigo = formData.get('codigo');
    const foto = formData.get('foto');

    fetch (`http://localhost:5000/lineasaereas/${id_linea}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            codigo: codigo,
            foto: foto
        }),
    })
    .then((res) => res.json())
    .then(respuesta_recibida)
    .catch((error) => console.log("ERROR: ", error));
}

function analizar_data_aviones(data){
    const container = document.getElementById('modelos');

    for (let i = 0; i < data.aviones.length; i++) {
        const avion = data.aviones[i];

        const opcion = document.createElement('option');
        opcion.setAttribute('value', avion.id);
        opcion.innerText = `${avion.fabricante} ${avion.modelo}`;
        container.appendChild(opcion);
    }
}

fetch ("http://localhost:5000/aviones")
.then(data_recibida)
.then(analizar_data_aviones)
.catch(analizar_error)

function agregar_avion(){
    const id_avion = document.getElementById('modelos');
    const avion_id = `avion_${id_avion.value}`;

    if (!id_avion.value) {
        alert("Seleccione un avion");
        return;
    }

    if (document.getElementById(avion_id)) {
        alert("Ya se cargo ese avion");
        return;
    }

    const li = document.createElement('li');
    li.innerText = id_avion.options[id_avion.selectedIndex].text;
    li.setAttribute("id", avion_id);
    li.setAttribute("class", "espacio-entre-botones");

    const borrar = document.createElement('button');
    borrar.innerText = 'Borrar';
    borrar.onclick = function(){ borrar_avion(avion_id) };
    borrar.setAttribute("type", "button");
    borrar.setAttribute("class", "btn btn-danger btn-sm ms-2");
    li.appendChild(borrar);

    const flota = document.getElementById('flota');
    flota.appendChild(li);

    fetch ("http://localhost:5000/flotas", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            avion_id: id_avion.value,
            linea_id: id_linea
        }),
    })
    .then(data_recibida)
    .then((data) => {
        console.log(data);
        alert(data.mensaje);
    })
    .catch(analizar_error);
}

function borrar_avion(id_avion){
    document.getElementById(id_avion).remove();
}