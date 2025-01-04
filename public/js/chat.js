const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//Validar el token del localstorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';
    if(token <= 10) throw new Error('No hay token en la aplicación');

    const resp = await fetch(url,{
        headers:{'x-token':token}
    })

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;
    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    socket.on('connect', () => console.log('sockets Online'));
    socket.on('disconnect', () => console.log('sockets Offline'));
    socket.on('recibir-mensajes', () => {
        //TODO
    });
    socket.on('usuarios-activos', () => {
        //TODO
    });
    socket.on('mensaje-privado', () => {
        //TODO
    });
}

const main = async() => {
    await validarJWT
}

main();