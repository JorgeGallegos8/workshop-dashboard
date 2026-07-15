import './App.css';
import Header from './components/shared/Header';
import PCPanel from './components/panels/PCPanel';
import WeatherPanel from './components/panels/WeatherPanel';
import PricesPanel from './components/panels/PricesPanel';
import BambuPanel from './components/panels/BambuPanel';
import useTheme from './hooks/useTheme';

function App() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard__panels">
        <WeatherPanel />
        <PricesPanel />
        <BambuPanel />
        <div className="dashboard__full-width">
          <PCPanel />
        </div>
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default App;
