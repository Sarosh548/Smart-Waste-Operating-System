import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BINS = {
  'BIN-001': { zone:'Gulberg III', fill_level:0.92, waste_type:'plastic', capacity:120, temp:28.5,  last_collected:'2 days ago' },
  'BIN-003': { zone:'Model Town',  fill_level:0.78, waste_type:'metal',   capacity:120, temp:30.1,  last_collected:'3 days ago' },
  'BIN-007': { zone:'DHA Phase 5', fill_level:0.65, waste_type:'glass',   capacity:240, temp:27.8,  last_collected:'1 day ago'  },
};

export default function BinDetail() {
  const { id } = useParams();
  const nav     = useNavigate();
  const bin     = BINS[id] || BINS['BIN-001'];
  const fillPct = Math.round(bin.fill_level * 100);
  const color   = bin.fill_level>=0.85 ? '#EF4444' : bin.fill_level>=0.6 ? '#F59E0B' : '#22C55E';

  return (
    <div style={{ padding:'48px 20px 100px' }}>
      <button onClick={() => nav(-1)} style={{
        background:'none', color:'#94A3B8', fontSize:14,
        marginBottom:20, padding:0,
      }}>← Back</button>

      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>{id}</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:24 }}>{bin.zone}</p>

      {/* Fill gauge */}
      <div style={{
        background:'#1E293B', border:`2px solid ${color}`,
        borderRadius:20, padding:24, marginBottom:20, textAlign:'center',
      }}>
        <p style={{ fontSize:13, color:'#94A3B8', marginBottom:8 }}>Fill level</p>
        <p style={{ fontSize:64, fontWeight:800, color }}>{fillPct}%</p>
        <div style={{ background:'#0F172A', borderRadius:99, height:12, margin:'16px 0 8px' }}>
          <div style={{
            background:color, borderRadius:99, height:12,
            width:`${fillPct}%`, transition:'width 0.5s',
          }}/>
        </div>
        <p style={{ fontSize:12, color:'#64748B' }}>
          {Math.round(bin.fill_level * bin.capacity)}L / {bin.capacity}L capacity
        </p>
      </div>

      {/* Details */}
      <div style={{
        background:'#1E293B', border:'1px solid #334155',
        borderRadius:16, padding:'4px 16px', marginBottom:20,
      }}>
        {[
          ['Waste type',      bin.waste_type],
          ['Temperature',     `${bin.temp}°C`],
          ['Last collected',  bin.last_collected],
          ['Capacity',        `${bin.capacity}L`],
          ['Status',          fillPct>=85 ? '🔴 Urgent' : fillPct>=60 ? '🟡 Soon' : '🟢 OK'],
        ].map(([k,v]) => (
          <div key={k} style={{
            display:'flex', justifyContent:'space-between',
            padding:'14px 0', borderBottom:'1px solid #334155',
          }}>
            <span style={{ fontSize:14, color:'#94A3B8' }}>{k}</span>
            <span style={{ fontSize:14, fontWeight:600, textTransform:'capitalize' }}>{v}</span>
          </div>
        ))}
      </div>

      <button onClick={() => { toast.success('Collected!'); nav('/route'); }} style={{
        width:'100%', background:'#22C55E', color:'#fff',
        borderRadius:16, padding:'16px', fontSize:16, fontWeight:700,
      }}>
        ✅ Mark Collected
      </button>
    </div>
  );
}