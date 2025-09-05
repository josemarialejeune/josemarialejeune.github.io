/**
 *  Modulo de gestion de la base de datos Firestore -- area de usuario
 *  Requiere que se haya inicializado Firebase
 */
export { usrSet };
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
 * @name usrSet
 * @description Metodo para crear un documento en la coleccion usr
 */
async function usrSet() {
    /**
     *  Metodo para crear un documento en la coleccion usr
     */
    /**
     * coleccion usr 
     */
    const user = JSON.parse(window.app.session.get(USER, APP_PREFIX));
    if (!user || typeof user !== OBJECT || user.uid === null) { return false; }
    const userRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR, user.uid);
    const userSnap = await getDoc(userRefDoc);
    if (!userSnap.exists()) {
        await setDoc(doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR, user.uid), {enabled:true});
    }
    /**
     * coleccion usr_data
     */
    const userDataRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_DATA, user.uid);
    const userDataSnap = await getDoc(userDataRefDoc);
    if (!userDataSnap.exists()) {
        let ref = new Object();
        ref.enabled = true;
        ref.data = new Object();
        ref.data.email = user.email;
        ref.data.verified = user.emailVerified;
        ref.data.name = user.displayName;
        ref.state = new Object();
        if(ref.data.verified){ref.state.active = true;}
        else{ref.state.active = false;}
        ref.state.block = false;
        await setDoc(doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_DATA, user.uid), ref);
    }
    /**
     * coleccion usr_google
     */
     const userGoogleRefDoc = doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_GOOGLE, user.uid);
     const userGoogleSnap = await getDoc(userGoogleRefDoc);
     if (!userGoogleSnap.exists()) {
         if(user.providerData[0].providerId == GOOGLE_COM){
            await setDoc(doc(FIRESTORE_DB, FIRESTORE_COLLECTION_USR_GOOGLE, user.uid), user.providerData[0]);
         }
     }
     return true;
};