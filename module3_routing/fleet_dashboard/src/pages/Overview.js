import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const STATS = [
  { label:'Active trucks',    value:'4',     sub:'2 en route',      color:'#3B82F6' },
  { label:'Bins collected',   value:'28',    sub:'today',           color:'#22C55E' },
  { label:'Total distance',   value:'42km',  sub:'today',           color:'#8B5CF6' },
  { label:'Pending alerts',   value:'3',     sub:'2 critical',      color:'#EF4444' },
  { label:'Fuel saved',       value:'8.4L',  sub:'vs fixed routes', color:'#F59E0B' },
  { label:'Avg fill on collect','value':'81%', sub:'target <90%',  color:'#22C55E' },
];

const DAILY_DATA = [
  { day:'Mon', collected:22, distance:38 },
  { day:'Tue', collected:31, distance:52 },
  { day:'Wed', collected:18, distance:29 },
  { day:'Thu', collected:35, distance:61 },
  { day:'Fri', collected:28, distance:42 },
  { day:'Sat', collected:15, distance:24 },
  { day:'Sun', collected:8,  distance:14 },
];

const ZONE_DATA = [
  { zone:'Gulberg III', bins:12, collected:10 },
  { zone:'Model Town',  bins:8,  collected:8  },
  { zone:'Garden Town', bins:6,  collected:5  },
  { zone:'DHA Phase 5', bins:10, collected:5  },
];

export default function Overview() {
  const [routes, setRoutes] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:8003/api/v3/route/optimize/demo')
      .then(r => setRoutes(r.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800 }}>Fleet Overview</h1>
        <p style={{ color:'#94A3B8', fontSize:14, marginTop:4 }}>
          Lahore Municipal — {new Date().toLocaleDateString('en-PK',
            { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:28 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background:'#1E293B', border:'1px solid #334155',
            borderRadius:16, padding:'18px 20px',
            borderLeft:`4px solid ${s.color}`,
          }}>
            <p style={{ fontSize:13, color:'#94A3B8' }}>{s.label}</p>
            <p style={{ fontSize:28, fontWeight:800, margin:'6px 0 2px' }}>{s.value}</p>
            <p style={{ fontSize:12, color:'#64748B' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
        <div style={{ background:'#1E293B', border:'1px solid #334155', borderRadius:16, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Weekly collections</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={DAILY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
              <XAxis dataKey="day" stroke="#64748B" fontSize={11}/>
              <YAxis stroke="#64748B" fontSize={11}/>
              <Tooltip contentStyle={{ background:'#0F172A', border:'1px solid #334155', borderRadius:8 }}/>
              <Line type="monotone" dataKey="collected" stroke="#22C55E" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:'#1E293B', border:'1px solid #334155', borderRadius:16, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Bins per zone</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ZONE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
              <XAxis dataKey="zone" stroke="#64748B" fontSize={9}/>
              <YAxis stroke="#64748B" fontSize={11}/>
              <Tooltip contentStyle={{ background:'#0F172A', border:'1px solid #334155', borderRadius:8 }}/>
              <Bar dataKey="bins"      fill="#3B82F6" radius={[4,4,0,0]}/>
              <Bar dataKey="collected" fill="#22C55E" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live routes from API */}
      {routes && (
        <div style={{ background:'#1E293B', border:'1px solid #334155', borderRadius:16, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>
            Live routes — {routes.total_distance_km}km total · {routes.total_bins_to_collect} bins
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {routes.routes.map(r => (
              <div key={r.truck_id} style={{
                background:'#0F172A', borderRadius:12, padding:16,
                border:'1px solid #334155',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <p style={{ fontWeight:700 }}>{r.truck_id}</p>
                  <span style={{
                    background:'#22C55E22', color:'#22C55E',
                    fontSize:11, padding:'2px 8px', borderRadius:99, fontWeight:600,
                  }}>En route</span>
                </div>
                <p style={{ fontSize:12, color:'#94A3B8', marginBottom:8 }}>
                  {r.total_bins} bins · {r.distance_km}km · {r.estimated_mins} min
                </p>
                {r.stops.filter(s=>s.type==='bin').map(s => (
                  <div key={s.id} style={{
                    display:'flex', justifyContent:'space-between',
                    padding:'6px 0', borderBottom:'1px solid #1E293B',
                    fontSize:12,
                  }}>
                    <span style={{ color:'#94A3B8' }}>{s.id} — {s.zone}</span>
                    <span style={{
                      color: s.fill_level>=0.85 ? '#EF4444'
                           : s.fill_level>=0.6  ? '#F59E0B' : '#22C55E',
                      fontWeight:600,
                    }}>{Math.round(s.fill_level*100)}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}