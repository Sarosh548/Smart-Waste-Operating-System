import { useState } from 'react';
import toast from 'react-hot-toast';

const ALERTS = [
  { id:1, type:'HAZARDOUS_WASTE', severity:'critical', bin:'BIN-008', zone:'DHA Phase 5', msg:'Hazardous waste detected — immediate collection required', time:'5 min ago',    resolved:false },
  { id:2, type:'BIN_FULL',        severity:'high',     bin:'BIN-001', zone:'Gulberg III', msg:'Bin BIN-001 is 92% full',                                 time:'12 min ago',   resolved:false },
  { id:3, type:'BIN_FULL',        severity:'high',     bin:'BIN-005', zone:'Garden Town', msg:'Bin BIN-005 is 88% full',                                 time:'18 min ago',   resolved:false },
  { id:4, type:'BIN_FULL',        severity:'medium',   bin:'BIN-003', zone:'Model Town',  msg:'Bin BIN-003 is 78% full — schedule soon',                 time:'1 hour ago',   resolved:true  },
  { id:5, type:'ROUTE_DELAYED',   severity:'medium',   bin:null,      zone:'Model Town',  msg:'TRUCK-02 delayed — traffic on Main Boulevard',            time:'2 hours ago',  resolved:true  },
];

const SEV = {
  critical:{ bg:'#EF444422', color:'#EF4444', border:'#EF444444', label:'Critical' },
  high    :{ bg:'#F9731622', color:'#F97316', border:'#F9731644', label:'High'     },
  medium  :{ bg:'#F59E0B22', color:'#F59E0B', border:'#F59E0B44', label:'Medium'   },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(ALERTS);

  const resolve = (id) => {
    setAlerts(a => a.map(x => x.id===id ? {...x, resolved:true} : x));
    toast.success('Alert resolved');
  };

  const active   = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a =>  a.resolved);

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800 }}>Alerts</h1>
        <p style={{ color:'#94A3B8', fontSize:14, marginTop:4 }}>
          {active.length} active · {resolved.length} resolved
        </p>
      </div>

      <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14, color:'#EF4444' }}>
        Active alerts
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:28 }}>
        {active.map(a => {
          const s = SEV[a.severity];
          return (
            <div key={a.id} style={{
              background: s.bg, border:`1px solid ${s.border}`,
              borderRadius:14, padding:'16px 20px',
              display:'flex', alignItems:'flex-start', gap:16,
            }}>
              <span style={{ fontSize:22, flexShrink:0 }}>
                {a.severity==='critical' ? '🔴' : a.severity==='high' ? '🟠' : '🟡'}
              </span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{
                    fontSize:11, fontWeight:600, padding:'2px 8px',
                    borderRadius:99, background:s.bg, color:s.color,
                    border:`1px solid ${s.border}`,
                  }}>{s.label}</span>
                  <span style={{ fontSize:12, color:'#94A3B8' }}>{a.type}</span>
                </div>
                <p style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{a.msg}</p>
                <p style={{ fontSize:12, color:'#94A3B8' }}>
                  {a.bin && `${a.bin} · `}{a.zone} · {a.time}
                </p>
              </div>
              <button onClick={() => resolve(a.id)} style={{
                background:'#1E293B', color:'#22C55E',
                border:'1px solid #22C55E44', borderRadius:8,
                padding:'6px 12px', fontSize:12, fontWeight:600,
                flexShrink:0,
              }}>Resolve</button>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14, color:'#94A3B8' }}>
        Resolved
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {resolved.map(a => (
          <div key={a.id} style={{
            background:'#1E293B', border:'1px solid #334155',
            borderRadius:12, padding:'12px 16px',
            display:'flex', gap:12, opacity:0.6,
          }}>
            <span style={{ fontSize:16 }}>✅</span>
            <div>
              <p style={{ fontSize:13, fontWeight:600 }}>{a.msg}</p>
              <p style={{ fontSize:11, color:'#64748B' }}>
                {a.zone} · {a.time} · resolved
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}