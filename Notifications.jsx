import { useState, useEffect } from 'react';
import '../styles/Notifications.css';

const Notifications = ({ notifications = [] }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Update unread count when new notifications arrive
    setUnreadCount(notifications.length);
    
    // Mark as read after 5 seconds
    const timeout = setTimeout(() => {
      setUnreadCount(0);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [notifications.length]);
  
  if (notifications.length === 0) {
    return (
      <div className="notifications-empty">
        <p>No new notifications</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      {unreadCount > 0 && (
        <div className="unread-banner">
          <span>{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</span>
          <button onClick={() => setUnreadCount(0)}>Mark all as read</button>
        </div>
      )}
      
      <ul className="notifications-list">
        {notifications.map((notification) => (
          <li key={notification.id} className="notification-item">
            <div className="notification-content">
              <p>{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;