import { doc, updateDoc, deleteDoc, addDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { dbFirestore, dbStorage, refProductosDb, refIdProductosDb } from '../firebaseConfig/firebase';

export const getProductos = async () => {
  const docsSnap = await getDocs(collection(dbFirestore, refProductosDb));
  if(docsSnap.empty) return [];
  return docsSnap.docs.map(
    (docSnap) => ({
    ...docSnap.data(), id: docSnap.id
    })
  );
}

export const setProducto = (data) => {
  // add a new document with a generated id
  delete data.id;
  const urlNormalize = data.nombre.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,"").replace(/ /g,'-',).replace(/\//g,'-');
  // get a new write batch
  const batch = writeBatch(dbFirestore);
  // set the value of 'refProductsDb'
  const productoRef = doc(dbFirestore, `${refProductosDb}/${urlNormalize}`);
  batch.set(productoRef, data);

  // add a new document whit generated id 'refIdProductosDb'
  const idProductoRef = doc(collection(dbFirestore, refIdProductosDb));
  batch.set(idProductoRef, {id_producto: urlNormalize});

  return batch.commit();
}

export const deleteProducto = (idProducto) => {
  // delete document with id
  return deleteDoc(doc(dbFirestore, `${refProductosDb}/${idProducto}`));
}

export const updateProducto = (data) => {
  const idProducto = data.id;
  delete data.id;
  const productoRef = doc(dbFirestore, `${refProductosDb}/${idProducto}`);
  // set data
  return updateDoc(productoRef, data);
}

export const setImageProductoDb = (_pathFile, _file) => {
  // create a chil reference
  const imgASubirRef = ref(dbStorage, `${refProductosDb}/${_pathFile}`);
  // upload file
  return uploadBytesResumable(imgASubirRef, _file);
}

export const deleteImageProductoDb = (_pathFile) => {
  // create a reference to the file to delete
  const imgAEliminarRef = ref(dbStorage, `${refProductosDb}/${_pathFile}`);
  // delete file
  return deleteObject(imgAEliminarRef);
}
