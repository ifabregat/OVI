function respuesta_recibida (data) {
    if (data.mensaje === "Avión agregado exitosamente") {
        alert("Avión agregado exitosamente");
        window.location.href = `/Aviones/Avion/?id=${data.avion.id}`;
    } else {
        alert("Error al agregar el avión");
    }
}

function crear_avion (event){
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