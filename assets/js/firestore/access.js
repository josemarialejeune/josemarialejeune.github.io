/**
 *  Modulo de gestion de la base de datos Firestore -- accesos
 *  Requiere que se haya inicializado Firebase
 */
export { accessDisabled, accessEnabled, accessSet };
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js';
const ACCESS = 'access';
const APP_PREFIX = 'muypayPayments';
const CREDENTIAL = 'credential';
const DATA = 'data';
const GOOGLE_COM = 'google.com';
const OBJECT = 'object';
const USER = 'user';
const FIRESTORE_DB = getFirestore();
const FIRESTORE_COLLECTION_USR = 'usr';
const FIRESTORE_COLLECTION_USR_ACCESS = 'usr_access';
const FIRESTORE_COLLECTION_USR_DATA = 'usr_data';
const FIRESTORE_COLLECTION_USR_GOOGLE = 'usr_google';
const SUCCESS_ERROR_INTERNAL = { success: "error", internalError: true };
const SUCCESS_ERROR_TOKEN_EXISTS = { success: "error", tokenExists: true };
const SUCCESS_ERROR_USER_BLOCKED = { success: "error", userBlock: true };
const SUCCESS_ERROR_USER_DISABLED = { success: "error", userDisabled: true };
const SUCCESS_ERROR_USER_NOT_ACTIVE = { success: "error", userActive: false };
const SUCCESS_ERROR_USER_NOT_EXISTS = { success: "error", userExists: false };
const SUCCESS_OK = { success: "ok", enabled: true };
/**
 * @name accessDisabled
 * @description  Metodo que desactiva un acceso registrado
 */
