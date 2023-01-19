// -- Inicializar Sitio ------------------------------------------------------------
// ---------------------------------------------------------------------------------
window.onload = () => {
    cargarComponente(1);
    console.log("Sitio iniciado");
}

// -- Manejo de Navegacion ---------------------------------------------------------
// ---------------------------------------------------------------------------------
function cargarComponente(id) {
    switch (id){
        case 1:
            $('.contenedor').load("./componente/tienda.html", () => {
                getProductos();
            });
            break;
        case 2:
            $(".contenedor").load("./componente/encuesta.html .encuesta");
            break;
        case 3:
            $('.contenedor').load("./componente/links.html", () => {
                getLinks();
            });
            break;
        case 4:
            $(".contenedor").load("./componente/contacto.html .contacto");
            break;
    }

    // -- Despues de click al Link, el Menu se Ocultara
    if (!navBarBtn_click) {
        btnMenu()
    }
};

// -- Carga Productios en Tienda - Render Tarjetas ---------------------------------
// ---------------------------------------------------------------------------------
function getProductos(){
    var listaProductos = document.querySelector(".tarjetaContenedor");
    var newElement = ""

    dataProductos.map((d, index) => {
        newElement = newElement + `<div key=${index} class="tarjeta">`;
        newElement = newElement + `<img src="${d.link}" alt="">`;
        newElement = newElement + `<div class="tarjetaTextos">`;
        newElement = newElement + `<h3><strong>${d.nombre}</strong></h3>`;
        newElement = newElement + `<p>${d.descripcion}</p>`;
        newElement = newElement + `<p><strong>$ ${d.precio}</strong></p>`;
        newElement = newElement + `<div class="tarjeta-modificar">`;
        newElement = newElement + `<button onclick="setProductoCant(1, ${d.id})">+</button>`;
        newElement = newElement + `<p id=cont${d.id}>1</p>`;
        newElement = newElement + `<button onclick="setProductoCant(-1, ${d.id})">-</button></div>`;
        newElement = newElement + `<button value=${d.id} class="btnX" onclick="addProducto_click(this)">Agregar</button></div></div>`;
    });

    listaProductos.innerHTML = newElement;
};

function setProductoCant(valor, id) {
    let componente = document.querySelector(`#cont${id}`);
    let cantProducto = componente.innerText;

    cantProducto = cantProducto*1 + valor

    if (cantProducto > 0) {
        componente.textContent = cantProducto;
    }else{
        cantProducto = 1;
    }
}

// Agrega Productos a la Canasta
const dataCanasta = [];

function addProducto_click(elemento) {
    let canasta = document.querySelector(".carrito-cont");

    dataProductos.map((d) => {
        if (d.id == elemento.value){
            dataCanasta.push(d);
        }
    });

    canasta.textContent = dataCanasta.length;

    let addItem = document.querySelector("#addItem");
    let newElement = "";

    dataCanasta.map((d, index) => {
        newElement = newElement + `<li>Precio: ${d.precio} Item: ${d.nombre}</li><hr>`;
    });

    addItem.innerHTML = newElement;
};

function canasta_click() {
    let canasta = document.querySelector(".carrito-lista");
    canasta.classList.add("carrito-lista_ocultar");
};

function canastaSalir_click() {
    let canasta = document.querySelector(".carrito-lista");
    canasta.classList.remove("carrito-lista_ocultar");
};

function carritoLista_vaciarPor(id) {

};

// -- Manejo de Navegacion - Render Links (Paltas) ---------------------------------
// ---------------------------------------------------------------------------------
function getLinks() {
    var listaLinks = document.querySelector(".links");
    var newElement = "";

    dataLinks.map((d, index) => {
        newElement = newElement + `<a key=${index} href='${d.url}' target="_blank" class="list-group-item list-group-item-action">${d.nombre}</a>`;
    });

    listaLinks.innerHTML = newElement;
};

