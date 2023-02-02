import { doc, getDoc, updateDoc, } from 'firebase/firestore';
import { ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { dbFirestore, dbStorage, refCarruselesDb } from '../firebaseConfig/firebase';

export const getCarruseles = async () => {
  const docSnap = await getDoc(doc(dbFirestore, `${refCarruselesDb}/carrusel/`));
  if(!docSnap.exists()) return [];
  return docSnap.get('dataCarruseles');
}

export const updateCarruseles = async (dataCarruseles) => {
  // actualizar el documento en la coleccion "carrusel"
  return updateDoc(doc(dbFirestore, `${refCarruselesDb}/carrusel`), {dataCarruseles});
}

export const setImageCarruselDb = (_pathFile, _file) => {
  // create a chil reference
  const imgASubirRef = ref(dbStorage, `${refCarruselesDb}/${_pathFile}`);
  // upload file
  return uploadBytesResumable(imgASubirRef, _file);
}

export const deleteImageCarruselDb = (_pathFile) => {
  // create a reference to the file to delete
  const imgASubirRef = ref(dbStorage, `${refCarruselesDb}/${_pathFile}`);
  // delete file
  return deleteObject(imgASubirRef);
}
