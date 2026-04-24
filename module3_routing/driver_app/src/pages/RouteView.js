import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MOCK_STOPS = [
  { id:'BIN-001', zone:'Gulberg III', fill_level:0.92, waste_type:'plastic', lat:31.5204, lng:74.3587, status:'pending'   },
  { id:'BIN-003', zone:'Model Town',  fill_level:0.78, waste_type:'metal',   lat:31.5320, lng:74.3450, status:'pending'   },
  { id:'BIN-007', zone:'DHA Phase 5', fill_level:0.65, waste_type:'glass',   lat:31.4800, lng:74.4000, status:'pending'   },
];

const FILL_COLOR = f =>
  f >= 0.85 ? '#EF4444' : f >= 0.6 ? '#F59E0B' : '#22C55E';

export default function RouteView() {
  const nav = useNavigate();
  const [stops, setStops] = useState(MOCK_STOPS);
  const [current, setCurrent] = useState(0);

  const markCollected = () => {
    const updated = [...stops];
    updated[current].status = 'collected';
    setStops(updated);
    toast.success(`${stops[current].id} marked collected! +15 pts`);
    if (current + 1 < stops.length) {
      setCurrent(current + 1);
    } else {
      nav('/done');
    }
  };

  const reportIssue = () => {
    toast.error('Issue reported to fleet manager');
  };

  const stop = stops[current];

  return (
    <div style={{ padding:'48px 20px 100px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <p style={{ fontSize:13, fontWeight:600 }}>
            Stop {current+1} of {stops.length}
          </p>
          <p style={{ fontSize:13, color:'#94A3B8' }}>
            {stops.filter(s=>s.status==='collected').length} collected
          </p>
        </div>
        <div style={{ background:'#1E293B', borderRadius:99, height:8 }}>
          <div style={{
            background:'#22C55E', borderRadius:99, height:8,
            width:`${(stops.filter(s=>s.status==='collected').length/stops.length)*100}%`,
            transition:'width 0.3s',
          }}/>
        </div>
      </div>

      {/* Current stop card */}
      <div style={{
        background:'#1E293B',
        border:`2px solid ${FILL_COLOR(stop.fill_level)}`,
        borderRadius:20, padding:24, marginBottom:20,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <p style={{ fontSize:13, color:'#94A3B8' }}>Current stop</p>
            <h2 style={{ fontSize:28, fontWeight:800 }}>{stop.id}</h2>
            <p style={{ color:'#94A3B8', fontSize:14, marginTop:4 }}>
              {stop.zone} · {stop.waste_type}
            </p>
          </div>
          <div style={{
            background: FILL_COLOR(stop.fill_level)+'22',
            border:`1px solid ${FILL_COLOR(stop.fill_level)}`,
            borderRadius:12, padding:'8px 14px', textAlign:'center',
          }}>
            <p style={{ fontSize:24, fontWeight:800, color:FILL_COLOR(stop.fill_level) }}>
              {Math.round(stop.fill_level*100)}%
            </p>
            <p style={{ fontSize:11, color:'#94A3B8' }}>fill level</p>
          </div>
        </div>

        {/* Coordinates */}
        <div style={{
          marginTop:16, padding:'12px 14px',
          background:'#0F172A', borderRadius:12,
          display:'flex', justifyContent:'space-between',
        }}>
          <div>
            <p style={{ fontSize:11, color:'#94A3B8' }}>Latitude</p>
            <p style={{ fontSize:14, fontWeight:600 }}>{stop.lat}</p>
          </div>
          <div>
            <p style={{ fontSize:11, color:'#94A3B8' }}>Longitude</p>
            <p style={{ fontSize:14, fontWeight:600 }}>{stop.lng}</p>
          </div>
          <div>
            <p style={{ fontSize:11, color:'#94A3B8' }}>Type</p>
            <p style={{ fontSize:14, fontWeight:600, textTransform:'capitalize' }}>
              {stop.waste_type}
            </p>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{
        background:'#1E293B', border:'1px solid #334155',
        borderRadius:16, height:180, marginBottom:20,
        display:'flex', alignItems:'center', justifyContent:'center',
        flexDirection:'column', gap:8,
      }}>
        <span style={{ fontSize:40 }}>🗺️</span>
        <p style={{ color:'#94A3B8', fontSize:13 }}>
          GPS: {stop.lat}, {stop.lng}
        </p>
        <p style={{ color:'#64748B', fontSize:12 }}>
          Leaflet map — connect in production
        </p>
      </div>

      {/* Action buttons */}
      <button onClick={markCollected} style={{
        width:'100%', background:'#22C55E', color:'#fff',
        borderRadius:16, padding:'16px', fontSize:16,
        fontWeight:700, marginBottom:12,
      }}>
        ✅ Mark as Collected
      </button>

      <button onClick={reportIssue} style={{
        width:'100%', background:'#1E293B', color:'#EF4444',
        border:'1px solid #EF444466', borderRadius:16,
        padding:'14px', fontSize:14, fontWeight:600,
      }}>
        ⚠️ Report Issue
      </button>

      {/* All stops mini list */}
      <h3 style={{ fontSize:14, fontWeight:700, margin:'20px 0 12px' }}>All stops</h3>
      {stops.map((s, i) => (
        <div key={s.id} onClick={() => setCurrent(i)} style={{
          background: i===current ? '#1D3557' : '#1E293B',
          border:`1px solid ${i===current ? '#3B82F6' : '#334155'}`,
          borderRadius:12, padding:'10px 14px',
          display:'flex', alignItems:'center', gap:12,
          marginBottom:8, cursor:'pointer',
        }}>
          <div style={{
            width:28, height:28, borderRadius:'50%',
            background: s.status==='collected' ? '#22C55E22' : '#33415566',
            border:`1px solid ${s.status==='collected' ? '#22C55E' : '#475569'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:700,
            color: s.status==='collected' ? '#22C55E' : '#94A3B8',
          }}>
            {s.status==='collected' ? '✓' : i+1}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:600 }}>{s.id}</p>
            <p style={{ fontSize:11, color:'#64748B' }}>{s.zone}</p>
          </div>
          <p style={{ fontSize:13, fontWeight:700, color:FILL_COLOR(s.fill_level) }}>
            {Math.round(s.fill_level*100)}%
          </p>
        </div>
      ))}
    </div>
  );
}