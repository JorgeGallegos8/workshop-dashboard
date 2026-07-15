# 🔧 Workshop Dashboard

A real-time personal monitoring dashboard that aggregates live PC hardware metrics, weather, cryptocurrency prices, and 3D printer telemetry into a single glanceable interface.

![Dashboard Preview](screenshots/dashboard.png)

---

## Features

- **Live PC Stats** — CPU usage, RAM usage, and available storage updated every 3 seconds via WebSockets
- **Weather** — Current conditions, temperature, humidity, and wind speed for your location, refreshed every 5 minutes
- **Bitcoin Price** — Live spot price from Coinbase, refreshed every 2 minutes
- **Bambu Printer Telemetry** — Real-time nozzle temp, bed temp, and print progress from your Bambu printer over local MQTT
- **Dark / Light Mode** — Respects your OS preference with a manual toggle, persisted across sessions
- **Connection Status** — Live indicator showing whether the WebSocket connection is active
- **Automatic Data Cleanup** — Readings older than 30 days are automatically purged from the database daily

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Recharts |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Real-time | Socket.io |
| PC Agent | Node.js, systeminformation |
| Bambu Agent | Python, bambulabs-api |
| Weather API | OpenWeatherMap |
| Prices API | Coinbase |

---

## Architecture

```
[PC Agent - Node.js]       ──HTTP POST──→
[Bambu Agent - Python]     ──HTTP POST──→  [Express Backend]  ──→  [PostgreSQL]
[OpenWeatherMap API]       ──Backend pulls──→       |
[Coinbase API]             ──Backend pulls──→       |
                                               [Socket.io]
                                                    |
                                             [React Frontend]
                                          Live charts, panels, alerts
```

---

## Project Structure

```
/workshop-dashboard
  /server                  ← Express backend
    /routes
      readings.js          ← POST/GET sensor data
      weather.js           ← OpenWeatherMap proxy with caching
      prices.js            ← Coinbase proxy with caching
    /db
      index.js             ← PostgreSQL connection pool
      schema.sql           ← Database table definitions
    /sockets
      index.js             ← Socket.io setup and emit helper
    index.js               ← Entry point, server setup, cleanup job
  /client                  ← React frontend
    /src
      /components
        /panels
          PCPanel.jsx      ← CPU, RAM, disk, live chart
          WeatherPanel.jsx ← Current weather conditions
          PricesPanel.jsx  ← Bitcoin spot price
          BambuPanel.jsx   ← Printer telemetry and progress
        /shared
          MetricCard.jsx   ← Reusable metric display card
          LiveChart.jsx    ← Reusable Recharts line chart
          Header.jsx       ← Title and connection status
      /hooks
        useLiveReadings.js ← Socket.io connection and live data
        useWeather.js      ← Weather fetch with 5 min interval
        usePrices.js       ← Bitcoin fetch with 2 min interval
        useTheme.js        ← Dark/light mode toggle and persistence
      App.jsx              ← Root layout, panel grid
      index.css            ← Global styles and CSS variables
  /agents
    pc-agent.js            ← Reads PC stats, POSTs to backend
    bambu-agent.py         ← Reads printer data, POSTs to backend
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 15+

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/workshop-dashboard.git
cd workshop-dashboard
```

### 2. Set up the database

```bash
psql -U postgres
CREATE DATABASE "workshop-dashboard";
\q

psql -U postgres -d "workshop-dashboard" -f server/db/schema.sql
```

### 3. Configure the backend

Create `server/.env`:
```
PORT=3000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/workshop-dashboard
OPENWEATHER_API_KEY=your_key_here
LATITUDE=your_latitude
LONGITUDE=your_longitude
```

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Configure the agents

Create `agents/.env`:
```
BACKEND_URL=http://localhost:3000
BAMBU_IP=192.168.x.x
BAMBU_SERIAL=your_serial
BAMBU_ACCESS_CODE=your_access_code
```

### 6. Install agent dependencies

```bash
cd agents
npm install
pip install bambulabs-api python-dotenv requests
```

### 7. Configure the frontend

Create `client/.env`:
```
VITE_API_URL=http://localhost:3000
```

### 8. Install frontend dependencies

```bash
cd client
npm install
```

---

## Running the Dashboard

You need four terminals running simultaneously:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev

# Terminal 3 — PC Stats Agent
cd agents && node pc-agent.js

# Terminal 4 — Bambu Printer Agent (optional, requires printer on local network)
cd agents && python bambu-agent.py
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

### server/.env

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENWEATHER_API_KEY` | API key from openweathermap.org |
| `LATITUDE` | Your latitude for weather data |
| `LONGITUDE` | Your longitude for weather data |

### agents/.env

| Variable | Description |
|---|---|
| `BACKEND_URL` | URL of the Express backend |
| `BAMBU_IP` | Local IP address of your Bambu printer |
| `BAMBU_SERIAL` | Serial number from printer settings |
| `BAMBU_ACCESS_CODE` | Access code from printer network settings |

### client/.env

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of the Express backend the frontend connects to (REST + Socket.io) |

---

## Data Flow

1. **PC Agent** reads hardware stats every 3 seconds using `systeminformation` and POSTs each metric to `/api/readings`
2. **Bambu Agent** reads printer telemetry every 5 seconds via MQTT and POSTs to `/api/readings`
3. **Backend** saves each reading to PostgreSQL and immediately broadcasts it via Socket.io
4. **Frontend** receives the broadcast and updates the relevant panel in real time
5. **Weather and prices** are fetched by the backend on a cache interval and served to the frontend on demand

---

## API Endpoints

```
POST /api/readings              ← Ingest a new sensor reading
GET  /api/readings              ← Fetch historical readings (filterable)
GET  /api/readings/latest       ← Most recent reading per metric
GET  /api/weather               ← Current weather (cached 5 min)
GET  /api/prices/bitcoin        ← Bitcoin spot price (cached 1 min)
```