// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXXA9IS8r-q56L8r1ml4kf7zNEKEf86Rc",
  authDomain: "eroedevgt.firebaseapp.com",
  databaseURL: "https://eroedevgt.firebaseio.com",
  projectId: "eroedevgt",
  storageBucket: "eroedevgt.appspot.com",
  messagingSenderId: "1021624793166",
  appId: "1:1021624793166:web:e89791ecf88a22cda32b1f",
  measurementId: "G-0EVR787L76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
// get a reference to the firestore service
export const dbFirestore = getFirestore(app);
// get a reference to the storage service
export const dbStorage = getStorage(app);
// initialize firebase authentication and get a reference to the service
export const authFirebase = getAuth(app);

export const refCarruselesDb = 'carrusel_music_store';
export const refCategoriasDb = 'categoria_music_store';
export const refProductosDb = 'productos_music_store';
export const refIdProductosDb = 'id_productos_music_store';
export const refMejoresProductosDb = 'mejores_productos_music_store';
export const refPedidosDb = 'pedidos_music_store';