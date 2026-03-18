# Student Search Portal (SPA)

A high-performance Single Page Application (SPA) built with **React.js** and **Node.js/Express**. This application features a real-time search bar with lazy loading, debouncing, and a RESTful API backend.

## Features

- **Lazy Loading & Debouncing**: Search only triggers after 3 characters are typed, and uses a 300ms debounce to minimize API calls.
- **Real-time Suggestions**: A dropdown displays the top 5 matching results dynamically as you type.
- **Match Highlighting**: Visual feedback by highlighting the matching string within the search results.
- **Case-Insensitive Search**: Handles queries regardless of capitalization (e.g., "jas" matches "Jaspreet").
- **Responsive Design**: Fully functional and styled for both Desktop and Mobile views.
- **RESTful Architecture**: Backend API serves data from a local JSON source without using NoSQL/MongoDB.

## Tech Stack

- **Frontend**: React.js, CSS3 (Flexbox/Grid)
- **Backend**: Node.js, Express.js
- **Data**: Local JSON Storage (File System)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd student-search-app
