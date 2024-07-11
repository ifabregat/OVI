function respuesta_recibida(respuesta){
    return respuesta.json();
  }

  function error_solicitud(error){
    console.log("Error: ");
    console.log(error);
  }

  function analizar_informacion(data) {
    console.log("TENGO LA LISTA");

    const container = document.getElementById("lineasaeras");

    for (let index = 0; index < data.lineasaereas.length; index++) {
      const lineaaerea = data.lineasaereas[index];

      const item = document.createElement("div");
      item.setAttribute("class", "col-6 col-md-4 col-lg-3 col-xl-2");

      const card = document.createElement("a");
      card.setAttribute("class", "card text-decoration-none");
      card.setAttribute("href", `/Aviones/Avion/?id=${lineaaerea.id}`);

      const image = document.createElement("img");
      image.setAttribute("class", "card-img-top");
      image.setAttribute("src", lineaaerea.foto);

      const card_body = document.createElement("div");
      card_body.setAttribute("class", "card-body");

      const name = document.createElement("h5");
      name.setAttribute("class", "card-title");
      name.textContent = `${lineaaerea.modelo} (${lineaaerea.fabricante})`;

      card_body.append(name);
      card.append(image);
      card.append(card_body);
      item.append(card);
      container.append(item);
    }
  }

  fetch("http://localhost:5000/lineasaereas")
    .then(respuesta_recibida)
    .then(analizar_informacion)
    .catch(error_solicitud);
  