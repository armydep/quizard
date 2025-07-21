import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import User from './pages/User';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw', // Ensure full viewport width
          margin: 0,      // Remove default margin
        }}
      >
        <Navbar />
        <main style={{ flex: 1, padding: '2rem', background: '#f7f7f7', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}