import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Navigation.css';

const Navigation = () => {
  const [notifications, setNotifications] = useState(0);
  
  useEffect(() => {
    // This would connect to your notification service
    const mockNotificationInterval = setInterval(() => {
      setNotifications(prev => prev + 1);
    }, 30000); // Simulating a notification every 30 seconds
    
    return () => clearInterval(mockNotificationInterval);
  }, []);

  return (
    <nav className="navigation">
      <div className="logo">
        <h1>Dashboard</h1>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/weather" className={({isActive}) => isActive ? 'active' : ''}>
            Weather
          </NavLink>
        </li>
        <li>
          <NavLink to="/crypto" className={({isActive}) => isActive ? 'active' : ''}>
            Crypto
          </NavLink>
        </li>
      </ul>
      <div className="notification-badge">
        {notifications > 0 && <span className="badge">{notifications}</span>}
        <i className="notification-icon">🔔</i>
      </div>
    </nav>
  );
};

export default Navigation;