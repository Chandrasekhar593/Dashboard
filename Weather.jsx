import { useState, useEffect } from 'react';
import WeatherWidget from '../components/WeatherWidget';
import { fetchWeatherData, fetchForecastData } from '../services/weatherService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/Weather.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState('London');
  const [searchTerm, setSearchTerm] = useState('London');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        const weatherData = await fetchWeatherData(location);
        const forecastData = await fetchForecastData(location);
        
        setCurrentWeather(weatherData);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data. Please try again.');
        
        // Mock data for development
        setCurrentWeather({
          name: location,
          main: { temp: 283.15, humidity: 70, pressure: 1013 },
          weather: [{ description: 'cloudy', icon: '04d' }],
          wind: { speed: 5.1 }
        });
        
        setForecast({
          list: Array(5).fill().map((_, i) => ({
            dt: Date.now() + i * 86400000,
            main: { temp: 283.15 - i + Math.random() * 5 },
            weather: [{ icon: '04d' }]
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLocation(searchTerm);
  };

  const forecastChartData = {
    labels: forecast?.list.slice(0, 5).map(entry => {
      const date = new Date(entry.dt * 1000);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: forecast?.list.slice(0, 5).map(entry => (entry.main.temp - 273.15).toFixed(1)) || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '5-Day Temperature Forecast',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      }
    }
  };

  return (
    <div className="weather-page">
      <h1>Weather Dashboard</h1>
      
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter city name"
          />
          <button type="submit">Search</button>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading weather data...</div>
      ) : (
        <div className="weather-content">
          <div className="current-weather">
            <h2>Current Weather in {currentWeather?.name}</h2>
            <WeatherWidget data={currentWeather} />
          </div>
          
          <div className="forecast">
            <h2>5-Day Forecast</h2>
            <div className="forecast-chart">
              <Line options={chartOptions} data={forecastChartData} />
            </div>
            
            <div className="forecast-cards">
              {forecast?.list.slice(0, 5).map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                    alt="Weather icon"
                  />
                  <p>{(day.main.temp - 273.15).toFixed(1)}°C</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;