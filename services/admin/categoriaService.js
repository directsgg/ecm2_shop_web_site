import { doc, updateDoc, deleteDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { dbFirestore, dbStorage, refCategoriasDb } from '../firebaseConfig/firebase';

export const getCategorias = async () => {
  const docsSnap = await getDocs(collection(dbFirestore, refCategoriasDb));
  if(docsSnap.empty) return [];
  return docsSnap.docs.map(
    (docSnap) => ({
    ...docSnap.data(), id: docSnap.id
    })
  );
}

export const setCategoria = (data) => {
  // add a new document with a generated id
  delete data.id;
  return addDoc(collection(dbFirestore, refCategoriasDb), data);
}

export const deleteCategoria = (idCategoria) => {
  // delete document with id
  return deleteDoc(doc(dbFirestore, `${refCategoriasDb}/${idCategoria}`));
}

export const updateCategoria = (data) => {
  const idCategoria = data.id;
  delete data.id;
  const categoriaRef = doc(dbFirestore, `${refCategoriasDb}/${idCategoria}`);
  // set data
  return updateDoc(categoriaRef, data);
}

export const setImageCategoriaDb = (_pathFile, _file) => {
  // create a chil reference
  const imgASubirRef = ref(dbStorage, `${refCategoriasDb}/${_pathFile}`);
  // upload file
  return uploadBytesResumable(imgASubirRef, _file);
}

export const deleteImageCategoriaDb = (_pathFile) => {
  // create a reference to the file to delete
  const imgAEliminarRef = ref(dbStorage, `${refCategoriasDb}/${_pathFile}`);
  // delete file
  return deleteObject(imgAEliminarRef);
}
