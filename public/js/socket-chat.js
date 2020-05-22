var socket = io();

//Busca parametros, en este caso en la URL del navegador y se guarda en params
var params = new URLSearchParams(window.location.search);

// Valida si en los params contiene el 'nombre'. Si no contiene el nombre, entonces...
if (!params.has('nombre') || !params.has('sala')) {

    //En caso de no encontrar el 'nombre' redirijirlo al index para registro
    window.location = 'index.html';

    //Arroja error en caso de que no encuentre el nombre
    throw new Error('El nombre y la sala son necesario!')
}

//Se construye el nombre
var usuario = {

    // Se guarda el nombre y la sala obtenido de la variable params
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {

    //Se conecta con el servidor y arroja el mensaje
    console.log('Conectado al servidor');

    //Emite el mensaje del usuario que se conecto, y se ejecuta un callback regresando todos los usuarios conectados
    socket.emit('entrarChat', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información o mensjae desde un cliente a todos los demás usuarios
// socket.emit('crearMensaje', {
//     nombre: nombre,
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información crearMensaje del archivo socket.js
socket.on('crearMensaje', function(mensaje) {

    // console.log('Servidor: ', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();

});

//Escuchar cambios de usuario, cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {

    // console.log(personas);
    renderizarUsuarios(personas);

});

// Mensajes Privados
//Acción que se dispara cuando se envie un mensaje privado
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado', mensaje);

});