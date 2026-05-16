import './App.css';
import Header from './components/shared/Header';
import PCPanel from './components/panels/PCPanel';
import WeatherPanel from './components/panels/WeatherPanel';
import PricesPanel from './components/panels/PricesPanel';

function App() {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard__panels">
        <WeatherPanel />
        <PricesPanel />
        <div className="dashboard__full-width">
        <PCPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
