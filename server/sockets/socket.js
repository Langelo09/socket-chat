const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

//Se manda a llamar al metodo Usuarios del archivo usuarios.js
const usuarios = new Usuarios();

io.on('connection', (client) => {

    //evento que se dispara cuando una persona entra al chat
    client.on('entrarChat', (data, callback) => {

        //Si no viene el nombre, regresar el callback con el error
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        //Instrucción para conectar un usuario a una sala
        client.join(data.sala);

        //LLamar la funcion agregarPersonas del archivo usuarios.js
        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        //Dispara un evento que escuchan todas las personas conectadas a una misma sala cada que una persona entra o sale del chat
        //Y recuepera todas las personas conectadas al chat
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));

    });

    //Escucha cuando algun usuario llama el metodo de crearMensaje del archivo socket.chat.js [socket.emit('crearMensaje'] 
    //creando el mensaje del archivo utilidades.js
    client.on('crearMensaje', (data) => {

        //Obtener el nombre e información d ela persona que envía el mensaje 
        let persona = usuarios.getPersona(client.id);

        // Se crea el mensaje de la persona 
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        //Emitir a todas las personas el nuevo mensaje
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    client.on('disconnect', () => {

        //Regresa a la persona borrada y lo guarda en la variable personaBorrada
        let personaBorrada = usuarios.borrarPersona(client.id);

        // //Informar a todos los usuarios conectados que una persona se ha desconectado
        // client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre}  abandonó el chat` });

        //Informar a todos los usuarios conectados que una persona se ha desconectado con la función crearMensaje del archivo utilidades.js
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));

        //Se dispara nuevamente el evento listaPersonas
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // Mensajes Privados
    //Lo que hace el servidor cuando se quiere enviar un  mensaje privado a aguien
    client.on('mensajePrivado', data => {

        //Persona que envía el mensaje
        let persona = usuarios.getPersona(client.id);

        //Emitir el mensaje a la persona que lo va a recibir por medio del ID [data.para]
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});