/**
 *  Modulo de gestion de la base de datos Firestore -- cms
 *  se inicializa Firebase
 */
export { setPage, setModule, setScript };
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';
import { getFirestore,  doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js';
const firebaseConfig = {
  apiKey: "AIzaSyCHVF8Vb2wkI2eS4fFCCB3Aln9gqvQ8KwU",
  authDomain: "jsystem-f4774.firebaseapp.com",
  projectId: "jsystem-f4774",
  storageBucket: "jsystem-f4774.appspot.com",
  messagingSenderId: "427317289326",
  appId: "1:427317289326:web:cc7a60b1198fda3e4c617f"
};
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const APP_BUSINESS_NAME = "JSYSTEM";
const APP_URL_PAGE = window.location.href.replace('/index.html', '');
const APP_URL_HOST = window.location.protocol + '//' + window.location.host;
const APP_FIREBASE_COLLECTION_PAGE = 'cms_page';
const APP_FIREBASE_COLLECTION_MODULE = 'cms_module';
const APP_FIREBASE_COLLECTION_SCRIPT = 'cms_script';
const APP_FIREBASE_PAGE_DEFAULT = 'jsystemManager';
/**
 * SetPage : Carga de una pagina del CMS en el documento HTML 
 * @param {*} page 
 */
async function setPage(page){
    if(page === null || !is_string(page) || !page.length) page = APP_FIREBASE_PAGE_DEFAULT;
    const spaRefDoc = doc(db, APP_FIREBASE_COLLECTION_PAGE, page);
    const spaSnap = await getDoc(spaRefDoc);
    if (spaSnap.exists()) {
        const spaComponents = spaSnap.data().components.length;
        let spaToBuild = [];
        if (spaComponents) {
            for (let i = 0; i < spaComponents; i++) {
                let toBuild = new Object();
                let componentSnap = await getDoc(spaSnap.data().components[i]);
                if ((componentSnap.data().data !== null && typeof componentSnap.data().data === 'string') &&
                    (componentSnap.data().template !== null && typeof componentSnap.data().template === 'string')) {
                    toBuild.type = 'data';
                    toBuild.template = componentSnap.data().template;
                    toBuild.data = componentSnap.data().data;
                    spaToBuild[i] = toBuild;
                }
                else if (componentSnap.data().event !== null && typeof componentSnap.data().event === 'string') {
                    toBuild.type = 'event';
                    toBuild.event = componentSnap.data().event;
                    spaToBuild[i] = toBuild;
                }
                else if (componentSnap.data().script !== null && typeof componentSnap.data().script === 'string') {
                    toBuild.type = 'script';
                    toBuild.script = componentSnap.data().script;
                    spaToBuild[i] = toBuild;
                }
                else if (componentSnap.data().view !== null && typeof componentSnap.data().view === 'string') {
                    toBuild.type = 'view';
                    toBuild.view = componentSnap.data().view;
                    spaToBuild[i] = toBuild;
                }
            }
            if (spaToBuild.length) {
                app_build(JSON.stringify(spaToBuild));
                console.log("Carga de " + page + " correcta!");
            }
            else {
                console.log("Carga de " + page + " ha fallado en la carga de componentes!");
            }
        } else {
            console.log("Carga de " + page + " ha fallado en el numero de componentes!");
        }
    } else {
        console.log("Pagina " + page + " no existe!");
    }
}
/**
 * SetModule : Carga de un modulo del CMS en el documento HTML con app_build
 * @param {*} module 
 */
async function setModule(module){
    if(module === null || !is_string(module) || !module.length) return false;
    const spaRefDoc = doc(db, APP_FIREBASE_COLLECTION_MODULE, module);
    const spaSnap = await getDoc(spaRefDoc);
    if (spaSnap.exists()) {
        const spaComponents = spaSnap.data().components.length;
        let spaToBuild = [];
        if (spaComponents) {
            for (let i = 0; i < spaComponents; i++) {
                let toBuild = new Object();
                let componentSnap = await getDoc(spaSnap.data().components[i]);
                if ((componentSnap.data().data !== null && typeof componentSnap.data().data === 'string') &&
                    (componentSnap.data().template !== null && typeof componentSnap.data().template === 'string')) {
                    toBuild.type = 'data';
                    toBuild.template = componentSnap.data().template;
                    toBuild.data = componentSnap.data().data;
                    spaToBuild[i] = toBuild;
                }
                else if (componentSnap.data().event !== null && typeof componentSnap.data().event === 'string') {
                    toBuild.type = 'event';
                    toBuild.event = componentSnap.data().event;
                    spaToBuild[i] = toBuild;
                }
                else if (componentSnap.data().script !== null && typeof componentSnap.data().script === 'string') {
                    toBuild.type = 'script';
                    toBuild.script = componentSnap.data().script;
                    spaToBuild[i] = toBuild;
                }
                else if (componentSnap.data().view !== null && typeof componentSnap.data().view === 'string') {
                    toBuild.type = 'view';
                    toBuild.view = componentSnap.data().view;
                    spaToBuild[i] = toBuild;
                }
            }
            if (spaToBuild.length) {
                app_build(JSON.stringify(spaToBuild));
                console.log("Carga de " + module + " correcta!");
            }
            else {
                console.log("Carga de " + module + " ha fallado en la carga de componentes!");
            }
        } else {
            console.log("Carga de " + module + " ha fallado en el numero de componentes!");
        }
    } else {
        console.log("Modulo " + module + " no existe!");
    }
}
/**
 * SetScript : Carga y ejecucion de un script JS del CMS en el documento HTML con app_script 
 * @param {*} script 
 */
async function setScript(script){
    if(script === null || !is_string(script) || !script.length) return false;
    const spaRefDoc = doc(db, APP_FIREBASE_COLLECTION_SCRIPT, module);
    const spaSnap = await getDoc(spaRefDoc);
    if (spaSnap.exists()) {
        if (componentSnap.data().code !== null && typeof componentSnap.data().code === 'string' && componentSnap.data().code.length > 0 ){
            if (componentSnap.data().parent !== null && typeof componentSnap.data().parent === 'string' && componentSnap.data().parent.length > 0 ){ 
                app_script(componentSnap.data().code,componentSnap.data().parent);  
            }
            else app_script(componentSnap.data().code);
        }
        else {
            console.log("Script " + script + " erroneo!");
        }
    } else {
        console.log("Script " + script + " no existe!");
    }
}
