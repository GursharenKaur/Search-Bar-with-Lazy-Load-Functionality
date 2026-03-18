import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounce Logic: Wait 300ms after user stops typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        fetchStudents(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchStudents = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/students/search?q=${searchTerm}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="App">
      <h1>Student Search Portal</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name (min. 3 characters)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {loading && <p>Searching...</p>}

        {/* Dropdown Results */}
        {results.length > 0 && (
          <ul className="dropdown">
            {results.map((student) => (
              <li key={student.rollNumber} onClick={() => {
                setSelectedStudent(student);
                setResults([]);
                setQuery('');
              }}>
                {student.name} (Roll: {student.rollNumber})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Student Details Display */}
      {selectedStudent && (
        <div className="student-card">
          <h2>Student Details</h2>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Class:</strong> {selectedStudent.class}</p>
          <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
          <button onClick={() => setSelectedStudent(null)}>Clear</button>
        </div>
      )}
    </div>
  );
}

export default App;