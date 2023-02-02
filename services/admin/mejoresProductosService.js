import { doc, updateDoc, deleteDoc, collection, getDocs, getDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { dbFirestore, dbStorage, refMejoresProductosDb, refIdMejoresProductosDb } from '../firebaseConfig/firebase';

/*export const getMejoresProductos = async () => {
  const docsSnap = await getDocs(collection(dbFirestore, refMejoresProductosDb));
  return docsSnap.docs.map(
    (docSnap) => ({
    ...docSnap.data(), id: docSnap.id
    })
  );
}*/

export const getMejoresProductos = async () => {
  const docSnap = await getDoc(doc(dbFirestore, `${refMejoresProductosDb}/mejores/`));
  console.log( docSnap.get('dataMejoresProductos'));
  return [];
}


export const updateMejoresProductos = async (dataMejoresProductos) => {
  // actualizar el documento en la coleccion "mejoresProductos"
  return updateDoc(doc(dbFirestore, `${refMejoresProductosDb}/mejores`), {dataMejoresProductos});
}

export const setMejorProducto = (data) => {
  // add a new document with a generated id
  delete data.id;
  const urlNormalize = data.nombre.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,"").replace(/ /g,'-',).replace(/\//g,'-');
  // get a new write batch
  const batch = writeBatch(dbFirestore);
  // set the value of 'refProductsDb'
  const productoRef = doc(dbFirestore, `${refMejoresProductosDb}/${urlNormalize}`);
  batch.set(productoRef, data);

  // add a new document whit generated id 'refIdMejoresProductosDb'
  const idProductoRef = doc(collection(dbFirestore, refIdMejoresProductosDb));
  batch.set(idProductoRef, {id_producto: urlNormalize});

  return batch.commit();
}

export const deleteMejorProducto = (idProducto) => {
  // delete document with id
  return deleteDoc(doc(dbFirestore, `${refMejoresProductosDb}/${idProducto}`));
}

export const updateMejorProducto = (data) => {
  const idProducto = data.id;
  delete data.id;
  const productoRef = doc(dbFirestore, `${refMejoresProductosDb}/${idProducto}`);
  // set data
  return updateDoc(productoRef, data);
}

export const setImageMejorProductoDb = (_pathFile, _file) => {
  // create a chil reference
  const imgASubirRef = ref(dbStorage, `${refMejoresProductosDb}/${_pathFile}`);
  // upload file
  return uploadBytesResumable(imgASubirRef, _file);
}

export const deleteImageMejorProductoDb = (_pathFile) => {
  // create a reference to the file to delete
  const imgAEliminarRef = ref(dbStorage, `${refMejoresProductosDb}/${_pathFile}`);
  // delete file
  return deleteObject(imgAEliminarRef);
}
