import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Requirement: Implement lazy loading/debounce to optimize search efficiency
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Requirement: Search should only trigger after 3 characters
      if (query.trim().length >= 3) {
        fetchStudents(query);
      } else {
        setResults([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchStudents = async (searchTerm) => {
    setLoading(true);
    try {
      // Requirement: RESTful API call to the Node.js backend
      const response = await fetch(`http://localhost:5000/api/students/search?q=${searchTerm}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Bonus: Helper function to highlight matching text
  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} style={{ backgroundColor: '#fef08a', padding: '0 2px', borderRadius: '2px' }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
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
        
        {loading && <div className="loader">Searching...</div>}

        {/* Requirement: Dropdown list displaying up to 5 matching students */}
        {results.length > 0 && (
          <ul className="dropdown">
            {results.map((student) => (
              <li key={student.rollNumber} onClick={() => {
                setSelectedStudent(student);
                setResults([]); // Close dropdown
                setQuery('');   // Reset search
              }}>
                <div className="result-item">
                  <span className="name">{highlightMatch(student.name, query)}</span>
                  <span className="roll">Roll: {student.rollNumber}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edge Case: No results found */}
        {query.length >= 3 && !loading && results.length === 0 && (
          <div className="no-results">No students found matching "{query}"</div>
        )}
      </div>

      {/* Requirement: Display full details when a student is selected */}
      {selectedStudent && (
        <div className="student-card">
          <div className="card-header">
            <h2>Student Profile</h2>
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
          </div>
          <div className="card-body">
            <p><strong>Full Name:</strong> {selectedStudent.name}</p>
            <p><strong>Class:</strong> {selectedStudent.class}</p>
            <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;