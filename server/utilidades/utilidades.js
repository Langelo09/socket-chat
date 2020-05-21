//Función que recibe el nombre de la persona y adicionalmente un mensaje
const crearMensaje = (nombre, mensaje) => {

    return {
        nombre: nombre,
        mensaje: mensaje,
        fecha: new Date().getTime()
    };

}

module.exports = {
    crearMensaje
}