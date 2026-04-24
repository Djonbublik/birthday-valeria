import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyADJXWk9raOETc9tbFvVHf8eqNIe37aQzM",
  authDomain: "birthday-valery.firebaseapp.com",
  projectId: "birthday-valery",
  storageBucket: "birthday-valery.firebasestorage.app",
  messagingSenderId: "260476290015",
  appId: "1:260476290015:web:04424ec89313b4012a7a6a",
  databaseURL: "https://birthday-valery-default-rtdb.europe-west1.firebasedatabase.app"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
