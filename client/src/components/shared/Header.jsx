import useLiveReadings from '../../hooks/useLiveReadings';
import './Header.css';

export default function Header() {
  const { connected } = useLiveReadings();

  return (
    <header className="header">
      <h1 className="header__title">🔧 Workshop Dashboard</h1>
      <div className="header__status">
        <span
          className={`header__dot ${connected ? 'header__dot--connected' : 'header__dot--disconnected'}`}
        />
        <span className="header__status-text">
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>
    </header>
  );
}
