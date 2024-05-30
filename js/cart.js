document.addEventListener("DOMContentLoaded", () => {
  // elementos del DOM relacionados con el carrito
  const cartButton = document.getElementById("cart-button");
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartDropdown = document.getElementById("cart-dropdown");
  const purchaseButton = document.getElementById("purchase-button");

  // Inicializar el carrito
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // funcion para actualizar la visualizacion del carrito
  const updateCartDisplay = () => {
    // actualizar el contador de articulos en el carrito
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Limpiar los elementos del carrito
    cartItems.innerHTML = "";
    let total = 0;

    // crear elementos de cada articulo en el carrito
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add(
        "bg-white-400",
        "p-4",
        "rounded-lg",
        "mb-4",
        "border-solid",
        "border-2",
        "border-sky-500"
      );

      // contenido HTML de cada articulo en el carrito
      cartItem.innerHTML = `
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-black">${item.title}</h3>
              <div class="flex items-center mt-2 text-black">
                <button class="bg-red-500 text-white py-1 px-2 rounded-lg" data-index="${index}" data-action="decrease">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="bg-green-500 text-white py-1 px-2 rounded-lg" data-index="${index}" data-action="increase">+</button>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-lg font-bold text-black">$${(
                item.price * item.quantity
              ).toLocaleString()}</span>
              <button class="bg-red-500 text-white py-1 px-2 rounded-lg ml-4" data-index="${index}" data-action="remove">Eliminar</button>
            </div>
          </div>
        `;

      // Añadir artículo al contenedor de artículos del carrito
      cartItems.appendChild(cartItem);

      // calcular el total
      total += item.price * item.quantity;
    });

    // actualizar el total del carrito
    cartTotal.textContent = total.toLocaleString();

    // eventos a los botones de suma, resta y eliminar
    const buttons = cartItems.querySelectorAll("button[data-index]");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const action = e.target.dataset.action;
        if (action === "increase") {
          cart[index].quantity += 1;
        } else if (action === "decrease") {
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          } else {
            cart.splice(index, 1);
          }
        } else if (action === "remove") {
          cart.splice(index, 1);
        }
        updateCartDisplay();
        saveCart();
      });
    });
  };

  // funcion para guardar el carrito en localStorage
  const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // funcion para alternar la visibilidad del carrito
  const toggleCartDropdown = () => {
    cartDropdown.classList.toggle("hidden");
  };

  // funcion para procesar la compra de los artículos del carrito
  const purchaseItems = () => {
    if (cart.length === 0) {
      Swal.fire("Error", "No tienes ningún artículo en el carrito", "error");
      return;
    }

    Swal.fire({
      title: "¿Confirmar compra?",
      text: `Total: $${cartTotal.textContent}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, comprar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Compra realizada",
          "Tu compra ha sido realizada con exito.",
          "success"
        );
        cart = [];
        updateCartDisplay();
        saveCart();
      }
    });
  };

  // evento para mostrar/ocultar carrito
  cartButton.addEventListener("click", toggleCartDropdown);

  // evento para procesar la compra
  purchaseButton.addEventListener("click", purchaseItems);

  // Iniciar la visualización del carrito
  updateCartDisplay();

  // funcion global para añadir el carrito
  window.addToCart = (artwork) => {
    const existingItem = cart.find((item) => item.id === artwork.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...artwork, quantity: 1 });
    }
    updateCartDisplay();
    saveCart();
  };
});
