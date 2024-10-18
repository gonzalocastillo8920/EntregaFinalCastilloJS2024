let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let categorias = [];

const logo = document.querySelector("#logo");
const mostrarProductos = document.querySelector("#productos");
const productosPorCategoria = document.querySelector("#main-categorias");
const carritoProductos = document.querySelector("#carrito");
const totalCompra = document.querySelector("#carrito-precio");
const categoriasNavbar = document.querySelector("#navbar-categorias");

logo.addEventListener("click", () => {
    mostrarProductos.classList.remove("d-none");
    productosPorCategoria.classList.add("d-none");
})

function iniciar() {
    fetch("../productos.json")
        .then((resp) => resp.json())
        .then((prod) => {
            cargarCategorias(prod);
            cargarProductos(prod);
        });
}

function cargarCategorias(prod) {
    prod.forEach((productos) => {
        if (!categorias.includes(productos.category)) {
            categorias.push(productos.category);
        }
    })
    categorias.forEach((cat) => {
        let li = document.createElement("li");
        let boton = document.createElement("button");
        boton.classList.add("btnNavbar");
        boton.innerText = `${cat}`;
        boton.addEventListener("click", () => {
            mostrarCategoria(cat);
        })
        li.append(boton);
        categoriasNavbar.append(li);
    })
}

function mostrarCategoria(cat) {

    fetch("../productos.json")
        .then(resp => resp.json())
        .then(prod => {
            let productosCategoria = prod.filter(producto => producto.category === cat);
            productosPorCategoria.innerText = "";
            cargarProductosPorCategoria(productosCategoria);
        })
}

function cargarProductosPorCategoria(productos) {
    productosPorCategoria.classList.remove("d-none");
    mostrarProductos.classList.add("d-none");

    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <p><small>Categoria: ${producto.category}</small></p>
            <img class="producto-img" src="${producto.img}">
            <h2>${producto.name}</h2>
            <p>$${producto.price}</p>
            <p><small>${producto.description}</small></p>
        `;

        let btn = document.createElement("button");
        btn.classList.add("btn-agregar");
        btn.innerText = "Agregar al Carrito";

        btn.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        div.append(btn);

        productosPorCategoria.append(div);

    });
}

function cargarProductos(productos) {
    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <p><small>Categoria: ${producto.category}</small></p>
            <img class="producto-img" src="${producto.img}">
            <h2>${producto.name}</h2>
            <p>$${producto.price}</p>
            <p><small>${producto.description}</small></p>
        `;

        let btn = document.createElement("button");
        btn.classList.add("btn-agregar");
        btn.innerText = "Agregar al Carrito";

        btn.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        div.append(btn);

        mostrarProductos.append(div);

    });
}

function agregarAlCarrito(producto) {

    Toastify({
        avatar: `${producto.img}`,
        text: `Ud. agrego: ${producto.name} al carrito`,
        duration: 4000,
        gravity: "bottom",
        stopOnFocus: true,
        destination: "./carrito/carrito.html",
        className: "toastify",
    }).showToast();

    let itemEncontrado = carrito.find((item) => item.id === producto.id);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarTotal();
}

function actualizarTotal() {
    let total = carrito.reduce((acc, prod) => acc + (prod.price * prod.cantidad), 0);
    totalCompra.innerText = `$${total}`;
}

iniciar();
actualizarCarrito();