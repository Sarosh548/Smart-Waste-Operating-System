import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const nav = useNavigate();
  const [route,    setRoute]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  const driver = {
    name      : 'Usman Malik',
    truck_id  : 'TRUCK-02',
    zone      : 'Gulberg III — Lahore',
    shift     : '06:00 AM – 02:00 PM',
  };

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8003/api/v3/route/optimize/demo'
      );
      const myRoute = res.data.routes.find(
        r => r.truck_id === driver.truck_id
      );
      setRoute(myRoute || res.data.routes[0]);
      toast.success('Route loaded!');
    } catch {
      toast.error('Cannot reach routing API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoute(); }, []);

  const bins = route?.stops?.filter(s => s.type === 'bin') || [];

  return (
    <div style={{ padding:'48px 20px 100px' }}>
      {/* Driver card */}
      <div style={{
        background:'linear-gradient(135deg,#1D4ED8,#7C3AED)',
        borderRadius:20, padding:'20px 24px', marginBottom:24,
      }}>
        <p style={{ fontSize:13, opacity:0.8 }}>Good morning 👷</p>
        <h1 style={{ fontSize:22, fontWeight:800 }}>{driver.name}</h1>
        <p style={{ fontSize:13, opacity:0.8, marginTop:4 }}>
          {driver.truck_id} · {driver.zone}
        </p>
        <p style={{ fontSize:12, opacity:0.7, marginTop:2 }}>
          Shift: {driver.shift}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:24 }}>
        {[
          { label:'Bins today', value: bins.length   },
          { label:'Distance',   value: route ? `${route.distance_km}km` : '—' },
          { label:'Est. time',  value: route ? `${route.estimated_mins}m` : '—' },
        ].map(s => (
          <div key={s.label} style={{
            background:'#1E293B', border:'1px solid #334155',
            borderRadius:14, padding:'14px 12px', textAlign:'center',
          }}>
            <p style={{ fontSize:20, fontWeight:800 }}>{s.value}</p>
            <p style={{ fontSize:11, color:'#94A3B8', marginTop:3 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button onClick={() => nav('/route')} style={{
        width:'100%', background:'#22C55E', color:'#fff',
        borderRadius:16, padding:'16px', fontSize:16,
        fontWeight:700, marginBottom:20,
      }}>
        🚛 Start Route
      </button>

      {/* Bin list preview */}
      <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>
        Today's stops
      </h2>

      {loading && <p style={{ color:'#94A3B8', fontSize:14 }}>Loading route...</p>}

      {bins.map((bin, i) => (
        <div key={bin.id} onClick={() => nav(`/bin/${bin.id}`)} style={{
          background:'#1E293B', border:'1px solid #334155',
          borderRadius:14, padding:'14px 16px',
          display:'flex', alignItems:'center', gap:14,
          marginBottom:10, cursor:'pointer',
        }}>
          <div style={{
            width:40, height:40, borderRadius:10,
            background: bin.fill_level >= 0.85 ? '#EF444422' : '#3B82F622',
            border:`1px solid ${bin.fill_level >= 0.85 ? '#EF4444' : '#3B82F6'}`,
            display:'flex', alignItems:'center',
            justifyContent:'center', fontWeight:800, fontSize:14,
            color: bin.fill_level >= 0.85 ? '#EF4444' : '#3B82F6',
            flexShrink:0,
          }}>{i+1}</div>

          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700, fontSize:14 }}>{bin.id}</p>
            <p style={{ fontSize:12, color:'#64748B' }}>
              {bin.zone} · {bin.waste_type}
            </p>
          </div>

          <div style={{ textAlign:'right' }}>
            <p style={{
              fontSize:14, fontWeight:700,
              color: bin.fill_level >= 0.85 ? '#EF4444'
                   : bin.fill_level >= 0.6  ? '#F59E0B' : '#22C55E'
            }}>
              {Math.round(bin.fill_level * 100)}%
            </p>
            <p style={{ fontSize:11, color:'#64748B' }}>full</p>
          </div>
        </div>
      ))}
    </div>
  );
}