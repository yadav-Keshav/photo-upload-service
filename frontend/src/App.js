
import './App.css';
import { useState } from 'react';
import axios from 'axios';
function App() {
  const [selectedFile, setSelectedFile] = useState();
  const submitHandler = async (e) => {
    const formData = new FormData();
    formData.append("photo", selectedFile);
    e.preventDefault();
    const { data } = await axios.post("http://localhost:3003/upload", formData);
    console.log(data);
  }
  return (
    <div className="App">
      <form>
        <input type="file" id="myFile" name="image" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={(e) => submitHandler(e)} >Submit</button>
      </form>
    </div>
  );
}

export default App;
