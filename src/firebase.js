import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzriFAh7IPIz6hdzcwAg1YY6n0SEXLibQ",
  authDomain: "rating-system-bb6f4.firebaseapp.com",
  databaseURL: "https://rating-system-bb6f4-default-rtdb.firebaseio.com",
  projectId: "rating-system-bb6f4",
  storageBucket: "rating-system-bb6f4.appspot.com",
  messagingSenderId: "98563972615",
  appId: "1:98563972615:web:41cbac18793effd8ff54a2",
  measurementId: "G-QH4FSBR59L"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);

export { database, auth };
