import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Overview from './components/Overview';
import WasteMap from './components/WasteMap';
import Forecasts from './components/Forecasts';
import Marketplace from './components/Marketplace';
import CarbonTracker from './components/CarbonTracker';
import ReportExport from './components/ReportExport';
import './App.css';

const APIS = {
  detection  : 'http://127.0.0.1:8001',
  rewards    : 'http://127.0.0.1:8002',
  routing    : 'http://127.0.0.1:8003',
  prediction : 'http://127.0.0.1:8004',
  marketplace: 'http://127.0.0.1:8005',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData]           = useState({
    listings    : [],
    transactions: [],
    forecasts   : null,
    leaderboard : [],
  });

  useEffect(() => {
    // Fetch data from all modules
    Promise.allSettled([
      axios.get(`${APIS.marketplace}/api/v5/listings`),
      axios.get(`${APIS.marketplace}/api/v5/transactions`),
      axios.get(`${APIS.prediction}/api/v4/forecast/zones`),
      axios.get(`${APIS.rewards}/api/v2/leaderboard`),
    ]).then(([listings, transactions, forecasts, leaderboard]) => {
      setData({
        listings    : listings.value?.data?.listings     || [],
        transactions: transactions.value?.data?.transactions || [],
        forecasts   : forecasts.value?.data              || null,
        leaderboard : leaderboard.value?.data?.leaderboard  || [],
      });
    });
  }, []);

  const TABS = [
    { id: 'overview',   label: '📊 Overview'    },
    { id: 'map',        label: '🗺️ Waste Map'   },
    { id: 'forecasts',  label: '📈 Forecasts'   },
    { id: 'marketplace',label: '🏪 Marketplace' },
    { id: 'carbon',     label: '🌍 Carbon'      },
    { id: 'reports',    label: '📄 Reports'     },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>🏛️ SWOS</h1>
          <span>Government Analytics Dashboard</span>
        </div>
        <div className="header-right">
          <span className="live">● LIVE</span>
          <span>Lahore Municipal Corporation</span>
          <span>{new Date().toLocaleDateString('en-PK', {
            weekday:'long', year:'numeric',
            month:'long', day:'numeric'
          })}</span>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map(t => (
          <button key={t.id}
            className={`tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeTab === 'overview'    && <Overview    data={data} />}
        {activeTab === 'map'         && <WasteMap    data={data} />}
        {activeTab === 'forecasts'   && <Forecasts   data={data} />}
        {activeTab === 'marketplace' && <Marketplace data={data} />}
        {activeTab === 'carbon'      && <CarbonTracker data={data} />}
        {activeTab === 'reports'     && <ReportExport  data={data} />}
      </main>
    </div>
  );
}