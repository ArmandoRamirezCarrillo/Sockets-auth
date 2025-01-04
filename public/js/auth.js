const miFormulario = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};
    for (let elemento of miFormulario.elements) {
        if(elemento.name.length > 0){
            formData[elemento.name] = elemento.value
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'ontent-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if(msg ){
            return console.error(msg);
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => console.log(err))
})

function handleCredentialResponse(response) {
    
    const body = {id_token: response.credential};
    fetch(url + "google",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({token}) => {
            localStorage.setItem('token',token);
            window.location = 'chat.html';
        })
        .catch(console.warn)

}

function signOut() {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'),done => {
        localStorage.clear();
        location.reload();
    });
}