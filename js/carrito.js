let carritoCompra = [];
let productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

productosCarrito.forEach(prod => carritoCompra.push(prod));

const totalCompra = document.querySelector("#carrito-precio");
const logo = document.querySelector("#logo");
const mostrarCarrito = document.querySelector("#carrito");
const msjCarritoVacio = document.querySelector("#carrito-vacio");
const botonLimpiarCarrito = document.querySelector("#btn-limpiar");
const botonFinalizarCompra = document.querySelector("#btn-finalizar");

logo.addEventListener("click", () => {
    window.location.href = "../index.html";
});

botonLimpiarCarrito.addEventListener("click", () => {

    if (carritoCompra.length === 0) {
        Swal.fire("Su carrito esta vacío. No hay productos para eliminar 😒");
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: "Estas seguro?",
            text: "Si elimina los productos, deberá comenzar desde cero con la compra.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si. Limpiar",
            cancelButtonText: "No. Mantener",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Carrito vaciado correctamente",
                    text: "Nuevos productos esperan ser agregados 😊",
                    icon: "success",
                });
                carritoCompra = [];
                cargarCarrito();

            } else {
                swalWithBootstrapButtons.fire({
                    title: "Accion cancelada",
                    text: "Su carrito esta sano y salvo 😉",
                    icon: "error"
                });
            }
        });
    }

});

botonFinalizarCompra.addEventListener("click", () => {

    if (carritoCompra.length !== 0) {
        Swal.fire({
            icon: "success",
            title: "Felicitaciones!! tu compra esta mas cerca 🥳🥳",
            text: "Completa el formulario y nos podremos en contacto.",
            input: "email",
            inputLabel: "Correo electronico:",
            inputPlaceholder: "Ingrese su correo electronico",
        });
        carritoCompra = [];
        cargarCarrito()
    } else {
        Swal.fire("Su carrito esta vacío 😒");
    }
})

function cargarCarrito() {

    if (carritoCompra.length === 0) {

        mostrarCarrito.innerHTML = "";
        msjCarritoVacio.classList.remove("d-none");

    } else {

        msjCarritoVacio.classList.add("d-none");
        mostrarCarrito.innerHTML = "";

        carritoCompra.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");

            div.innerHTML = `
                <img class="carrito-img" src="${producto.img}">
                <p class="carrito-titulo"><strong>${producto.name}</strong></p>
                <p>$${producto.price}</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Sub total:</strong> $${producto.cantidad * producto.price}</p>
            `;

            let btn = document.createElement("button");
            btn.classList.add("btn-agregar");
            btn.innerText = "Eliminar Producto";

            btn.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            let btnAumentar = document.createElement("button");
            btnAumentar.classList.add("btn-agregar");
            btnAumentar.innerText = "⬆️";
            btnAumentar.addEventListener("click", () => {
                aumentarCantidad(producto);
            })

            let btnDisminuir = document.createElement("button");
            btnDisminuir.classList.add("btn-agregar");
            btnDisminuir.innerText = "⬇️";
            btnDisminuir.addEventListener("click", () => {
                disminuirCantidad(producto);
            })

            div.append(btnDisminuir);
            div.append(btn);
            div.append(btnAumentar);
            mostrarCarrito.append(div);
        });
    }

    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carritoCompra));
}

function aumentarCantidad(producto) {

    let prodEncontrado = carritoCompra.find((prod) => prod.id === producto.id);
    prodEncontrado.cantidad++;

    cargarCarrito();
}

function disminuirCantidad(producto) {

    let prodEncontrado = carritoCompra.find((prod) => prod.id === producto.id);

    if (prodEncontrado.cantidad >= 2) {
        prodEncontrado.cantidad--;
    } else {
        borrarDelCarrito(prodEncontrado);
    }

    cargarCarrito();
}

function borrarDelCarrito(producto) {

    Toastify({
        avatar: `${producto.img}`,
        text: `Ud. elimino: ${producto.name} del carrito`,
        duration: 4000,
        gravity: "bottom",
        stopOnFocus: true,
        className: "toastify-del",
    }).showToast();

    let id = carritoCompra.findIndex((prod) => prod.id === producto.id);
    carritoCompra.splice(id, 1);

    cargarCarrito();
}

function actualizarTotal() {
    let total = carritoCompra.reduce((acc, prod) => acc + (prod.price * prod.cantidad), 0);
    totalCompra.innerText = `Total de la compra: $${total}`;
}

cargarCarrito();