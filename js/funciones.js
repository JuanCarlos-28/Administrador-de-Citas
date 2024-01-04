import { Citas } from "./Classes/Citas.js";
import { UI } from "./Classes/UI.js";
import { fechaInput, formulario, horaInput, mascotaInput, propietarioInput, sintomasInput, telefonoInput } from "./selectores.js";

let editando;

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
        console.log('Modo edición');

        // Pasar el objeto de la cita a modo edición
        administrarCitas.editarCita({...datosObj});

        // Mensaje de actualizado
        ui.imprimirAlerta('Editado correctamente');
        
        // regresar el texto a su estadop original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Quitar modo edición
        editando = false;


    } else {
        console.log('Nueva Cita');
        // Agregar un ID
        datosObj.id = Date.now();

        // Creando una nueva cita
        administrarCitas.agregarCita({...datosObj}); // *

        // Mensaje de agregado
        ui.imprimirAlerta('Se agregó correctamente');
    }

    

    // Reiniciar el objeto
    reiniciarObjeto();

    // Reiniciando el formulario
    formulario.reset();

    // Mostrar el HTML
    ui.imprimirCitas( administrarCitas );

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
    administrarCitas.eliminarCita(id);

    // Mostrar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente', 'success');

    // Refrescar citas
    ui.imprimirCitas(administrarCitas);
    formulario.reset();
    reiniciarObjeto();
    formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

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