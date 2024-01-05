import { App } from "./Classes/App.js"
import { crearDB } from "./funciones.js";

window.onload = () => {
    const app = new App();

    crearDB();
}