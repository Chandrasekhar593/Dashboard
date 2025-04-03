import axios from 'axios';

// Replace with your actual API key
const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchForecastData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
      }
    });
    
    // Filter to get one forecast per day
    const dailyData = {
      ...response.data,
      list: response.data.list.filter((item, index) => index % 8 === 0).slice(0, 5)
    };
    
    return dailyData;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};