console.log("Hola desde el frontend");

function respuesta_recibida (data) {
  const flota = confirm("Queres agregar una flota a la aerolinea?");

  if (flota) {
    window.location.href = `/LineasAereas/Editar/?id=${data.linea.id}`;
  }
  else {
    window.location.href = `/LineasAereas/LineaAerea/?id=${data.linea.id}`;
  }

}

function crear_aerolinea(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const nombre = formData.get("nombre");
  const codigo = formData.get("codigo");
  const foto = formData.get("foto");

  console.log("Datos enviados:", { nombre, codigo, foto });

  fetch("http://localhost:5000/lineasaereas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre,
      codigo,
      foto
    })
  })
  .then((res) => {
    console.log("Respuesta del servidor:", res);
    return res.json();
  })
  .then(respuesta_recibida)
  .catch((error) => console.error("Error:", error));
}
