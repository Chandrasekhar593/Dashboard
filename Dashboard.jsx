import { useState, useEffect } from 'react';
import WeatherWidget from '../components/WeatherWidget';
import CryptoWidget from '../components/CryptoWidget';
import Notifications from '../components/Notifications';
import { connectToSocket } from '../services/socketService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = connectToSocket();

    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 5));
    });

    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        // Simulate API calls
        const weatherResponse = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY');
        const weatherResult = await weatherResponse.json();
        
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1');
        const cryptoResult = await cryptoResponse.json();
        
        setWeatherData(weatherResult);
        setCryptoData(cryptoResult);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use mock data in case API calls fail
        setWeatherData({ 
          name: 'London', 
          main: { temp: 283.15, humidity: 70 }, 
          weather: [{ description: 'cloudy' }] 
        });
        setCryptoData([
          { id: 'bitcoin', name: 'Bitcoin', current_price: 63000 },
          { id: 'ethereum', name: 'Ethereum', current_price: 3400 }
        ]);
        setLoading(false);
      }
    };

    fetchInitialData();

    // Simulate WebSocket notifications
    const notificationInterval = setInterval(() => {
      const mockNotifications = [
        'Bitcoin price has increased by 5%',
        'Weather alert: Rain expected in your area',
        'Ethereum price has dropped by 3%',
        'New system update available'
      ];
      
      const randomNotification = {
        id: Date.now(),
        message: mockNotifications[Math.floor(Math.random() * mockNotifications.length)],
        timestamp: new Date().toISOString()
      };
      
      socket.emit('notification', randomNotification);
    }, 15000);

    return () => {
      socket.disconnect();
      clearInterval(notificationInterval);
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Weather Summary</h2>
          <WeatherWidget data={weatherData} minimal={true} />
        </div>
        
        <div className="dashboard-card">
          <h2>Crypto Summary</h2>
          <CryptoWidget data={cryptoData} minimal={true} />
        </div>
        
        <div className="dashboard-card notifications-card">
          <h2>Latest Notifications</h2>
          <Notifications notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;