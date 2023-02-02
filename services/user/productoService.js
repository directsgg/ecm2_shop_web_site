import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { dbFirestore, refProductosDb, refIdProductosDb } from '../firebaseConfig/firebase';

export const getProductos = async () => {
  const docsSnap = await getDocs(collection(dbFirestore, refProductosDb));
  if(docsSnap.empty) return [];
  return docsSnap.docs.map((_doc) => ({
    ..._doc.data(), id: _doc.id
  }));
}

export const getProductosPorCategoria = async (_categoria) => {
  // create a reference to the productos collection
  const productosRef = collection(dbFirestore, refProductosDb);
  // create a query against the collection
  const q = query(productosRef, where('categoria', '==', _categoria));
  // get data
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty) return [];
  return querySnapshot.docs.map((_doc) => ({
    ..._doc.data(), id: _doc.id
  }))
}

export const getMejoresProductos = async () => {
  // create a reference to the productos collection
  const productosRef = collection(dbFirestore, refProductosDb);
  // create a query against the collection
  const q = query(productosRef, where('mejorProducto', '==', true));
  // get data
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty) return [];
  return querySnapshot.docs.map((_doc) => ({
    ..._doc.data(), id: _doc.id
  }))
}

export const getOfertasProductos = async () => {
  // create a reference to the productos collection
  const productosRef = collection(dbFirestore, refProductosDb);
  // create a query against the collection
  const q = query(productosRef, where('porcentajeDescuento', '>', 0));
  // get data
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty) return [];
  return querySnapshot.docs.map((_doc) => ({
    ..._doc.data(), id: _doc.id
  }))
}

export const getAllProductosId = async () => {
  const data = await getDocs(collection(dbFirestore, refIdProductosDb));
  /*
  [
    { 
      params: {
        id: 'teclado-profesional'
      }
    },
  ]*/
  return data.docs.map((_doc) => {
    return {
      params: {
        id_producto: _doc.data().id_producto
      }
    }
  })
}

export const getProductoData = async (_id) => {
  //if(_id !== null)
  const _productosRef = collection(dbFirestore, refProductosDb);
  const docRef = doc(_productosRef, _id.toString());

  const docSnap = await getDoc(docRef);
  if(docSnap.exists()) {
    return {
      ...docSnap.data(), id: docSnap.id
    }
  } else {
    return undefined
  }
}