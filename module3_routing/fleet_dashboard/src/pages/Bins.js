import { useState } from 'react';

const ALL_BINS = [
  { id:'BIN-001', zone:'Gulberg III', fill:0.92, type:'plastic',   status:'urgent',  last:'2d ago' },
  { id:'BIN-002', zone:'Gulberg III', fill:0.45, type:'organic',   status:'ok',      last:'1d ago' },
  { id:'BIN-003', zone:'Model Town',  fill:0.78, type:'metal',     status:'soon',    last:'3d ago' },
  { id:'BIN-004', zone:'Model Town',  fill:0.30, type:'glass',     status:'ok',      last:'1d ago' },
  { id:'BIN-005', zone:'Garden Town', fill:0.88, type:'plastic',   status:'urgent',  last:'4d ago' },
  { id:'BIN-006', zone:'Garden Town', fill:0.60, type:'organic',   status:'soon',    last:'2d ago' },
  { id:'BIN-007', zone:'DHA Phase 5', fill:0.65, type:'glass',     status:'soon',    last:'1d ago' },
  { id:'BIN-008', zone:'DHA Phase 5', fill:0.95, type:'hazardous', status:'critical',last:'5d ago' },
];

const FILL_COLOR = f =>
  f>=0.90 ? '#EF4444' : f>=0.85 ? '#F97316' : f>=0.60 ? '#F59E0B' : '#22C55E';

export default function Bins() {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? ALL_BINS
    : ALL_BINS.filter(b => b.status===filter);

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800 }}>Smart Bins</h1>
        <p style={{ color:'#94A3B8', fontSize:14, marginTop:4 }}>
          {ALL_BINS.length} bins · {ALL_BINS.filter(b=>b.status==='urgent'||b.status==='critical').length} need collection
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','urgent','critical','soon','ok'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'6px 14px', borderRadius:99, fontSize:12, fontWeight:600,
            background: filter===f ? '#3B82F6' : '#1E293B',
            color: filter===f ? '#fff' : '#94A3B8',
            border: filter===f ? 'none' : '1px solid #334155',
          }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
        ))}
      </div>

      {/* Bin table */}
      <div style={{ background:'#1E293B', border:'1px solid #334155', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #334155' }}>
              {['Bin ID','Zone','Fill Level','Type','Last Collected','Status'].map(h => (
                <th key={h} style={{
                  padding:'12px 16px', textAlign:'left',
                  fontSize:12, color:'#64748B', fontWeight:600,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b,i) => (
              <tr key={b.id} style={{
                borderBottom: i<filtered.length-1 ? '1px solid #334155' : 'none',
                background: b.status==='critical' ? '#EF444411' : 'transparent',
              }}>
                <td style={{ padding:'12px 16px', fontWeight:700, fontSize:14 }}>{b.id}</td>
                <td style={{ padding:'12px 16px', color:'#94A3B8', fontSize:13 }}>{b.zone}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ background:'#0F172A', borderRadius:99, height:6, width:80 }}>
                      <div style={{
                        height:6, borderRadius:99,
                        width:`${b.fill*100}%`,
                        background: FILL_COLOR(b.fill),
                      }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:700, color:FILL_COLOR(b.fill) }}>
                      {Math.round(b.fill*100)}%
                    </span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{
                    fontSize:11, fontWeight:600, padding:'3px 8px',
                    borderRadius:99, textTransform:'capitalize',
                    background:'#33415566', color:'#94A3B8',
                  }}>{b.type}</span>
                </td>
                <td style={{ padding:'12px 16px', color:'#64748B', fontSize:13 }}>{b.last}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{
                    fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:99,
                    background: b.status==='critical' ? '#EF444422'
                              : b.status==='urgent'   ? '#F9731622'
                              : b.status==='soon'     ? '#F59E0B22' : '#22C55E22',
                    color: b.status==='critical' ? '#EF4444'
                         : b.status==='urgent'   ? '#F97316'
                         : b.status==='soon'     ? '#F59E0B' : '#22C55E',
                  }}>{b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}