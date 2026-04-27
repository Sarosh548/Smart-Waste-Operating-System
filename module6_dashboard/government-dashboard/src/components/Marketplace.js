import React from 'react';

const TYPE_COLORS = {
  plastic:'#3b82f6', organic:'#22c55e',
  metal:'#94a3b8', glass:'#06b6d4', hazardous:'#ef4444'
};

export default function Marketplace({ data }) {
  const totalRevenue = data.transactions.reduce(
    (s,t) => s + (t.total_value || 0), 0
  );
  const avgPrice = data.transactions.length > 0
    ? data.transactions.reduce((s,t) => s + (t.final_price||0), 0) / data.transactions.length
    : 0;

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
                   gap:'1rem',marginBottom:'1.5rem'}}>
        {[
          {label:'Total Listings',    value:data.listings.length,    color:'#38bdf8'},
          {label:'Active Listings',   value:data.listings.filter(l=>l.status==='active').length, color:'#22c55e'},
          {label:'Transactions',      value:data.transactions.length, color:'#f59e0b'},
          {label:'Total Revenue',     value:`PKR ${(totalRevenue/1000).toFixed(1)}K`, color:'#a78bfa'},
        ].map(s => (
          <div key={s.label} className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',fontWeight:700,color:s.color}}>{s.value}</div>
            <div style={{fontSize:'0.75rem',color:'#64748b'}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Active Listings</h3>
          {data.listings.length === 0
            ? <p style={{color:'#64748b'}}>No listings yet</p>
            : (
              <table>
                <thead>
                  <tr><th>Material</th><th>Qty (kg)</th><th>Price/kg</th><th>Value</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.listings.slice(0,10).map(l => (
                    <tr key={l.id}>
                      <td>
                        <span style={{color: TYPE_COLORS[l.waste_type] || '#94a3b8',
                                      fontWeight:600}}>
                          {l.waste_type}
                        </span>
                      </td>
                      <td>{l.quantity_kg?.toLocaleString()}</td>
                      <td style={{color:'#38bdf8'}}>PKR {l.current_price}</td>
                      <td style={{color:'#22c55e'}}>
                        PKR {l.total_value?.toLocaleString()}
                      </td>
                      <td>
                        <span style={{
                          color: l.status==='active' ? '#22c55e' : '#94a3b8',
                          fontSize:'0.75rem'
                        }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>

        <div className="card">
          <h3>Recent Transactions</h3>
          {data.transactions.length === 0
            ? <p style={{color:'#64748b'}}>No transactions yet</p>
            : (
              <table>
                <thead>
                  <tr><th>Date</th><th>Qty (kg)</th><th>Price/kg</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {data.transactions.slice(0,10).map(t => (
                    <tr key={t.id}>
                      <td style={{fontSize:'0.8rem',color:'#64748b'}}>{t.created_at?.slice(0,10)}</td>
                      <td>{t.quantity_kg}</td>
                      <td style={{color:'#38bdf8'}}>PKR {t.final_price}</td>
                      <td style={{color:'#22c55e',fontWeight:600}}>
                        PKR {t.total_value?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
}