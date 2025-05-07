import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const messagesCollection = collection(db, 'messages');

export const addMessage = async (message) => {
  try {
    const docRef = await addDoc(messagesCollection, {
      ...message,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

export const subscribeToMessages = (callback) => {
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    callback(messages);
  });
}; 