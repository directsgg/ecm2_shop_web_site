import { collection, getDocs } from 'firebase/firestore';
import { dbFirestore, refCategoriasDb } from '../firebaseConfig/firebase';

export const getCategorias = async () => {
  const docsSnap = await getDocs(collection(dbFirestore, refCategoriasDb));
  if(docsSnap.empty) return [];
  return docsSnap.docs.map(
    (docSnap) => ({
    ...docSnap.data(), id: docSnap.id
    })
  );
}
