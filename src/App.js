import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setShowDropdown(false);

    try {
      // Log input before parsing
      console.log("Input JSON String:", jsonInput);
  
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);
      console.log("Parsed JSON Data:", parsedData);
  
      // Call the REST API
      const res = await axios.post('https://bajaj-backend-bfhl.onrender.com', parsedData); // Corrected URL
      setResponse(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      setError('Invalid JSON input. Please check your format.');
    }
  };

  const handleDropdownChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;

    let result = {};
    if (selectedOptions.includes('Numbers')) {
      result.numbers = numbers;
    }
    if (selectedOptions.includes('Alphabets')) {
      result.alphabets = alphabets;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      result.highest_lowercase_alphabet = highest_lowercase_alphabet;
    }

    return (
      <div>
        <h2>Response:</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>21BCI0206</h1> 
      <form onSubmit={handleSubmit}>
        <input
          value={jsonInput}
          onChange={handleJsonChange}
          style={{height:40,width:500}}
        />
        <br/>
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showDropdown && (
        <select multiple onChange={handleDropdownChange}>
          <option value="Alphabets">Alphabets</option>
          <option value="Numbers">Numbers</option>
          <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
        </select>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;
