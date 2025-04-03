import '../styles/CryptoWidget.css';

const CryptoWidget = ({ data, minimal = false, onSelectCrypto = null, selectedCrypto = null }) => {
  if (!data || data.length === 0) {
    return <div className="crypto-widget-loading">Loading cryptocurrency data...</div>;
  }

  if (minimal) {
    // Show just the top 3 cryptocurrencies in a compact format
    return (
      <div className="crypto-widget minimal">
        {data.slice(0, 3).map((coin) => (
          <div key={coin.id} className="crypto-item mini">
            <span className="crypto-name">{coin.name}</span>
            <span className="crypto-price">${coin.current_price?.toLocaleString()}</span>
            <span className={`crypto-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="crypto-widget">
      {data.map((coin) => (
        <div 
          key={coin.id} 
          className={`crypto-item ${selectedCrypto === coin.id ? 'selected' : ''}`}
          onClick={onSelectCrypto ? () => onSelectCrypto(coin.id) : undefined}
        >
          <div className="crypto-info">
            <span className="crypto-name">{coin.name}</span>
            <span className="crypto-symbol">{coin.symbol?.toUpperCase()}</span>
          </div>
          <div className="crypto-price-info">
            <span className="crypto-price">${coin.current_price?.toLocaleString()}</span>
            <span className={`crypto-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoWidget;