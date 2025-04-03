import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const fetchCryptoHistory = async (coinId, timeRange) => {
  let days = 7;
  switch (timeRange) {
    case '1d':
      days = 1;
      break;
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    default:
      days = 7;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days > 1 ? 'daily' : 'hourly'
      }
    });
    
    // Transform the data for easier chart consumption
    return response.data.prices.map(item => ({
      date: item[0],
      price: item[1]
    }));
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    throw error;
  }
};