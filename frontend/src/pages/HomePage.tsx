import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>NASHTY OS</h1>
      <p>Select a module to start:</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1rem' }}>
          <Link to="/pos" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.2rem' }}>
            🏪 POS Terminal
          </Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link to="/kds" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.2rem' }}>
            👨‍🍳 Kitchen Display System (KDS)
          </Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link to="/backoffice" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.2rem' }}>
            📊 Backoffice Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
