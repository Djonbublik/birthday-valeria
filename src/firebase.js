import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyADJXWk9raOETc9tbFvVHf8eqNIe37aQzM",
  authDomain: "birthday-valery.firebaseapp.com",
  projectId: "birthday-valery",
  storageBucket: "birthday-valery.firebasestorage.app",
  messagingSenderId: "260476290015",
  appId: "1:260476290015:web:04424ec89313b4012a7a6a"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
