const pantalla = document.querySelector(".pantalla");
const botones = document.querySelectorAll(".boton");
const historialDiv = document.querySelector(".historial");

let expresion = "";
let resultadoMostrado = false;
let historial = [];

window.addEventListener("load", () => {
    const guardado = localStorage.getItem("historialCalculadora");
    if (guardado) {
        historial = JSON.parse(guardado);
        mostrarHistorial();
    }
});

const actualizarPantalla = (texto) => {
    pantalla.textContent = texto || "0";
};

const esOperador = (caracter) => /[+\-*/]/.test(caracter);

function mostrarHistorial() {
    historialDiv.innerHTML = "";
    historial.slice(-10).forEach(op => {
        const p = document.createElement("p");
        p.textContent = op;
        historialDiv.appendChild(p);
    });
    localStorage.setItem("historialCalculadora", JSON.stringify(historial));
}

document.getElementById("borrarHistorial").addEventListener("click", () => {
    historial = [];
    localStorage.removeItem("historialCalculadora");
    mostrarHistorial();
});

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const valor = boton.textContent;
        const id = boton.id;

        switch (id) {
            case "c":
                expresion = "";
                resultadoMostrado = false;
                actualizarPantalla(expresion);
                break;

            case "borrar":
                if (resultadoMostrado) {
                    expresion = "";
                    resultadoMostrado = false;
                    actualizarPantalla(expresion);
                } else {
                    expresion = expresion.slice(0, -1);
                    actualizarPantalla(expresion);
                }
                break;

            case "igual":
                try {
                    const resultado = Function('"use strict"; return (' + expresion + ')')();
                    const operacion = `${expresion} = ${resultado}`;
                    
                    historial.push(operacion);
                    mostrarHistorial();

                    expresion = resultado.toString();
                    resultadoMostrado = true;
                } catch {
                    expresion = "";
                    actualizarPantalla("ERROR!");
                    return;
                }
                actualizarPantalla(expresion);
                break;

            default:
                if (resultadoMostrado) {
                    if (/[\d.]/.test(valor)) {
                        expresion = "";
                    }
                    resultadoMostrado = false;
                }

                const ultimo = expresion.slice(-1);
                if (esOperador(valor) && esOperador(ultimo)) {
                    if (!(valor === "-" && expresion.length === 0)) return;
                    expresion = expresion.slice(0, -1);
                }

                expresion += valor;
                actualizarPantalla(expresion);
                break;
        }
    });
});
