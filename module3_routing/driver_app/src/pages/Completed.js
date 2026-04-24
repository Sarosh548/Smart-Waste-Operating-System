import { useNavigate } from 'react-router-dom';

export default function Completed() {
  const nav = useNavigate();
  return (
    <div style={{
      padding:'48px 20px', textAlign:'center',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      minHeight:'80vh', gap:16,
    }}>
      <div style={{ fontSize:72 }}>🎉</div>
      <h1 style={{ fontSize:28, fontWeight:800 }}>Route Complete!</h1>
      <p style={{ color:'#94A3B8', fontSize:15 }}>All bins collected for today</p>

      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12, width:'100%', margin:'20px 0',
      }}>
        {[
          { label:'Bins collected', value:'3'      },
          { label:'Distance',       value:'7.2 km' },
          { label:'Time taken',     value:'52 min' },
          { label:'Fuel saved',     value:'2.1 L'  },
        ].map(s => (
          <div key={s.label} style={{
            background:'#1E293B', border:'1px solid #334155',
            borderRadius:14, padding:'16px', textAlign:'center',
          }}>
            <p style={{ fontSize:22, fontWeight:800, color:'#22C55E' }}>{s.value}</p>
            <p style={{ fontSize:12, color:'#94A3B8', marginTop:4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <button onClick={() => nav('/')} style={{
        width:'100%', background:'#3B82F6', color:'#fff',
        borderRadius:16, padding:'16px', fontSize:16, fontWeight:700,
      }}>
        🏠 Back to Home
      </button>
    </div>
  );
}