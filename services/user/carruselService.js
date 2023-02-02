import { doc, getDoc,} from 'firebase/firestore';
import { dbFirestore, refCarruselesDb } from '../firebaseConfig/firebase';

export const getCarruseles = async () => {
  const docSnap = await getDoc(doc(dbFirestore, `${refCarruselesDb}/carrusel/`));
  
  if(!docSnap.exists()) return [];
  return docSnap.get('dataCarruseles');
}
