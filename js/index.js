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
                $(".carrito-lista").load("./componente/checkout.html");
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
                        <button class="btnX" onclick="addProductoDesdeTienda_click(${d.id})">Agregar</button>
                    </div>
                </div>
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

function addProductoDesdeTienda_click(id) {
    let cant = document.querySelector(`#cant_${id}`).textContent * 1;
    addProductoCanasta_click(cant, id);
}

function addProductoCanasta_click(cant, id) {
    let producto = dataProductos.find(d => d.id == id);
    let nuevoProducto = dataCanasta.find(d => d.id == id);

    if (nuevoProducto) {
        nuevoProducto.cant = nuevoProducto.cant + cant;
    }else{
        dataCanasta.push({cant, ...producto});
    }

    renderCanasta();
}

function removeProductoCanasta_click(cant, id) {
    let lgCant = document.querySelector(`#lg-cant_${id}`).textContent * 1;
    let canasta = dataCanasta.find(d => d.id == id);
    
    canasta.cant = canasta.cant + cant;

    if (canasta.cant < 1) {
        canasta.cant = 1;
    }

    lgCant = canasta.cant;
    renderCanasta();
}

function removeItemCanasta_click(id) {
    let index = dataCanasta.findIndex(d => d.id == id);
    
    dataCanasta.splice(index, 1);
    renderCanasta();
}

function renderCanasta() {
    let newElement = "";
    let suma = 0;

    dataCanasta.map(d => {
        suma = suma + d.precio * d.cant;
        newElement = newElement + `
        <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 class="my-0">${d.nombre}</h6>
                <small class="text-muted">$${d.precio}</small>
                <img onclick="removeProductoCanasta_click(-1, ${d.id})" src="../img/circulo-menos.svg">
                <span id="lg-cant_${d.id}" class="text-muted">${d.cant}</span>
                <img onclick="addProductoCanasta_click(1, ${d.id})" src="../img/circulo-mas.svg">
            </div>
            <div>
                <span class="text-muted">$${d.precio * d.cant}</span>
                <img onclick="removeItemCanasta_click(${d.id})" src="../img/trash-fill.svg">
            </div>
        </li>`;
    });

    let totales = costosTotales(suma);

    newElement = newElement + `
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">Total Neto</h6></div>
            <span class="text-success">$${totales.neto}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">IVA</h6></div>
            <span class="text-success">$${totales.iva}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">Sub Total</h6></div>
            <span class="text-success">$${totales.subTotal}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">Costo de Envío</h6></div>
            <span class="text-success">$${totales.envio}</span>
        </li>           
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (CLP)</span>
            <strong>$${totales.total}</strong>
        </li>`;

    $("#checkout-ul").html(newElement);
    $(".carrito-cont").text(dataCanasta.length);
}

function costosTotales(suma){
    let pIva = 0.19;
    let pEnvio = 0.05;

    let neto = Math.round(suma / (1 + pIva));
    let iva = Math.round(suma - neto);
    let subTotal = suma;
    let envio = suma < 100000 ? Math.round(suma * pEnvio) : 0;
    let total = envio + suma;

    return {neto, iva, subTotal, envio, total};
}

function canasta_click() {
    let canasta = document.querySelector(".carrito-lista");
    canasta.classList.add("carrito-lista_noOcultar");
};

