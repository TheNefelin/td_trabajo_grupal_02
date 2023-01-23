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
    var newElement = "";

    dataProductos.map((d, index) => {
        newElement = newElement + `
        <div key=${index} class="tarjeta">
            <img src="${d.link}" loading="lazy" alt="">
            <div class="tarjetaTextos">
                <h3><strong>${d.nombre}</strong></h3>
                <p>Descripcion</p>
                <p><strong>$ ${d.precio}</strong></p>
                <div class="tarjeta-modificar">
                    <button onclick="setProductoCant(1, ${d.id})">+</button>
                    <p id="cant_${d.id}">1</p>
                    <button onclick="setProductoCant(-1, ${d.id})">-</button>
                </div>
                <button class="btnX" onclick="addProducto_click(${d.id})">Agregar</button></div></div>
            </div>
        </div>`;
    });

    listaProductos.innerHTML = newElement;
};

// actualiza la cantidad en la tarjeta
function setProductoCant(n, id) {
    let cant = document.querySelector(`#cant_${id}`);
    cant.textContent = cant.textContent * 1 + n
    
    cant.textContent > 0 ? cant.textContent : cant.textContent = 1;
}

// Agrega Productos a la Canasta
let dataCanasta = [];

function addProducto_click(id) {
    let cant = document.querySelector(`#cant_${id}`).textContent * 1;
    let producto = dataProductos.find(d => d.id == id);
    let nuevoProducto = dataCanasta.find(d => d.id == id);
    let suma = 0;

    if (nuevoProducto) {
        nuevoProducto.cant = nuevoProducto.cant + cant
    }else{
        dataCanasta.push({cant, ...producto})
    }

    $(".carrito-cont").text(dataCanasta.length);

    let newElement = `
    <tr>
        <th>Producto</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Total</th>
    </tr>`

    dataCanasta.map((d) => {
        suma = suma + (d.precio * d.cant);

        newElement = newElement + `
        <tr>
            <td>${d.nombre}</td>
            <td>${d.precio}</td>
            <td>${d.cant}</td>
            <td>${d.precio * d.cant}</td>
        </tr>`;
    });

    $(".carrito-lista-add").html(newElement);
    $(".carrito-lista-total").text(`NETO: ${Math.round(suma / 1.19)} + IVA = TOTAL: ${suma}`);
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
        navBar.classList.add("navBar_ocultar");
        pie.classList.add("pie_ocultar");
        carrito.classList.add("carrito_ocultar");
    } else {
        navBar.classList.remove("navBar_ocultar");
        pie.classList.remove("pie_ocultar");
        carrito.classList.remove("carrito_ocultar");
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
