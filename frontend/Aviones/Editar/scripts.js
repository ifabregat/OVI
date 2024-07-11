const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id === null) {
    window.location.href = "/Aviones/index.html";
}

function analizar_respuesta(data){
    document.getElementById("fabricante").value = data.avion.fabricante;
    document.getElementById("modelo").value = data.avion.modelo;
    const datopropulsion = data.avion.propulsion;
    document.getElementById(`propulsion-${datopropulsion}`).checked = true;
    document.getElementById("aniofabricacion").value = data.avion.aniofabricacion;
    document.getElementById("paisfabricacion").value = data.avion.paisfabricacion;
    document.getElementById("foto").value = data.avion.foto;
}

fetch(`http://localhost:5000/aviones/${id}`)
.then((res) => res.json())
.then(analizar_respuesta)
.catch((error) => console.log("ERROR: ", error));

function respuesta_recibida (data) {
    if (data.mensaje === "Avión agregado exitosamente") {
        alert("Avión agregado exitosamente");
        window.location.href = `/Aviones/Avion/?id=${data.avion.id}`;
    } else {
        alert("Error al agregar el avión");
    }
}

function editar_avion (event){
    event.preventDefault();

    const formData = new FormData(event.target);

    const fabricante = formData.get("fabricante");
    const modelo = formData.get("modelo");
    const propulsion = formData.get("propulsion");
    const aniofabricacion = formData.get("aniofabricacion");
    const foto = formData.get("foto");
    const paisfabricacion = formData.get("paisfabricacion");

    fetch("http://localhost:5000/aviones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fabricante: fabricante,
            modelo: modelo,
            propulsion: propulsion,
            aniofabricacion: aniofabricacion,
            paisfabricacion: paisfabricacion,
            foto: foto
        })
    })
    .then((res) => res.json())
    .then(respuesta_recibida)
    .catch((error) => console.log("ERROR: ", error));
}