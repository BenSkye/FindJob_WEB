import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadImageToFirebase = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const uploadFileToFirebase = async (file: File, storagePath: string): Promise<string> => {
  try {
    // Create file reference
    const fileRef = ref(storage, `${storagePath}/${Date.now()}-${file.name}`);

    // Upload file
    const snapshot = await uploadBytes(fileRef, file);

    // Get download URL
    const url = await getDownloadURL(snapshot.ref);

    return url;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw error;
  }
};