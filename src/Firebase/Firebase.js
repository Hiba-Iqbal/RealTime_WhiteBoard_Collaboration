// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
	apiKey: "AIzaSyBmvJv4dNgroF6FwVyxc93levKovOSBnsw",
	authDomain: "collaborative-whiteboard-98ceb.firebaseapp.com",
	projectId: "collaborative-whiteboard-98ceb",
	storageBucket: "collaborative-whiteboard-98ceb.appspot.com",
	messagingSenderId: "1039421402782",
	appId: "1:1039421402782:web:addd9c26b41a75df5a958f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
