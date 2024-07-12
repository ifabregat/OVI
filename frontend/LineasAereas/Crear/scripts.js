function respuesta_recibida(data) {
  if (data.success) {
    alert("Aerolinea creada correctamente");
    window.location.href = `/LineasAereas/LineaAerea/?id=${data.id}`;
  }
  else {
    alert("Error al crear la aerolinea");
  }
}

function crear_aerolinea(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const nombre = formData.get("nombre");
  const codigo = formData.get("codigo");
  const foto = formData.get("foto");

  fetch("http://localhost:5000/lineasaereas",{
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
  .then((res) => res.json())
  .then(respuesta_recibida)
  .catch((error) => console.error("Error:", error))  
}

