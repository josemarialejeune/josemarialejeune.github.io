import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import { accessDisabled } from 'https://jsystemmicroservices.com/assets/js/firestore/access.js';
import { setPage, setScript } from 'https://jsystemmicroservices.com/assets/js/module/cms.js';
/**
 *  Ponemos el acceso en estado disabled
 */
const auth = getAuth();
const jSystemManager = 'jSystemManager';
await accessDisabled();
signOut(auth).then(() => {
  /**
   * Cierre de la sesion del explorador
   */
  console.log('Sesion cerrada correctamente');
  /**
    * Ajustes de la pantalla
    *  Inicializamos el documento html  - setScript
    *  Cargamos la pagina jsystemManager - setPage
  */
    setScript("jsystemManagerPortalInitialize");
    setPage("jsystemManagerPortal");
  /**
   * Eliminamos la sesion del explorador
  */
  window.app.session.erase(jSystemManager);
}).catch((error) => {
  // An error happened.
  console.log('Sesion no ha podido ser cerrada');
});