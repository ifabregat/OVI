const params = new URLSearchParams(window.location.search);
const id_linea = params.get('id');

// Función para manejar errores
function analizar_error(error) {
    console.error("Error:", error);
}

// Función para analizar la respuesta del servidor
function data_recibida(data) {
    return data.json();
}

// Función para manejar la respuesta de la edición de la línea
function respuesta_recibida(data) {
    if (data.mensaje === "Linea editada exitosamente") {
        alert("Línea editada exitosamente");
        window.location.href = `/LineasAereas/LineaAerea/?id=${id_linea}`;
    } else {
        alert("Error al editar la línea");
    }
}

// Función para manejar los datos de la línea
function analizar_data(data) {
    if (data.linea) {
        document.getElementById('nombre').value = data.linea.nombre || '';
        document.getElementById('codigo').value = data.linea.codigo || '';
        document.getElementById('foto').value = data.linea.foto || '';
    } else {
        console.error("No se recibieron datos de la línea aérea");
    }
}

// Obtener datos de la línea
fetch(`http://localhost:5000/lineasaereas/${id_linea}`)
    .then(data_recibida)
    .then(analizar_data)
    .catch(analizar_error);

// Obtener datos de las flotas
function data_recibida_flotas(data) {
    console.log(data);
    const container = document.getElementById('flota');

    if (data.flotas) {
        for (let i = 0; i < data.flotas.length; i++) {
            const avion = data.flotas[i].avion;

            if (avion) {
                const li = document.createElement('li');
                li.innerText = `${avion.fabricante} ${avion.modelo}`;
                li.setAttribute("class", "espacio-entre-botones");
                li.setAttribute("id", `avion_${avion.id}`);  // Asegúrate de establecer el ID correctamente

                const borrar = document.createElement('button');
                borrar.innerText = 'Borrar';
                borrar.onclick = function () { borrar_avion(avion.id) };  // Pasa el ID del avión directamente
                borrar.setAttribute("type", "button");
                borrar.setAttribute("class", "btn btn-danger btn-sm ms-2");
                li.appendChild(borrar);

                container.appendChild(li);
            }
        }
    } else {
        console.error("No se recibieron datos de las flotas");
    }
}

fetch(`http://localhost:5000/flotas/${id_linea}`)
    .then(data_recibida)
    .then(data_recibida_flotas)
    .catch(analizar_error);

// Función para agregar un avión a la flota
function agregar_avion() {
    const id_avion = document.getElementById('modelos').value;

    if (!id_avion) {
        alert("Seleccione un avión");
        return;
    }

    const avion_id = id_avion;  // Usa solo el ID numérico del avión

    // Verifica si el elemento ya está en el DOM
    if (document.getElementById(`avion_${avion_id}`)) {
        alert("Ya se cargó ese avión");
        return;
    }

    const li = document.createElement('li');
    li.innerText = document.getElementById('modelos').options[document.getElementById('modelos').selectedIndex].text;
    li.setAttribute("id", `avion_${avion_id}`);
    li.setAttribute("class", "espacio-entre-botones");

    const borrar = document.createElement('button');
    borrar.innerText = 'Borrar';
    borrar.onclick = function () { borrar_avion(avion_id) };  // Pasa el ID del avión directamente
    borrar.setAttribute("type", "button");
    borrar.setAttribute("class", "btn btn-danger btn-sm ms-2");
    li.appendChild(borrar);

    const flota = document.getElementById('flota');
    flota.appendChild(li);

    fetch("http://localhost:5000/flotas", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            avion_id: avion_id,  // Usa solo el ID numérico del avión
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

// Función para borrar un avión de la flota
function borrar_avion(avion_id) {
    avion_id = String(avion_id);  // Asegúrate de que avion_id sea una cadena

    const element = document.getElementById(`avion_${avion_id}`);

    if (element) {
        element.remove();  // Elimina el elemento <li> del DOM
    } else {
        console.error(`No se encontró el elemento con id avion_${avion_id}`);
    }

    fetch(`http://localhost:5000/flotas/${id_linea}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            avion_id: avion_id,  // Usa solo el ID numérico del avión
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

// Función para editar la línea aérea
function editar_linea(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const nombre = formData.get('nombre');
    const codigo = formData.get('codigo');
    const foto = formData.get('foto');

    fetch(`http://localhost:5000/lineasaereas/${id_linea}`, {
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
    .catch(analizar_error);
}

// Función para manejar los datos de los aviones
function analizar_data_aviones(data) {
    const container = document.getElementById('modelos');

    if (data.aviones) {
        for (let i = 0; i < data.aviones.length; i++) {
            const avion = data.aviones[i];

            if (avion) {
                const opcion = document.createElement('option');
                opcion.setAttribute('value', avion.id);
                opcion.innerText = `${avion.fabricante} ${avion.modelo}`;
                container.appendChild(opcion);
            }
        }
    } else {
        console.error("No se recibieron datos de los aviones");
    }
}

// Obtener datos de los aviones
fetch("http://localhost:5000/aviones")
    .then(data_recibida)
    .then(analizar_data_aviones)
    .catch(analizar_error);
