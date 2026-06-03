// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// We will build these next!
const UserPortal = () => <div style={{ padding: '2rem' }}><h2>Employee IT Portal</h2><p>Form coming soon...</p></div>;
const AdminDashboard = () => <div style={{ padding: '2rem' }}><h2>IT Support Dashboard</h2><p>Ticket table coming soon...</p></div>;

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <h2>Enterprise IT Support</h2>
          <div className="nav-links">
            <Link to="/">User Portal</Link>
            <Link to="/admin">IT Dashboard</Link>
          </div>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<UserPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;