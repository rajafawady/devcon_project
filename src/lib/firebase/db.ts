// src/lib/firebase/db.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  type QueryConstraint
} from 'firebase/firestore';
import { getFirebaseDb } from './config';

export async function getCollection(
  collectionName: string,
  constraints?: QueryConstraint[]
) {
  const db = getFirebaseDb();
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints
      ? query(collectionRef, ...constraints)
      : collectionRef;
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}

export async function getDocument(collectionName: string, id: string) {
  const db = getFirebaseDb();
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function addDocument(
  collectionName: string,
  data: any,
  documentId?: string
) {
  const db = getFirebaseDb();
  try {
    if (documentId) {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, data);
      return documentId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: any
) {
  const db = getFirebaseDb();
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    throw error;
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  const db = getFirebaseDb();
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
}

export function listenToCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  onUpdate: (data: T[]) => void
): () => void {
  const db = getFirebaseDb();
  const collectionRef = collection(db, collectionName);
  const q = constraints.length
    ? query(collectionRef, ...constraints)
    : collectionRef;

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
    onUpdate(data);
  });

  return unsubscribe;
}

export function listenToDocument<T>(
  collectionName: string,
  id: string,
  onUpdate: (data: T | null) => void
): () => void {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, id);

  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    const data = docSnap.exists()
      ? ({ id: docSnap.id, ...docSnap.data() } as T)
      : null;
    onUpdate(data);
  });

  return unsubscribe;
}
