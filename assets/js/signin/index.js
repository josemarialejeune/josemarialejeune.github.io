import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import { accessSet } from 'assets/js/firestore/access.js';
import { usrSet } from 'assets/js/firestore/user.js';
const provider = new GoogleAuthProvider();
const auth = getAuth();
const jSystem = 'jSystem';
signInWithPopup(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    /**
     * Carga en la sesion del explorador
     */
    window.app.session.init(jSystem);
    window.app.session.set('credential', JSON.stringify(credential), jSystem);
    window.app.session.set('user', JSON.stringify(result.user), jSystem);
    /**
     * Ajustes de la pantalla
     *  En boton app-main-header-access: quitar evento y ocultarlo
     *  Eliminamos los contenidos del menu y de las areas de contenidos
     */
    //window.app.dom.eventRemove('app-main-header-access','click');
    window.app.nodeLoad('app-main-header-access'); window.app.nodeClassAdd('w3-hide');
    window.app.empty('app-main-nav-menu');
    window.app.empty('app-main-content');
    window.app.empty('app-main-bottom');
    window.app.empty('app-script');
    /**
     *  Procesamos la solicitud de autenticacion de Google
     */
    usrSet();
    accessSet();
    /**
     *  Usuario autenticado 
     *  Imagen y nombre del usuario en el sidebar
     */
    window.app.nodeLoad('app-main-nav');
    let avatar = new Object();
    avatar.tag = "img";
    avatar.attr = new Object();
    avatar.attr.src = result.user.photoURL;
    avatar.attr.class = "w3-image w3-block w3-card w3-margin-top-tiny w3-margin-bottom-tiny w3-margin-auto-left-right";
    avatar.attr.style = "max-height:64px;max-width:64px;";
    window.app.nodeWrite(JSON.stringify(avatar), 1);
    let username = new Object();
    username.tag = "div";
    username.text = result.user.displayName;
    username.attr = new Object();
    username.attr.class = "w3-center w3-text-white w3-small w3-tiny-small";
    window.app.nodeWrite(JSON.stringify(username), 1);
    let button = new Object();
    button.tag = 'button';
    button.text = "Cerrar Sesión"
    button.attr = new Object();
    button.attr.id = "app-main-nav-signout";
    button.attr.onclick = "window.signoutEvent();"
    button.attr.class = "w3-btn w3-block w3-margin-top-tiny w3-margin-bottom-tiny w3-small w3-tiny-small w3-text-white w3-pointer";
    window.app.nodeWrite(JSON.stringify(button), 1);
}).catch((error) => {
    window.app.session.set('error', JSON.stringify(error), jSystem);
    window.app.nodeLoad('app-main-nav');
    let button = new Object();
    button.tag = 'button';
    button.text = "Cerrar Sesión"
    button.attr = new Object();
    button.attr.id = "app-main-nav-signout";
    button.attr.onclick = "window.signoutEvent();"
    button.attr.class = "w3-btn w3-block w3-margin-top-tiny w3-margin-bottom-tiny w3-small w3-tiny-small w3-text-white w3-pointer";
    window.app.nodeWrite(JSON.stringify(button), 1);
});