// -- Manejo btn Menu Hamburguesa --------------------------------------------------
// ---------------------------------------------------------------------------------
let navBarBtn_click = true;

function btnMenu() {
    var navBarBtn = document.querySelector(".navBar-btn").children;
    var navBarMenu = document.querySelector(".navBar-menu");

    if (navBarBtn_click) {
        for (i=0; i<navBarBtn.length; i++){
            navBarBtn[i].classList.add("navBar-btn_div_accion");
        }
        navBarMenu.classList.add("navBar-menu_accion");
        navBarBtn_click = false;
    }else{
        for (i=0; i<navBarBtn.length; i++){
            navBarBtn[i].classList.remove("navBar-btn_div_accion");
        }
        navBarMenu.classList.remove("navBar-menu_accion");
        navBarBtn_click = true;
    }
};

// -- Manejo de Mensajeria ---------------------------------------------------------
// ---------------------------------------------------------------------------------
function msge(btn_clic) {
    let modal = document.querySelector(".modal-body");
    let msg = "";

    if (btn_clic.id == "btnEncuesta"){
        msg = msge_Encuesta();
    }else if (btn_clic.id == "btnContacto"){
        msg = msge_Contacto();
    }

    modal.innerHTML = msg;
};

function msge_Encuesta() {
    let txtEncuesta = document.querySelector("#txtEncuesta");
    let txt = "";

    $(txtEncuesta).css('border-color', 'black');

    if (isNaN(txtEncuesta.value) || txtEncuesta.value == ''){
        txt = "Debe Ingresar una Valor Numérico";
        $(txtEncuesta).css('border-color', 'red');
    }else{
        if (txtEncuesta.value > 10) {
            txt = "El Valor Debe ser Entre 0 y 10";
            $(txtEncuesta).css('border-color', 'red');
        }else{
            txt = "Gracias por Darnos tu Opinión";
            txtEncuesta.value = "";
        }
    }

    return txt
};

function msge_Contacto() {
    let txtEmail = document.querySelector("#txtContactoEmail");
    let txtNombre = document.querySelector("#txtContactoNombre");
    let txt = "";

    $(txtEmail).css('border-color', 'black');
    $(txtNombre).css('border-color', 'black');

    if (txtEmail.value == ""){
        txt = "Debe Ingresar un EMail";
        $(txtEmail).css('border-color', 'red');
    }else{
        if (txtNombre.value == "") {
            txt = "Debe Ingresar su Nombre";
            $(txtNombre).css('border-color', 'red');
        }else{
            txt = "Gracias por Contactarnos!!!";
            txtEmail.value = "";
            txtNombre.value = "";
        }
    }

    return txt;
};

// -- Ocultar NavBar y Pie ---------------------------------------------------------
// ---------------------------------------------------------------------------------
let scrY = window.scrollY;

window.addEventListener("scroll", () => {
    let navBar = document.querySelector(".navBar");
    let pie = document.querySelector(".pie");
    let carrito = document.querySelector(".carrito");

    if (scrY < window.scrollY) {
        navBar.classList.add("navBar-ocultar");
        pie.classList.add("pie-ocultar");
        carrito.classList.add("carrito-ocultar");
    } else {
        navBar.classList.remove("navBar-ocultar");
        pie.classList.remove("pie-ocultar");
        carrito.classList.remove("carrito-ocultar");
    }

    scrY = window.scrollY;

    if (!navBarBtn_click) {
        btnMenu()
    }
});

// -- Reloj ------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
function reloj() {
    var dt = new Date;
    var addHora = document.querySelector(".reloj");
    var txtHora = dt.getHours() + " h · " + dt.getMinutes() + " m · " + dt.getSeconds() + " s";

    if (txtHora != null) {
        addHora.innerHTML = '<strong>' + txtHora + '</strong>';
    };
};

setInterval(() => {
    reloj();
}, 1000);
