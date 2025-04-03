import '../styles/WeatherWidget.css';

const WeatherWidget = ({ data, minimal = false }) => {
  if (!data) {
    return <div className="weather-widget-loading">Loading weather data...</div>;
  }

  // Convert Kelvin to Celsius
  const tempInCelsius = (data.main.temp - 273.15).toFixed(1);
  
  // Get weather icon
  const weatherIcon = data.weather[0]?.icon || '01d';
  const weatherDescription = data.weather[0]?.description || 'clear sky';
  
  if (minimal) {
    return (
      <div className="weather-widget minimal">
        <div className="weather-main">
          <h3>{data.name}</h3>
          <div className="temp-display">
            <span className="temperature">{tempInCelsius}°C</span>
            <img 
              src={`http://openweathermap.org/img/wn/${weatherIcon}.png`} 
              alt={weatherDescription}
              className="weather-icon"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="temp-display">
          <span className="temperature">{tempInCelsius}°C</span>
          <img 
            src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} 
            alt={weatherDescription}
            className="weather-icon"
          />
        </div>
        <div className="weather-description">
          <p>{weatherDescription}</p>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity:</span>
          <span className="detail-value">{data.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure:</span>
          <span className="detail-value">{data.main.pressure} hPa</span>
        </div>
        {data.wind && (
          <div className="detail-item">
            <span className="detail-label">Wind:</span>
            <span className="detail-value">{data.wind.speed} m/s</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;