import { Citas } from "./Classes/Citas.js";
import { UI } from "./Classes/UI.js";
import { fechaInput, formulario, horaInput, mascotaInput, propietarioInput, sintomasInput, telefonoInput } from "./selectores.js";

let editando;
export let DB;

const ui = new UI();
const administrarCitas = new Citas();

// Objeto con la información de la cita
const datosObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Agregar datos al objeto de la cita
export function datosCita(e) {
    const nombreInput = e.target.name;
    const valorInput = e.target.value;

    datosObj[nombreInput] = valorInput;
    console.log(datosObj);
}

// Valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
    e.preventDefault();

    // Extraer la información
    const { mascota, propietario, telefono, fecha, hora, sintomas } = datosObj;

    // Validar
    if (mascota.trim() === '' || propietario.trim() === '' || telefono.trim() === '' || fecha.trim() === '' || hora.trim() === '' || sintomas.trim() === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if (editando) {

        // Pasar el objeto de la cita a modo edición
        administrarCitas.editarCita({...datosObj});

        // Edita en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(datosObj);

        transaction.oncomplete = () => {

            // Mensaje de actualizado
            ui.imprimirAlerta('Editado correctamente');
            
            // regresar el texto a su estadop original
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    
            // Quitar modo edición
            editando = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }

    } else {

        // Agregar un ID
        datosObj.id = Date.now();

        // Creando una nueva cita
        administrarCitas.agregarCita({...datosObj}); // *

        // Agregar al Indexed BD
        const transaction = DB.transaction(['citas'], 'readwrite');

        // Habilitar el objectStore
        const objectStore = transaction.objectStore('citas');

        // Insertar en la DB
        objectStore.add(datosObj);

        transaction.oncomplete = () => {

            console.log('Cita agregada');
            
            // Mensaje de agregado
            ui.imprimirAlerta('Se agregó correctamente');

        }

    }

    // Reiniciar el objeto
    reiniciarObjeto();

    // Reiniciando el formulario
    formulario.reset();

    // Mostrar el HTML
    ui.imprimirCitas();

}

export function reiniciarObjeto() {
    datosObj.mascota = '';
    datosObj.propietario = '';
    datosObj.telefono = '';
    datosObj.fecha = '';
    datosObj.hora = '';
    datosObj.sintomas = '';
}

export function eliminarCita(id) {
    // Eliminar la cita
    // administrarCitas.eliminarCita(id);

    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = () => {

        // Mostrar mensaje
        ui.imprimirAlerta('La cita se eliminó correctamente', 'success');
    
        // Refrescar citas
        ui.imprimirCitas();
        formulario.reset();
        reiniciarObjeto();
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        
    }


}

export function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    datosObj.mascota = mascota;
    datosObj.propietario = propietario;
    datosObj.telefono = telefono;
    datosObj.fecha = fecha;
    datosObj.hora = hora;
    datosObj.sintomas = sintomas;
    datosObj.id = id;

    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

export function crearDB() {
    // Crear la base de datos en version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // Si hay un error
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }

    // Si todo ocurre bien
    crearDB.onsuccess = function() {
        console.log('Base de datos creada');

        DB = crearDB.result;

        // Mostrar citas al cargar (pero IndexedDB ya está lista)
        ui.imprimirCitas();
    }

    // Definir el schema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        // ObjectStore
        const ObjectStore = db.createObjectStore('citas', {
            keyPath: 'id', // Indíce de la BD
            autoIncrement: true,
        })

        // Definir todas las columnas
        ObjectStore.createIndex('mascota', 'mascota', { unique: false } );
        ObjectStore.createIndex('propietario', 'propietario', { unique: false } );
        ObjectStore.createIndex('telefono', 'telefono', { unique: false } );
        ObjectStore.createIndex('fecha', 'fecha', { unique: false } );
        ObjectStore.createIndex('hora', 'hora', { unique: false } );
        ObjectStore.createIndex('sintomas', 'sintomas', { unique: false } );
        ObjectStore.createIndex('id', 'id', { unique: true } );

        console.log('DB Creada y lista');
    }
}