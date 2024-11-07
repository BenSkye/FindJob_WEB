import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA4bbjitdsaz-P0yG1bVdyiUS3f57cNw4o",
  authDomain: "mercibakery-3697b.firebaseapp.com",
  projectId: "mercibakery-3697b",
  storageBucket: "mercibakery-3697b.appspot.com",
  messagingSenderId: "1098507150904",
  appId: "1:1098507150904:web:6e2580ec320dd4026a28cd",
  measurementId: "G-SNQNQGPFWK"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };