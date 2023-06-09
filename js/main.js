//DECLARO ARRAYS y VARIABLES

let productos = [];
let carrito = [];
const inputs = [...document.querySelectorAll(".formulario .input")];
let compraRealizada = [];


//TOMO ELEMENTOS DEL DOM
const cartas = document.getElementById("cartas");
const cargaCartas = document.createDocumentFragment();
const contenedorCarrito = document.getElementById("carritoContenedor");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const itemsCarrito = document.getElementById("cart-items");
const precioProducto = document.getElementsByClassName("precioProducto");
const precioFinal = document.getElementById("precioTotal");
const cantidad = document.getElementById("cantidad");
const botonComprar = document.getElementById("comprar-carrito");
const iconoCarrito = document.getElementsByClassName("nav-icon");
const openModal = document.querySelector('.abrirCarrito');
const modal = document.querySelector('.miModal');
const closeModal = document.querySelector('.cerrarCarrito');
const modalCarrito = document.querySelector('.modalContenedor');
const nav = document.querySelector("#nav");
const abrirNav = document.querySelector("#btnAbrir");
const cerrarNav = document.querySelector("#btnCerrar")


// INVOCO FUNCIONES
carroVacio();


// TRAIGO EL LOCAL STORAGE DEL CARRITO
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("carroCompras")) {
        carrito = JSON.parse(localStorage.getItem("carroCompras"));
        console.log(carrito);
        enElCarrito();
    }
    obtenerStock();
})

//CREO MI STOCK o TRAIGO MI SOTCK

const obtenerStock = async () => {
    const archivoJSON = "productos.json";
    const peticion = await fetch(archivoJSON);
    const respuesta = await peticion.json();
    productos = respuesta;
    cardsProductos();
}


const exhibirPrecios = productos.map((prod) => {
    let exhibicion = prod.nombre + " $" + prod.precio;
    return exhibicion;
})

// RENDERIZO LAS CARDS
function cardsProductos() {
    //inyecto las cards al DOM
    productos.forEach((producto) => {
        let carta = document.createElement("div");
        carta.className = "divCard";
        carta.innerHTML = `
        <img class="img-card" src=${producto.imagen} alt= 'imagen de ${producto.nombre}'>
        <div class="cardBody">
            <h3 class="tituloProductos">${producto.nombre}</h3>
            <p class="descripcionProductos">${producto.descripcion}</p>
            <p class="precio">Precio: $ ${producto.precio}</p>
            <div class="">
                <button class="buttonPropiedades" id="agregar${producto.id}" type="button">Agregar al carrito</button>
            </div>
        `;

        cargaCartas.appendChild(carta);
        cartas.appendChild(cargaCartas);
        //agregando productos al carrito
        const botonAgregar = document.getElementById(`agregar${producto.id}`);

        botonAgregar.addEventListener("click", () => {
            if (producto.cantidad === 0) {
                //simulo que no hay stock de un producto
                Swal.fire({
                    title: 'Disulpas!!',
                    text: 'No contamos con stock',
                    imageUrl: './images/emojidecepcion.webp',
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: 'emoji de decepcion',
                })
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: `${producto.nombre} agregado al carrito`
                })
                agregarAlCarrito(producto.id)
            }
        })
    })
}


//FUNCIONALIDAD DEL CARRITO
const agregarAlCarrito = (prodId) => {
    const existe = carrito.some(prod => prod.id === prodId);
    if (existe) {
        const prod = carrito.map(prod => {
            prod.id === prodId && prod.cantidad++ //sintaxis simplificada
        })
    }
    else {
        const item = productos.find((prod) => prod.id === prodId);
        carrito.push(item);
    }
    enElCarrito();
    console.log(carrito);
}

function carroVacio() {
    carrito.length === 0 ? carritoContenedor.innerHTML += `<h2 class="parrCarroVacio">Tu carrito está vacio</h2>` : console.log("El carro no está vacio");
}

// CONSTRUCTOR DEL CARRITO
const enElCarrito = () => {
    contenedorCarrito.innerHTML = "";
    //inyecto los productos al modal del carrito
    carrito.forEach((prod) => {
        const div = document.createElement("div");
        div.className = ("productoEnCarrito");
        div.innerHTML = `
        <p class="pModal">${prod.nombre} </p>
        <p class="pModal">Precio: $ ${prod.precio}</p>
        <p class="pModal">Cantidad: <input id="cantidad-${prod.id}" type="number" value="${prod.cantidad}" min="1" max="1000" step="1" style="color: #000;"/></p>
        <button onclick="sacarCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i>Eliminar</button>
        `
        contenedorCarrito.appendChild(div);
        //actualizo el precio si se aumenta la cantidad de productos
        let cantidadProductos = document.getElementById(`cantidad-${prod.id}`);
        cantidadProductos.addEventListener("change", (e) => {
            let nuevaCantidad = e.target.value;
            prod.cantidad = nuevaCantidad;
            enElCarrito();
        });
        //modificacion del numero que aparece en el icono del carrito
        itemsCarrito.innerText = carrito.length;
        //guardo el contenido del carrito en el local storage
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
    })

    precioFinal.innerText = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
}