async function accessDisabled() {
  /**
     * En el almacenamiento cargamos los datos de la sesion registrada
     */
  const access = JSON.parse(window.app.session.get(ACCESS, APP_PREFIX));
  if (!access || typeof access !== OBJECT || access.enabled === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  if (!access.enabled) { return responseSet(access); }
  /**
   * En el almacenamiento de la sesion cargamos los datos de usuario y acceso
   */
  const user = JSON.parse(window.app.session.get(USER, APP_PREFIX));
  if (!user || typeof user !== OBJECT || user.uid === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  /**
  * Validamos ahora la credencial recibida
  */
  const credential = JSON.parse(window.app.session.get(CREDENTIAL, APP_PREFIX));
  if (!credential || typeof credential !== OBJECT || credential.accessToken === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  /**
   * Comprobamos que el acceso se corresponde con el usuario y la credencial
   */
  if (access.userID != user.uid || access.tokenACCESS != credential.accessToken) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  /**
   *  Comprobamos el estado del acceso en la base de datos 
   */
  const userAccessRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_ACCESS, credential.accessToken);
  let userAccessSnap = await getDoc(userAccessRefDoc);
  if (!userAccessSnap.exists()) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  else {
    if (userAccessSnap.data().userID != access.userID || userAccessSnap.data().accessID != access.accessID) { return responseSet(SUCCESS_ERROR_INTERNAL); }
    access.enabled = false;
    access.timestampEnd = new Date().getTime();
    await updateDoc(doc(FIRESTORE_DB,FIRESTORE_COLLECTION_USR_ACCESS,credential.accessToken),
    {
      enabled: false,
      timestampEnd: access.timestampEnd
    });
    return responseSet(access);
  }
}
/**
 * @name  accessEnabled
 * @description  Metodo que desactiva un acceso registrado
 */
async function accessEnabled() {
  /**
   * En el almacenamiento cargamos los datos de la sesion registrada
   */
  const access = JSON.parse(window.app.session.get(ACCESS, APP_PREFIX));
  if (!access || typeof access !== OBJECT || access.enabled === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  if (!access.enabled) { return responseSet(access); }
  /**
   * En el almacenamiento de la sesion cargamos los datos de usuario y acceso
   */
  const user = JSON.parse(window.app.session.get(USER, APP_PREFIX));
  if (!user || typeof user !== OBJECT || user.uid === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  /**
  * Validamos ahora la credencial recibida
  */
  const credential = JSON.parse(window.app.session.get(CREDENTIAL, APP_PREFIX));
  if (!credential || typeof credential !== OBJECT || credential.accessToken === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  /**
   * Comprobamos que el acceso se corresponde con el usuario y la credencial
   */
  if (access.userID != user.uid || access.tokenACCESS != credential.accessToken) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  /**
   *  Comprobamos el estado del acceso en la base de datos 
   */
  const userAccessRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_ACCESS, credential.accessToken);
  const userAccessSnap = await getDoc(userAccessRefDoc);
  if (!userAccessSnap.exists()) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  else {
    if (userAccessSnap.data().userID != access.userID || userAccessSnap.data().accessID != access.accessID) { return responseSet(SUCCESS_ERROR_INTERNAL); }
    access.enabled = userAccessSnap.data().enabled;
    return responseSet(access);
  }
}
/**
 *  @name accessSet
 *  @description Metodo que registra en firestore un acceso de usuario validado por Google
 */
async function accessSet() {
  /**
   *  En el almacenamiento de sesion cargamos los datos de usuario
   */
  const user = JSON.parse(window.app.session.get(USER, APP_PREFIX));
  if (!user || typeof user !== OBJECT || user.uid === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  const userRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR, user.uid);
  const userSnap = await getDoc(userRefDoc);
  /**
   * Comprobamos que el usuario esta operativo (primer nivel de seguridad)
   */
  if (!userSnap.exists()) { return responseSet(SUCCESS_ERROR_USER_NOT_EXISTS); }
  if (userSnap.data().enabled === null || !userSnap.data().enabled) { return responseSet(SUCCESS_ERROR_USER_DISABLED); }
  /**
   * Comprobamos que en su data el estado es activo y sin bloqueo 
   */
  const userDataRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_DATA, user.uid);
  const userDataSnap = await getDoc(userDataRefDoc);
  if (!userDataSnap.exists()) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  if (userDataSnap.data().enabled === null || !userDataSnap.data().enabled) { return responseSet(SUCCESS_ERROR_USER_DISABLED); }
  if (userDataSnap.data().state === null || typeof userDataSnap.data().state !== OBJECT) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  if (userDataSnap.data().state.active === null || !userDataSnap.data().state.active) { return responseSet(SUCCESS_ERROR_USER_NOT_ACTIVE); }
  if (userDataSnap.data().state.block === null || userDataSnap.data().state.block) { return responseSet(SUCCESS_ERROR_USER_BLOCKED); }
  /**
  * Validamos ahora la credencial recibida
  */
  const credential = JSON.parse(window.app.session.get(CREDENTIAL, APP_PREFIX));
  if (!credential || typeof credential !== OBJECT || credential.accessToken === null) { return responseSet(SUCCESS_ERROR_INTERNAL); }
  const userAccessRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_ACCESS, credential.accessToken);
  const userAccessSnap = await getDoc(userAccessRefDoc);
  if (userAccessSnap.exists()) {
    /**
     * Situacion anomala el token no debe existir
     */
    return responseSet(SUCCESS_ERROR_TOKEN_EXISTS);
  }
  else {
    /**
     * Situacion correcta, se registra el acceso
     */
    const dataOK = {
      enabled: true,
      timestampInit: new Date().getTime(),
      tokenID: credential.idToken,
      userID: user.uid
    };
    await setDoc(doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_ACCESS, credential.accessToken), dataOK);
    dataOK.tokenACCESS = credential.accessToken;
    return responseSet(dataOK);
  }
}
/**
 * @name responseSet 
 * @param {*} data objeto respuesta
 * @description guarda en el almacenamiento local los datos del acceso recogidos en data 
 */
function responseSet(data) {
  if (data !== null && typeof data === OBJECT) {
    window.app.session.set(ACCESS, JSON.stringify(data), APP_PREFIX);
  }
  else {
    window.app.session.set(ACCESS, JSON.stringify(SUCCESS_ERROR_INTERNAL), APP_PREFIX);
  }
  return true;
}