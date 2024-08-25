import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async () => {
    try {
      setError("");
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData.data) {
        throw new Error("JSON must contain a 'data' array.");
      }

      const res = await axios.post("http://localhost:3000/bfhl", parsedData);
      setResponse(res.data);
      setShowDropdown(true);
    } catch (err) {
      setError(err.message || "Invalid JSON");
      setShowDropdown(false);
    }
  };

  const handleDropdownChange = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedOptions(selectedValues);
  };

  const renderResponse = () => {
    if (!response) return null;
    const filteredResponse = {};
    selectedOptions.forEach((option) => {
      filteredResponse[option] = response[option];
    });
    return (
      <div>
        <h3>Response</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Input</h1>
      <textarea
        rows="6"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON like { "data": ["A","C","z"] }'
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showDropdown && (
        <div>
          <h3>Select Data to Display</h3>
          <select multiple={true} onChange={handleDropdownChange}>
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}
      {renderResponse()}
    </div>
  );
}

export default App;
