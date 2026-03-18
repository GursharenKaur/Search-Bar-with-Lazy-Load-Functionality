import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- State Management ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Requirement: Theme toggle state with LocalStorage persistence
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // --- Effects ---

  // Handle Theme Changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Requirement: Lazy Loading / Debounce Logic
  // Search only triggers after 3 characters and waits 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 3) {
        fetchStudents(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // --- API Logic ---
  const fetchStudents = async (searchTerm) => {
    setLoading(true);
    try {
      // Requirement: RESTful API call to the Node.js backend
      const response = await fetch(`http://localhost:5000/api/students/search?q=${searchTerm}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Bonus: Case-insensitive highlight matching text
  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="highlight-text">
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
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <h1>Student Search Portal</h1>
      
      <div className="search-container">
        {/* Requirement: Search Bar */}
        <input
          type="text"
          placeholder="Search by name (min. 3 characters)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {loading && <div className="loader">Searching...</div>}

        {/* Requirement: Dropdown list (up to 5 matching students) */}
        {results.length > 0 && (
          <ul className="dropdown">
            {results.map((student) => (
              <li key={student.rollNumber} onClick={() => {
                setSelectedStudent(student);
                setResults([]); // Close dropdown
                setQuery('');   // Reset search bar
              }}>
                <div className="result-item">
                  <span className="name">{highlightMatch(student.name, query)}</span>
                  <span className="roll">Roll: {student.rollNumber}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edge Case: Handling names with no matches */}
        {query.length >= 3 && !loading && results.length === 0 && (
          <div className="no-results">No students found for "{query}"</div>
        )}
      </div>

      {/* Requirement: Display full details upon selection */}
      {selectedStudent && (
        <div className="student-card">
          <div className="card-header">
            <h2>Student Profile</h2>
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
          </div>
          <div className="card-body">
            <p><strong>Full Name:</strong> {selectedStudent.name}</p>
            <p><strong>Class:</strong> Grade {selectedStudent.class}</p>
            <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;