import React, { useState} from 'react';
import { getDatabase, ref, set,  onValue } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
//Configuração do firebase aqui
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase();


function App() {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const filenameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    // Fazendo o upload do arquivo para o Firebase Storage
  const fileRef = storageRef(storage, 'files/' + file.name);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  const fileInfo = {
    name: file.name,
    type: file.type,
    url: url,  // Adicionando o URL do arquivo
  };

  set(ref(db, 'files/' + filenameWithoutExtension), fileInfo);    
};
  const [fileData, setFileData] = useState(null);

  const handleFetchData = () => {
    const fileRef = ref(db, 'files');
    onValue(fileRef, (snapshot) => {
      const data = snapshot.val();
      setFileData(data);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
     <button onClick={handleFetchData}>Buscar Dados</button>
      {fileData && 
        Object.entries(fileData).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>Nome: {value.name}</p>
            <p>Tipo: {value.type}</p>
            <p>URL: <a href={value.url} target="_blank" rel="noopener noreferrer">{value.url}</a></p>
          </div>
        ))
      }
    </div>
  );
}

export default App;
