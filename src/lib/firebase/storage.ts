// src/lib/firebase/storage.ts
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { getFirebaseStorage } from './config';

export async function uploadFile(
  path: string,
  file: File,
  metadata?: { contentType?: string }
): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);

  try {
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFile(path: string): Promise<void> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);

  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
