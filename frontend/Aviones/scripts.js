    // Función para manejar la respuesta JSON
    function respuesta_recibida(respuesta) {
        return respuesta.json();
      }
  
      // Función para manejar errores en la solicitud
      function error_solicitud(error) {
        console.log("Error: ", error);
      }
  
      // Función para procesar la información recibida y actualizar el DOM
      function analizar_informacion(data) {
        const container = document.getElementById("aviones");
  
        // Limpiar el contenedor antes de agregar nuevos elementos
        container.innerHTML = '';
  
        // Verificar si se recibieron aviones
        if (data.aviones.length === 0) {
          container.innerHTML = '<p>No se encontraron aviones.</p>';
          return;
        }
  
        for (let index = 0; index < data.aviones.length; index++) {
          const avion = data.aviones[index];
  
          const item = document.createElement("div");
          item.setAttribute("class", "col-6 col-md-4 col-lg-3 col-xl-2");
  
          const card = document.createElement("a");
          card.setAttribute("class", "card text-decoration-none");
          card.setAttribute("href", `/Aviones/Avion/?id=${avion.id}`);
  
          const image = document.createElement("img");
          image.setAttribute("class", "card-img-top");
          image.setAttribute("src", avion.foto);
          image.setAttribute("alt", `${avion.modelo} (${avion.fabricante})`);  // Añadir un atributo alt para accesibilidad
  
          const card_body = document.createElement("div");
          card_body.setAttribute("class", "card-body");
  
          const name = document.createElement("h5");
          name.setAttribute("class", "card-title");
          name.textContent = `${avion.modelo} (${avion.fabricante})`;
  
          card_body.append(name);
          card.append(image);
          card.append(card_body);
          item.append(card);
          container.append(item);
        }
      }
  
      // Función para cargar aviones según los filtros
      function cargar_aviones(fabricante, propulsion, paisfabricacion, aniofabricacion) {
        let url = 'http://localhost:5000/aviones';
  
        // Añadir filtros a la URL
        if (fabricante || propulsion || paisfabricacion || aniofabricacion) {
          url += '?';
          if (fabricante) {
            url += `fabricante=${fabricante}&`;
          }
          if (propulsion) {
            url += `propulsion=${propulsion}&`;
          }
          if (paisfabricacion) {
            url += `paisfabricacion=${paisfabricacion}&`;
          }
          if (aniofabricacion) {
            url += `aniofabricacion=${aniofabricacion}&`;
          }
          // Eliminar el último "&" si existe
          url = url.slice(0, -1);
        }
  
        fetch(url)
          .then(respuesta_recibida)
          .then(analizar_informacion)
          .catch(error_solicitud);
      }
  
      // Obtener los parámetros de URL para inicializar los filtros
      const urlParams = new URLSearchParams(window.location.search);
      const fabricante = urlParams.get("fabricante");
      const propulsion = urlParams.get("propulsion");
      const paisfabricacion = urlParams.get("paisfabricacion");
      const aniofabricacion = urlParams.get("aniofabricacion");
  
      // Inicializar filtros en el formulario
      if (fabricante) document.getElementById('fabricante').value = fabricante;
      if (propulsion) document.getElementById('propulsion').value = propulsion;
      if (paisfabricacion) document.getElementById('paisfabricacion').value = paisfabricacion;
      if (aniofabricacion) document.getElementById('aniofabricacion').value = aniofabricacion;
  
      // Cargar aviones al cargar la página
      cargar_aviones(fabricante, propulsion, paisfabricacion, aniofabricacion);
  
      // Manejar el evento de envío del formulario
      document.getElementById('filtroForm').addEventListener('submit', function(event) {
        event.preventDefault();
  
        const fabricante = document.getElementById('fabricante').value;
        const propulsion = document.getElementById('propulsion').value;
        const paisfabricacion = document.getElementById('paisfabricacion').value;
        const aniofabricacion = document.getElementById('aniofabricacion').value;
  
        // Construir URL con filtros aplicados
        let url = 'http://localhost:5000/aviones?';
        if (fabricante) url += `fabricante=${fabricante}&`;
        if (propulsion) url += `propulsion=${propulsion}&`;
        if (paisfabricacion) url += `paisfabricacion=${paisfabricacion}&`;
        if (aniofabricacion) url += `aniofabricacion=${aniofabricacion}&`;
  
        // Eliminar el último "&" si existe
        url = url.slice(0, -1);
  
        // Cargar aviones con los filtros aplicados
        cargar_aviones(fabricante, propulsion, paisfabricacion, aniofabricacion);
      });
  
      // Manejar el evento del botón de restablecimiento
      document.getElementById('resetButton').addEventListener('click', function() {
        // Limpiar todos los campos del formulario
        document.getElementById('fabricante').value = '';
        document.getElementById('propulsion').value = '';
        document.getElementById('paisfabricacion').value = '';
        document.getElementById('aniofabricacion').value = '';
  
        // Cargar aviones sin filtros
        cargar_aviones();
      });
  