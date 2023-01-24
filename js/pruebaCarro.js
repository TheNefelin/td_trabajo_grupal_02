

let cantidadProducto = 1;
let precioUnitario = document.getElementById("precioU");
let precioInt = precioUnitario.textContent.slice(1);
// slice() Elimina caracteres de un string, el número entre paréntesis indica la posición del caracter a eliminar.

function modificarCantidad(valor) {
    let nProducto = document.getElementById("nProducto");
    let precio = document.querySelector("#subtotal");
   
    cantidadProducto = cantidadProducto * 1 + valor;

    precio.innerText = (cantidadProducto * 1) * precioInt;
    

    if (cantidadProducto > 0) {
        nProducto.innerText = cantidadProducto;
    
    } else {
        cantidadProducto = 1;
        precio.innerText = precioInt;
    }
}

function mostrarDatosComprador() {

    document.querySelector(".containerDatosComprador").hidden = false;
}











