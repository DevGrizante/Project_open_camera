import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "KVqS5caHCVt39zVuXRBbiEPeMhRXM7qnWfaFhiAY",
  authDomain: "data-open-camera.firebaseapp.com",
  databaseURL: "https://data-open-camera-default-rtdb.firebaseio.com/", 
  projectId: "data-open-camera",
  storageBucket: "data-open-camera.appspot.com",
  messagingSenderId: "437399094208",
  appId: "1:437399094208:web:9c25cc191ff7a49f0f7e25"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const listenToData = (path: string | undefined, callback: (arg0: null) => void) => {
  const dataRef = ref(database, path)
  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val()) 
    } else {
      console.log("No data available at " + path)
      callback(null) 
    }
  })
}
