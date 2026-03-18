const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load Student Data from JSON
const getStudents = () => {
    const data = fs.readFileSync(path.join(__dirname, 'student_data.json'));
    return JSON.parse(data);
};

// Search Endpoint
app.get('/api/students/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    
    // Requirements: Search triggers only after 3 chars
    if (query.length < 3) {
        return res.json([]);
    }

    const students = getStudents();
    
    // Filter logic: Case-insensitive and matches anywhere in name
    const matches = students.filter(student => 
        student.name.toLowerCase().includes(query)
    );

    // Requirement: Display up to 5 matching students
    res.json(matches.slice(0, 5));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});