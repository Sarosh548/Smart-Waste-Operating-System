import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip,
         CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function Forecasts({ data }) {
  const zones = data.forecasts?.zones || [];

  const chartData = zones.map(z => ({
    zone    : z.zone.replace(' ', '\n'),
    daily_kg: Math.round(z.avg_daily_kg),
    total_kg: Math.round(z.total_30d_kg / 1000),
  }));

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <div className="card">
          <h3>30-Day Waste Volume Forecast by Zone</h3>
          {zones.length === 0 ? (
            <p style={{color:'#64748b'}}>
              Start prediction API on port 8004 to see forecasts
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{bottom:40}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="zone" stroke="#64748b" fontSize={11}
                       angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155'}} />
                <Legend />
                <Bar dataKey="daily_kg" fill="#38bdf8"
                     name="Avg Daily (kg)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Zone Forecast Summary</h3>
        {zones.length === 0 ? (
          <p style={{color:'#64748b'}}>No forecast data available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Avg Daily (kg)</th>
                <th>30-Day Total</th>
                <th>Peak Day</th>
                <th>Peak (kg)</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(z => (
                <tr key={z.zone}>
                  <td>{z.zone}</td>
                  <td style={{color:'#38bdf8'}}>{z.avg_daily_kg?.toLocaleString()}</td>
                  <td>{z.total_30d_kg?.toLocaleString()}</td>
                  <td>{z.peak_day}</td>
                  <td style={{color:'#f59e0b'}}>{z.peak_kg?.toLocaleString()}</td>
                  <td>
                    {z.avg_daily_kg > 2500
                      ? <span style={{color:'#ef4444'}}>⚠️ High</span>
                      : <span style={{color:'#22c55e'}}>✅ Normal</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}