// FUNCIONALIDAD DE LAS PARTES (BUTTONS) DEL CARRITO
const sacarCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId);
    const i = carrito.indexOf(item);
    carrito.splice(i, 1);
    itemsCarrito.innerText = carrito.length;
    enElCarrito();
}

vaciarCarrito.addEventListener("click", () => {
    carrito.length = 0;
    Swal.fire('Has vaciado tu carrito');
    localStorage.removeItem("carroCompras");
    itemsCarrito.innerText = 0;
    enElCarrito();
    carroVacio();
})

botonComprar.addEventListener("click", () => {
    if (carrito.length === 0){
        Swal.fire('Tu carrito está vacío');
        setTimeout(() => {
            location.href = "./index.html";
        }, 2000)
    }else {
        compraRealizada.push(carrito.filter(producto => producto));
        localStorage.setItem("compraRealizada", JSON.stringify(compraRealizada));
        console.log(compraRealizada);
        carrito.length = 0;
        itemsCarrito.innerText = 0;
        Swal.fire('Gracias por tu compra!! Estamos redirigiéndote a la página de pago');
        setTimeout(() => {
            location.href = "./pages/compras.html";
        }, 2000);
        enElCarrito();
    }
})



//EVENTO QUE DIRECCIONA A LOS PRODUCTOS
const botonBanner = document.querySelector(".banner-title");

botonBanner.addEventListener("mousedown", () => {
    location.href = "#productos";
})


//FORMULARIO DE CONTACTO
const formularioNombre = document.querySelector(".nombreForm");
const telefonoFormulario = document.querySelector(".telForm");
const correoElectronico = document.getElementById("email");
const formulario = document.querySelector(".formulario");
const form = document.getElementById("form");
const btn = document.getElementById('btnSubmit');
const lettersPattern = /^[A-Z À-Ú]+$/i;
const numbersPattern = /^[0-9]+$/;
const isEmail = email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

//VALIDACION MANUAL DEL FORMULARIO
const campos = {
  nombre: false,
  email: false,
  telefono: false
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nombre":
      if (formularioNombre.value === "" || !lettersPattern.test(formularioNombre.value)) {
        mostrarMensaje("error", "Revisa los datos ingresados");
      } else {
        campos["nombre"] = true;
      }
      break;
    case "email":
      if (correoElectronico.value === "" || !isEmail(correoElectronico.value)) {
        mostrarMensaje("error", "Revisa los datos ingresados");
      } else {
        campos["email"] = true;
      }
      break;
    case "phone":
      if (telefonoFormulario.value === "" || !numbersPattern.test(telefonoFormulario.value)) {
        mostrarMensaje("error", "Revisa los datos ingresados");
      } else {
        campos["telefono"] = true;
      }
      break;
    default:
      console.log("Formulario ok");
      break;
  }
};

form.addEventListener("submit", e => {
  e.preventDefault();
  
  // Validar todos los campos antes de enviar el formulario
  for (const campo in campos) {
    if (!campos[campo]) {
      mostrarMensaje("error", "Completa todos los campos");
      return;
    }
  }
  
  // Enviar el formulario si todos los campos son válidos
  form.submit();
});

function mostrarMensaje(tipo, mensaje) {
  const mensajeDiv = document.createElement("div");
  mensajeDiv.classList.add("mensaje");
  mensajeDiv.classList.add(tipo);
  mensajeDiv.textContent = mensaje;
  formulario.appendChild(mensajeDiv);

  setTimeout(() => {
    mensajeDiv.remove();
  }, 3000);
}

// Escuchar los eventos de los campos del formulario
formularioNombre.addEventListener('keyup', validarFormulario);
formularioNombre.addEventListener('blur', validarFormulario);
correoElectronico.addEventListener('keyup', validarFormulario);
correoElectronico.addEventListener('blur', validarFormulario);
telefonoFormulario.addEventListener('keyup', validarFormulario);
telefonoFormulario.addEventListener('blur', validarFormulario);


//api que envia el mail

form.addEventListener('submit', function (e) {
        if (campos.nombre && campos.email && campos.telefono) {
        swal.fire("Mensaje enviado")
        form.reset();

    }  else {
        swal.fire("Por favor, verifica todos los campos")
    }
    });



// MODAL DEL CARRITO
openModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('modal--show');
});

closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('modal--show');
});


//CARROUSEL

const slider = document.querySelector("#slider");
let sliderSection = document.querySelectorAll(".slider-section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const btnLeft = document.querySelector("#btn-left");
const btnRight = document.querySelector("#btn-right");

slider.insertAdjacentElement('afterbegin', sliderSectionLast)

function Next() {
    let sliderSectionFirst = document.querySelectorAll(".slider-section")[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.6s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%"
    }, 600);
}
btnRight.addEventListener('click', () =>{
    console.log("click")
    Next();
})

function Prev() {
    let sliderSection = document.querySelectorAll(".slider-section");
    let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.6s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-100%"
    }, 600);
}
btnLeft.addEventListener('click', () =>{
    console.log("click")
    Prev();
})

setInterval( () => {
    Next();
}, 3000);

//MENU HAMBURGUESA

abrirNav.addEventListener("click", () =>{
    nav.classList.add("menu--show");
    nav.classList.add("visible");
})

cerrarNav.addEventListener("click", () =>{
    nav.classList.remove("menu--show");
    nav.classList.remove("visible");
})