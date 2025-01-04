const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");

const socketController = async(socket = new Socket()) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        socket.disconnect();
    }
    console.log('Se conecto', usuario.nombre);
}

module.exports = {
    socketController
}