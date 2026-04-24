const TRUCKS = [
  { id:'TRUCK-01', driver:'Usman Malik',  zone:'Gulberg III', status:'en_route',  bins:3, fuel:78, lat:31.521, lng:74.361 },
  { id:'TRUCK-02', driver:'Bilal Ahmed',  zone:'Model Town',  status:'en_route',  bins:2, fuel:65, lat:31.532, lng:74.345 },
  { id:'TRUCK-03', driver:'Kamran Ali',   zone:'Garden Town', status:'idle',      bins:0, fuel:92, lat:31.518, lng:74.340 },
  { id:'TRUCK-04', driver:'Tariq Hassan', zone:'DHA Phase 5', status:'completed', bins:5, fuel:45, lat:31.480, lng:74.400 },
];

const STATUS_STYLE = {
  en_route : { bg:'#3B82F622', color:'#3B82F6', label:'En Route'  },
  idle     : { bg:'#F59E0B22', color:'#F59E0B', label:'Idle'      },
  completed: { bg:'#22C55E22', color:'#22C55E', label:'Completed' },
};

export default function Trucks() {
  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800 }}>Fleet Trucks</h1>
        <p style={{ color:'#94A3B8', fontSize:14, marginTop:4 }}>
          4 trucks · 2 active routes
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {TRUCKS.map(t => {
          const st = STATUS_STYLE[t.status];
          return (
            <div key={t.id} style={{
              background:'#1E293B', border:'1px solid #334155',
              borderRadius:16, padding:20,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:800 }}>{t.id}</h2>
                  <p style={{ color:'#94A3B8', fontSize:13, marginTop:2 }}>{t.driver}</p>
                </div>
                <span style={{
                  background:st.bg, color:st.color,
                  fontSize:12, fontWeight:600,
                  padding:'4px 12px', borderRadius:99, height:'fit-content',
                }}>{st.label}</span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
                {[
                  { label:'Zone',  value:t.zone.split(' ')[0] },
                  { label:'Bins',  value:t.bins               },
                  { label:'Fuel',  value:`${t.fuel}%`         },
                ].map(s => (
                  <div key={s.label} style={{
                    background:'#0F172A', borderRadius:10, padding:'10px 8px', textAlign:'center',
                  }}>
                    <p style={{ fontSize:16, fontWeight:700 }}>{s.value}</p>
                    <p style={{ fontSize:11, color:'#64748B', marginTop:2 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Fuel bar */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <p style={{ fontSize:11, color:'#94A3B8' }}>Fuel level</p>
                  <p style={{ fontSize:11, fontWeight:600,
                    color: t.fuel<30 ? '#EF4444' : t.fuel<60 ? '#F59E0B' : '#22C55E'
                  }}>{t.fuel}%</p>
                </div>
                <div style={{ background:'#0F172A', borderRadius:99, height:6 }}>
                  <div style={{
                    height:6, borderRadius:99,
                    width:`${t.fuel}%`,
                    background: t.fuel<30 ? '#EF4444' : t.fuel<60 ? '#F59E0B' : '#22C55E',
                    transition:'width 0.5s',
                  }}/>
                </div>
              </div>

              <p style={{ fontSize:11, color:'#64748B', marginTop:10 }}>
                GPS: {t.lat}, {t.lng}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}