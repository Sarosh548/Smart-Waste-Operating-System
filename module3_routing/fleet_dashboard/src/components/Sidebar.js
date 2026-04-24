import { NavLink } from 'react-router-dom';

const links = [
  { to:'/',       icon:'📊', label:'Overview' },
  { to:'/trucks', icon:'🚛', label:'Trucks'   },
  { to:'/bins',   icon:'🗑️', label:'Bins'     },
  { to:'/alerts', icon:'🚨', label:'Alerts'   },
];

export default function Sidebar() {
  return (
    <aside style={{
      width:220, background:'#1E293B',
      borderRight:'1px solid #334155',
      padding:'32px 16px', display:'flex',
      flexDirection:'column', gap:4,
      minHeight:'100vh', flexShrink:0,
    }}>
      <div style={{ marginBottom:32 }}>
        <p style={{ fontSize:11, color:'#94A3B8', fontWeight:600,
          letterSpacing:'0.08em', marginBottom:4 }}>SWOS</p>
        <h1 style={{ fontSize:16, fontWeight:800 }}>Fleet Manager</h1>
        <p style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>Module 3 Dashboard</p>
      </div>

      {links.map(l => (
        <NavLink key={l.to} to={l.to} end={l.to==='/'} style={({ isActive })=>({
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 12px', borderRadius:10,
          textDecoration:'none', fontSize:14, fontWeight:500,
          background: isActive ? '#334155' : 'transparent',
          color: isActive ? '#F1F5F9' : '#94A3B8',
        })}>
          <span style={{ fontSize:16 }}>{l.icon}</span>
          {l.label}
        </NavLink>
      ))}

      <div style={{ marginTop:'auto', padding:'12px', background:'#0F172A',
        borderRadius:12, fontSize:12 }}>
        <p style={{ color:'#22C55E', fontWeight:600 }}>● System Online</p>
        <p style={{ color:'#94A3B8', marginTop:4 }}>API: localhost:8003</p>
      </div>
    </aside>
  );
}