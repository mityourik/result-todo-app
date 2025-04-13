import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyDRWG4s0_NCys_wwzETvMgiR3-a5DKrFCM',
    authDomain: 'resultproductsproj.firebaseapp.com',
    databaseURL: 'https://resultproductsproj-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: 'resultproductsproj',
    storageBucket: 'resultproductsproj.firebasestorage.app',
    messagingSenderId: '956263607918',
    appId: '1:956263607918:web:48bb7a05ffde1550c7807f',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
