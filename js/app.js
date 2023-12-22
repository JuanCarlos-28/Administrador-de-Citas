// Campos del Formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// Registrar Eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita );
    propietarioInput.addEventListener('input', datosCita );
    telefonoInput.addEventListener('input', datosCita );
    fechaInput.addEventListener('input', datosCita );
    horaInput.addEventListener('input', datosCita );
    sintomasInput.addEventListener('input', datosCita );
    formulario.addEventListener('submit', () => {});
}

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
function datosCita(e) {
    const nombreInput = e.target.name;
    const valorInput = e.target.value;

    datosObj[nombreInput] = valorInput;
    console.log(datosObj);
}