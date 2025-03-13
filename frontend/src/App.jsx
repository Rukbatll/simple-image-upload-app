import { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (png, jpg)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setSelectedImage (null);
  };

  return (
    <div className="App">
      <h1>Image Uploader</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {selectedImage ? (
        <div className="preview">
          <img
            src={selectedImage}
            alt="Uploaded Preview"
            style={{ maxWidth: '300px', margin: '10px' }}
          />
          <button onClick={handleClear}>Clear</button>
        </div>
      ) : (
        <p>No image uploaded yet.</p>
      )}
    </div>
  );
}

export default App;
