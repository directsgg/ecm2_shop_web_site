import { doc, setDoc } from 'firebase/firestore';
import { dbFirestore, refPedidosDb } from '../firebaseConfig/firebase';

export const setPedido = (data) => {
  const idPedido = Date.now();
  // add a new document in collection 'pedidos'
  return setDoc(doc(dbFirestore, `${refPedidosDb}/${idPedido}`), data);
}