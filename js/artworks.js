document.addEventListener("DOMContentLoaded", () => {
    // elemento DOM donde se mostrarán las obras de arte
    const artworkList = document.getElementById("artwork-list");
  
    // cargar y mostrar las obras de arte desde un archivo JSON
    fetch("data/artworks.json")
      .then((response) => response.json())
      .then((artworks) => {
        artworks.forEach((artwork) => {
          const artworkCard = document.createElement("div");
          artworkCard.classList.add(
            "bg-white",
            "p-4",
            "rounded-lg",
            "shadow-lg",
            "border-2",
            "border-gray-300"
          );
  
          // contenido HTML de cada tarjeta de obra de arte
          artworkCard.innerHTML = `
            <img src="${artwork.image}" alt="${artwork.title}" class="w-full h-50 object-cover rounded-lg mb-4">
            <h2 class="text-xl font-bold mb-2">${artwork.title}</h2>
            <p class="text-gray-700 mb-2">${artwork.description}</p>
            <p class="text-lg font-bold mb-2">$${artwork.price.toLocaleString()}</p>
            <button class="w-full bg-red-500 text-white py-2 px-4 rounded-lg">Añadir al carrito</button>
          `;
  
          // evento para añadir la obra al carrito
          artworkCard.querySelector("button").addEventListener("click", () => {
            window.addToCart(artwork);
          });
  
          // añadir la tarjeta de obra de arte al contenedor de la lista de obras
          artworkList.appendChild(artworkCard);
        });
      })
      .catch((error) => console.error("Error al cargar las obras de arte:", error));
  });