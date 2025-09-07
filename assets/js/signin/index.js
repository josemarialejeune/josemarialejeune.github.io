import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import { accessSet } from 'https://jsystemmicroservices.com/assets/js/firestore/access.js';
import { usrSet } from 'https://jsystemmicroservices.com/assets/js/firestore/user.js';
import { setPage, setScript } from 'https://jsystemmicroservices.com/assets/js/module/cms.js';
const provider = new GoogleAuthProvider();
const auth = getAuth();
const jSystemManager = 'jSystemManager';
signInWithPopup(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    /**
     * Carga en la sesion del explorador
     */
    window.app.session.init(jSystemManager);
    window.app.session.set('credential', JSON.stringify(credential), jSystemManager);
    window.app.session.set('user', JSON.stringify(result.user), jSystemManager);
    let imageUrl = result.user.photoURL;
    let userName = result.user.displayName;
    /**
     *  Procesamos la solicitud de autenticacion de Google
    */
    usrSet();
    accessSet();
    /**
     * Ajustes de la pantalla
     *  Inicializamos el documento html  - setScript
     *  Cargamos la pagina jsystemManagerClient - setPage
     */
    setScript("jsystemManagerPortalInitialize");
    setPage("jsystemManagerPortal");
    /**
     *  Usuario autenticado 
     *  Imagen y nombre del usuario en el sidebar
     */
    document.getElementById('app-main-nav-avatar-image').src= imageUrl;
    document.getElementById('app-main-nav-avatar-name').innerHTML= userName;
}).catch((error) => {
    window.app.session.init(jSystemManager);
    window.app.session.set('error', JSON.stringify(error), jSystemManager);
});