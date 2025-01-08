const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");

const chatMensjaes = new ChatMensajes();

const socketController = async(socket = new Socket(), io) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        socket.disconnect();
    }
    //Agregar el usuario conectado
    chatMensjaes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensjaes.usuariosArr);
    socket.emit('recibir-mensjes', chatMensjaes.ultimos10);

    //Conectarlo a una sala especial
    socket.join(usuario.id);

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensjaes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensjaes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => {
        if(uid){
            //privado
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje});
        }else{
            chatMensjaes.enviarMensaje(usuario.id,usuario.nombre, mensaje);
            io.emit('recibir-mensajes',chatMensjaes.ultimos10);
        }
        
    })
}

module.exports = {
    socketController
}