function canastaSalir_click() {
    let canasta = document.querySelector(".carrito-lista");
    canasta.classList.remove("carrito-lista_noOcultar");
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
        for (i = 0; i < navBarBtn.length; i++){
            navBarBtn[i].classList.add("navBar-btn_div_accion");
        }
        navBarMenu.classList.add("navBar-menu_accion");
        navBarBtn_click = false;
    }else{
        for (i = 0; i < navBarBtn.length; i++){
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
function fechaT() {
    var dt = new Date;
    let anio = dt.getFullYear();
    let mes = dt.getMonth() + 1;
    let dia = dt.getDate();
    let hr = dt.getHours();
    let min = dt.getMinutes();
    let sec =  dt.getSeconds();
    let mili = dt.getMilliseconds();

    return { anio, mes, dia, hr, min, sec, mili };
}

function reloj() {
    var addHora = document.querySelector(".reloj");
    var dt = fechaT();

    dt.hr = dt.hr.toString().length == 1 ? "0" + dt.hr : dt.hr;
    dt.min = dt.min.toString().length == 1 ? "0" + dt.min : dt.min;
    dt.sec = dt.sec.toString().length == 1 ? "0" + dt.sec : dt.sec;

    var txtHora = dt.hr + " h · " + dt.min + " m · " + dt.sec + " s";

    if (txtHora != null) {
        addHora.innerHTML = '<strong>' + txtHora + '</strong>';
    };
};

setInterval(() => {
    reloj();
}, 1000);

// -- Pagar Pedido -----------------------------------------------------------------
// ---------------------------------------------------------------------------------
function btnPagar_click() {
    if (dataCanasta.length > 0 && validarForm()) {
        console.log("Pagando...");

        // compilar datos para crear comprobante, pdf, guardata en localStorage y enviar correo
        let dt = fechaT();
        let cliente = datosCliente();
        let salida = {...dt, ...cliente, ...dataCanasta}
        
        pdfComprobanteDespacho(dt, cliente, dataCanasta);
        cargarComprobanteDespacho(dt, cliente, dataCanasta);
        enviarCorreo(dt, cliente, dataCanasta);

        if (window.localStorage.getItem("salidas")) {
            let arrSalida = JSON.parse(window.localStorage.getItem("salidas"));
            arrSalida.push(salida);
            window.localStorage.setItem("salidas", JSON.stringify(arrSalida));
        }else{
            window.localStorage.setItem("salidas", JSON.stringify([salida]));
        }
    }else{
        console.log("Canasta Sin Items o No ha completado el Formulario de Pago");
    }

    // window.localStorage.clear();
    // let arr = JSON.parse(window.localStorage.getItem("salidas"));
    // console.log(arr);
}

window.jsPDF = window.jspdf.jsPDF;

function pdfComprobanteDespacho(fecha, cliente, pedido) {
    var doc = new jsPDF();
    let fila = 60;
    let suma = 0;

    doc.setFont("times", "normal");
    doc.text("CACHUREANDO", 105, 20, "center");
    doc.text("-- Detalle de Despacho --", 105, 30, "center");

    doc.text("-------------------------------------------------------------------------------------------", 20, 50);
	
    pedido.map(d => {
        doc.text(d.nombre, 20, fila);
        doc.text(d.cant + " x " + d.precio.toString(), 105, fila, null, null, "center");
        doc.text((d.cant * d.precio).toString(), 190, fila, null, null, "right");
        
        suma = suma + (d.cant * d.precio);
        fila = fila + 8;
    });

    doc.text("-------------------------------------------------------------------------------------------", 20, fila);

    let totales = costosTotales(suma);

    doc.text("Total Neto:", 20, fila + 8 * 1);
    doc.text(totales.neto.toString(), 190, fila + 8 * 1, null, null, "right");
    doc.text("Iva:", 20, fila + 8 * 2);
    doc.text(totales.iva.toString(), 190, fila + 8 * 2, null, null, "right");
    doc.text("Sub Total:", 20, fila + 8 * 3);
    doc.text(totales.subTotal.toString(), 190, fila + 8 * 3, null, null, "right");
    doc.text("EnvÍo:", 20, fila + 8 * 4);
    doc.text(totales.envio.toString(), 190, fila + 8 * 4, null, null, "right");
    doc.text("TOTAL:", 20, fila + 8 * 5);
    doc.text(totales.total.toString(), 190, fila + 8 * 5, null, null, "right");

    doc.save('comprbante.pdf');
}

function cargarComprobanteDespacho(fecha, cliente, pedido) {
    $(".contenedor").load("./componente/comprobante.html")
    console.log("...Cargando comprobante")
}

emailjs.init('mcUZL8ByE16H1TmgQ');

function enviarCorreo() {
    console.dir(document.querySelector('#frm-nombre'));
    console.dir(document.querySelector('#frm-apellido'));
    const frm = document.querySelector('#frm-correo');
    const btn = document.querySelector('#btn-correo');

    btn.value = 'Sending...';

    const serviceID = 'default_service';
    const templateID = 'template_zv565be';
 
    emailjs.sendForm(serviceID, templateID, frm)
        .then(() => {
            btn.value = 'Send Email';
            console.log('Correo Enviado!!!');
        }, (err) => {
            btn.value = 'Send Email';
            console.log(err);
    });
}

function validarForm() {
    const forms = document.querySelectorAll('.needs-validation')
    let estado;
  
    forms.forEach(d => {
      estado = d.checkValidity() ? true : false;
  
      d.classList.add('was-validated');
    }); 

    console.log(estado);
    return estado;
};

function datosCliente() {
    let cliente = {
        nombre: $("#f-nombre").val(),
        apellido: $("#f-apellido").val(),
        usuario: $("#f-usuario").val(),
        email: $("#f-email").val(),
        direccion: $("#f-direccion").val(),
        direccion2: $("#f-direccion2").val(),
        pais: $("#f-pais").val(),
        comuna: $("#f-comuna").val(),
        zip: $("#f-zip").val(),
        envioB: $("#f-envioB").val(),
        guardar: $("#f-guardar").val(),
        fPago: $("#f-fPago").val(),
        tNombre: $("#f-tNombreT").val(),
        tNumero: $("#f-tNumero").val(),
        tFecha: $("#f-tFecha").val(),
        tCVV: $("#f-tCVV").val(),
    }

    return cliente;
}

// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------