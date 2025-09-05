import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js'
const firebaseConfig = {
  apiKey: "AIzaSyCHVF8Vb2wkI2eS4fFCCB3Aln9gqvQ8KwU",
  authDomain: "jsystem-f4774.firebaseapp.com",
  projectId: "jsystem-f4774",
  storageBucket: "jsystem-f4774.appspot.com",
  messagingSenderId: "427317289326",
  appId: "1:427317289326:web:cc7a60b1198fda3e4c617f"
};
const firebase = initializeApp(firebaseConfig);
firebase.firestore().settings({ experimentalForceLongPolling: true });
const db = getFirestore(firebase);
const APP_BUSINESS_NAME = "JSYSTEM";
const APP_URL_PAGE = window.location.href.replace('/index.html', '');
const APP_URL_HOST = window.location.protocol + '//' + window.location.host;
const APP_FIREBASE_COLLECTION = 'cms_page'
const APP_FIREBASE_PAGE = 'jsystemManager';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
const spaRefDoc = doc(db, APP_FIREBASE_COLLECTION, APP_FIREBASE_PAGE);
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
            console.log("Carga de " + APP_FIREBASE_PAGE + " correcta!");
        }
        else {
            console.log("Carga de " + APP_FIREBASE_PAGE + " ha fallado en carga de modulos!");
        }
    } else {
        console.log("Carga de " + APP_FIREBASE_PAGE + " ha fallado en numero de modulos!");
    }
} else {
    console.log("Componente " + APP_FIREBASE_PAGE + " no existe!");
}
document.getElementById('app-loader').classList.add("w3-hide");