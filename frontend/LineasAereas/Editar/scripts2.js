const params = new URLSearchParams(window.location.search);
const id = params.get('id');

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

fetch (`http://localhost:5000/lineasaereas/${id}`)
.then(data_recibida)
.then(analizar_data)
.catch(analizar_error)

function respuesta_recibida (data) {
    if (data.mensaje === "Linea editada exitosamente") {
        alert("Linea editada exitosamente");
        window.location.href = `/LineasAereas/LineaAerea/?id=${id}`;
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

    fetch (`http://localhost:5000/lineasaereas/${id}`, {
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