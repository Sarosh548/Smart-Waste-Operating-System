import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReportExport({ data }) {
  const reportRef = useRef();

  const exportPDF = async () => {
    const element = reportRef.current;
    const canvas  = await html2canvas(element, { scale: 2, backgroundColor: '#1e293b' });
    const imgData = canvas.toDataURL('image/png');
    const pdf     = new jsPDF('p', 'mm', 'a4');
    const width   = pdf.internal.pageSize.getWidth();
    const height  = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`SWOS_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const totalRevenue = data.transactions.reduce(
    (s,t) => s + (t.total_value||0), 0
  );

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'1rem'}}>
        <button onClick={exportPDF} style={{
          background:'#2563eb', color:'#fff', border:'none',
          borderRadius:10, padding:'10px 24px',
          fontSize:'0.95rem', cursor:'pointer', fontWeight:600,
        }}>
          📄 Export PDF Report
        </button>
      </div>

      <div ref={reportRef}>
        <div className="card" style={{marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',
                       alignItems:'center',marginBottom:'1rem'}}>
            <div>
              <h2 style={{color:'#38bdf8',marginBottom:4}}>
                SWOS — Municipal Waste Management Report
              </h2>
              <p style={{color:'#64748b',fontSize:'0.85rem'}}>
                Lahore Municipal Corporation · {new Date().toLocaleDateString()}
              </p>
            </div>
            <div style={{fontSize:'2rem'}}>🏛️</div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
            {[
              {label:'Total Bins Active',    value:'128'},
              {label:'Collection Rate',      value:'87%'},
              {label:'Recycling Rate',       value:'34.2%'},
              {label:'CO₂ Avoided',          value:'12.4 tons'},
              {label:'Marketplace Revenue',  value:`PKR ${(totalRevenue/1000).toFixed(1)}K`},
              {label:'Active Citizens',      value:`${data.leaderboard.length}`},
            ].map(s => (
              <div key={s.label} style={{
                background:'#0f172a', borderRadius:8,
                padding:'12px 16px', textAlign:'center'
              }}>
                <div style={{fontSize:'1.4rem',fontWeight:700,color:'#38bdf8'}}>
                  {s.value}
                </div>
                <div style={{fontSize:'0.75rem',color:'#64748b',marginTop:4}}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{marginBottom:'1rem'}}>
          <h3>Zone Performance Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Predicted Volume</th>
                <th>Peak Day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.forecasts?.zones || []).map(z => (
                <tr key={z.zone}>
                  <td>{z.zone}</td>
                  <td>{z.avg_daily_kg?.toLocaleString()} kg/day</td>
                  <td>{z.peak_day}</td>
                  <td>
                    <span style={{color: z.avg_daily_kg > 2500 ? '#ef4444' : '#22c55e'}}>
                      {z.avg_daily_kg > 2500 ? '⚠️ High Load' : '✅ Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Marketplace Activity</h3>
          <table>
            <thead>
              <tr><th>Date</th><th>Quantity</th><th>Price/kg</th><th>Total Value</th></tr>
            </thead>
            <tbody>
              {data.transactions.slice(0,5).map(t => (
                <tr key={t.id}>
                  <td>{t.created_at?.slice(0,10)}</td>
                  <td>{t.quantity_kg} kg</td>
                  <td>PKR {t.final_price}</td>
                  <td style={{color:'#22c55e',fontWeight:600}}>
                    PKR {t.total_value?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}