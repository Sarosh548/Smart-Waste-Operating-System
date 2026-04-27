import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip,
         LineChart, Line, ResponsiveContainer, CartesianGrid } from 'recharts';

const weeklyData = [
  {day:'Mon', collected:245, recycled:89},
  {day:'Tue', collected:312, recycled:124},
  {day:'Wed', collected:289, recycled:98},
  {day:'Thu', collected:356, recycled:145},
  {day:'Fri', collected:398, recycled:167},
  {day:'Sat', collected:445, recycled:198},
  {day:'Sun', collected:267, recycled:112},
];

export default function Overview({ data }) {
  const totalTransactions = data.transactions.length;
  const totalRevenue      = data.transactions.reduce(
    (s, t) => s + (t.total_value || 0), 0
  );
  const activeListings    = data.listings.filter(l => l.status === 'active').length;
  const topUser           = data.leaderboard[0];

  const kpis = [
    { icon:'🗑️', label:'Bins Monitored',    value:'128',              color:'#38bdf8' },
    { icon:'♻️', label:'Recycling Rate',    value:'34.2%',            color:'#22c55e' },
    { icon:'🚛', label:'Active Trucks',     value:'12',               color:'#f59e0b' },
    { icon:'💰', label:'Marketplace Revenue',value:`PKR ${(totalRevenue/1000).toFixed(0)}K`, color:'#a78bfa' },
    { icon:'👥', label:'Active Citizens',   value:`${data.leaderboard.length}`, color:'#22c55e' },
    { icon:'📦', label:'Active Listings',   value:`${activeListings}`, color:'#38bdf8' },
    { icon:'✅', label:'Transactions',      value:`${totalTransactions}`, color:'#f59e0b' },
    { icon:'🌍', label:'CO₂ Avoided',       value:'12.4 tons',        color:'#22c55e' },
  ];

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
        {kpis.map(k => (
          <div key={k.label} className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:'1.8rem'}}>{k.icon}</div>
            <div style={{fontSize:'1.6rem',fontWeight:700,color:k.color}}>{k.value}</div>
            <div style={{fontSize:'0.75rem',color:'#64748b',marginTop:4}}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Weekly Collections</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155'}} />
              <Bar dataKey="collected" fill="#38bdf8" name="Collected" radius={[4,4,0,0]} />
              <Bar dataKey="recycled"  fill="#22c55e" name="Recycled"  radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Top Citizens — Leaderboard</h3>
          {data.leaderboard.length === 0 ? (
            <p style={{color:'#64748b'}}>No data yet</p>
          ) : (
            <table>
              <thead>
                <tr><th>Rank</th><th>Name</th><th>Points</th><th>Badge</th></tr>
              </thead>
              <tbody>
                {data.leaderboard.slice(0,8).map(u => (
                  <tr key={u.rank}>
                    <td>{u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : `#${u.rank}`}</td>
                    <td>{u.name}</td>
                    <td style={{color:'#38bdf8',fontWeight:600}}>{u.points}</td>
                    <td style={{fontSize:'0.8rem'}}>{u.badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}