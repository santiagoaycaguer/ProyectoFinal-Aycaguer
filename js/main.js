let productos= [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

const contenedorProductos = document.querySelector("#contenedor-productos"); // En esta seccion de JS se iran poniendo todas las cosas que se iran llamando del DOM
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) { // En principio se hara un forEach del Array para que recorra todos los productos y se puedan cargar todos uno por uno en la pagina
    
    contenedorProductos.innerHTML = ""; // Aca lo que queremos lograr es que cuando la funcion cargarProductos se ejecute primero que nada va a vaciar contenedorProductos.innerHTML y luego pasa al forEach crando array con el filter
    
    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML =`
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button> 
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => { // En principio le pasamos un evento para al hacer "click" le podramos aplicar a ese eventTarget la clase "active" pero primero le sacamos esa clase "active"

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active"); // Usamos currentTarget porque es mejor que si usamos solo Target (Target solo va a depender de lo que clickeemos) porque currentTarget lo que hace es Targeterar osea hacer objetivo exactamente al elemeto del EventListener y no a lo que le hagamos click

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id); // La propiedad id lo que hace es traernos el id de ese elemento HTML
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() { // Cada vez que se cargan productos nuevos tambien se actualizan estos botones, es decir vuelva a buscar en el html en el DOM todos los que existan estos botones
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

                            // Acá lo que estamos haciendo es que si hay algo en el localStorage lo que va a hacer es que si productosEnCarrito sea igual a lo que traiga del LS y sino que sea un Array vacio
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) { // Agregar al carrito lo que queremos que haga es que agregue esos elementos a un array porque vamos a tener un array de productos agregados al carrito

    Toastify({
        text: "Producto agregado",
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem",
        },
        offset: {
            x: `1.5rem`, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: `1.5rem`, // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    if(productosEnCarrito.some(producto => producto.id === idBoton)) { // some lo que hace es fijarse si hay algo que coincida con eso, devolviendo true o false
       const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
       productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1; // Al producto agregado creado anteriormente le estamos asignando una propiedad nueva que sea cantiad
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}