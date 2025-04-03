import { useState, useEffect } from 'react';
import CryptoWidget from '../components/CryptoWidget';
import { fetchCryptoData, fetchCryptoHistory } from '../services/cryptoService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/Crypto.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Crypto = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [historicalData, setHistoricalData] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLiveUpdates, setShowLiveUpdates] = useState(false);

  useEffect(() => {
    const getCryptoData = async () => {
      try {
        setLoading(true);
        const data = await fetchCryptoData();
        setCryptoData(data);
        
        if (data.length > 0) {
          const defaultCoin = data.find(coin => coin.id === selectedCrypto) || data[0];
          setSelectedCrypto(defaultCoin.id);
          await getHistoricalData(defaultCoin.id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Failed to fetch cryptocurrency data. Please try again.');
        
        // Mock data for development
        const mockData = [
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 63000, price_change_percentage_24h: 2.5 },
          { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3400, price_change_percentage_24h: -1.2 },
          { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 120, price_change_percentage_24h: 5.7 },
          { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.45, price_change_percentage_24h: 0.8 },
          { id: 'binancecoin', name: 'Binance Coin', symbol: 'bnb', current_price: 570, price_change_percentage_24h: 3.2 },
        ];
        setCryptoData(mockData);
        
        if (mockData.length > 0) {
          const defaultCoin = mockData.find(coin => coin.id === selectedCrypto) || mockData[0];
          setSelectedCrypto(defaultCoin.id);
          createMockHistoricalData(defaultCoin.id);
        }
      } finally {
        setLoading(false);
      }
    };

    getCryptoData();
    
    // Setup live updates
    let updateInterval;
    if (showLiveUpdates) {
      updateInterval = setInterval(() => {
        setCryptoData(prev => 
          prev.map(coin => ({
            ...coin,
            current_price: coin.current_price * (1 + (Math.random() * 0.02 - 0.01)),
            price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() * 0.5 - 0.25)
          }))
        );
      }, 5000);
    }
    
    return () => clearInterval(updateInterval);
  }, [selectedCrypto, showLiveUpdates]);

  const getHistoricalData = async (coinId) => {
    try {
      const data = await fetchCryptoHistory(coinId, timeRange);
      setHistoricalData(prev => ({ ...prev, [coinId]: data }));
    } catch (err) {
      console.error('Error fetching historical data:', err);
      createMockHistoricalData(coinId);
    }
  };

  const createMockHistoricalData = (coinId) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
    const mockData = Array(days).fill().map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.getTime(),
        price: 50000 + Math.random() * 5000 * (i / days)
      };
    });
    setHistoricalData(prev => ({ ...prev, [coinId]: mockData }));
  };

  useEffect(() => {
    if (selectedCrypto) {
      getHistoricalData(selectedCrypto);
    }
  }, [timeRange, selectedCrypto]);

  const handleCryptoSelect = (coinId) => {
    setSelectedCrypto(coinId);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const selectedCoinData = cryptoData.find(coin => coin.id === selectedCrypto);

  const historyChartData = {
    labels: historicalData[selectedCrypto]?.map(data => {
      const date = new Date(data.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: `${selectedCoinData?.name || ''} Price (USD)`,
        data: historicalData[selectedCrypto]?.map(data => data.price) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
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
        text: `${selectedCoinData?.name || ''} Price History`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (USD)'
        }
      }
    }
  };

  return (
    <div className="crypto-page">
      <h1>Cryptocurrency Dashboard</h1>
      
      <div className="live-toggle">
        <label>
          <input
            type="checkbox"
            checked={showLiveUpdates}
            onChange={() => setShowLiveUpdates(prev => !prev)}
          />
          Enable Live Updates
        </label>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading cryptocurrency data...</div>
      ) : (
        <div className="crypto-content">
          <div className="crypto-summary">
            <h2>Top Cryptocurrencies</h2>
            <CryptoWidget 
              data={cryptoData} 
              onSelectCrypto={handleCryptoSelect}
              selectedCrypto={selectedCrypto}
            />
          </div>
          
          {selectedCoinData && (
            <div className="crypto-detail">
              <h2>{selectedCoinData.name} ({selectedCoinData.symbol?.toUpperCase()})</h2>
              <div className="crypto-price">
                <p className="current-price">${selectedCoinData.current_price?.toLocaleString()}</p>
                <p className={`price-change ${selectedCoinData.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  {selectedCoinData.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
                  {Math.abs(selectedCoinData.price_change_percentage_24h).toFixed(2)}%
                </p>
              </div>
              
              <div className="time-range-selector">
                <button 
                  className={timeRange === '1d' ? 'active' : ''} 
                  onClick={() => handleTimeRangeChange('1d')}
                >
                  24h
                </button>
                <button 
                  className={timeRange === '7d' ? 'active' : ''} 
                  onClick={() => handleTimeRangeChange('7d')}
                >
                  7d
                </button>
                <button 
                  className={timeRange === '30d' ? 'active' : ''} 
                  onClick={() => handleTimeRangeChange('30d')}
                >
                  30d
                </button>
              </div>
              
              <div className="price-chart">
                <Line options={chartOptions} data={historyChartData} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Crypto;