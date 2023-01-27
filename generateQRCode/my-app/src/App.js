import React, { useState } from 'react';
import './styles/main.css'

function App() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleChange = (event) => {
    setUrl(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://url-to-qr.onrender.com/qr-code/${url}`);
      const qrCode = await response.url;
      setQrCode(qrCode);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1 className="heading">URL to QR Code Generator</h1>
      <form onSubmit={handleSubmit} className='form'>
        <input type="text" value={url} onChange={handleChange} placeholder="Enter URL" className='input'/>
        <button type="submit" className='button'>Generate QR Code</button>
      </form>

      <div className="qr-code-container">
        {qrCode && <img src={qrCode} alt="QR Code" />}
      </div>

    </div>
  );
}

export default App;
