import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { dbFirestore, refPedidosDb } from '../firebaseConfig/firebase';

export const getPedidos = async () => {
  const docsSnap = await getDocs(collection(dbFirestore, refPedidosDb));
  if(docsSnap.empty) return [];
  return docsSnap.docs.map(
    (docSnap) => ({
    ...docSnap.data(), id: docSnap.id
    })
  );
}

export const deletePedido = async (idPedido) => {
  // delete document with id
  return deleteDoc(doc(dbFirestore, `${refPedidosDb}/${idPedido}`));
}
