import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import { accessDisabled } from 'assets/js/firestore/access.js';
/**
 *  Ponemos el acceso en estado disabled
 */
const auth = getAuth();
await accessDisabled();
signOut(auth).then(() => {
  /**
   * Cierre de la sesion del explorador
   */
  console.log('Sesion cerrada correctamente');
  //window.app.session.clear('muypayPayments');
  window.app.location.reload();
}).catch((error) => {
  // An error happened.
  console.log('Sesion no ha podido ser cerrada');
});