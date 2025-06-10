import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFDslTls3dRQtL6wWmw2QK0AxAxVKH0R8",
  authDomain: "jnanasetu-bfc83.firebaseapp.com",
  projectId: "jnanasetu-bfc83",
  storageBucket: "jnanasetu-bfc83.firebasestorage.app",
  messagingSenderId: "975294763807",
  appId: "1:975294763807:web:326d542411693a7be5962a",
  measurementId: "G-R0QTP0BXWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app; 