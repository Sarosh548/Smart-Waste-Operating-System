import React from 'react';
import { PieChart, Pie, Cell, Tooltip,
         ResponsiveContainer, Legend } from 'recharts';

const CO2_FACTORS = {
  plastic  : 1.8,
  organic  : 0.5,
  metal    : 4.2,
  glass    : 0.3,
  hazardous: 2.1,
};

const COLORS = ['#3b82f6','#22c55e','#94a3b8','#06b6d4','#ef4444'];

export default function CarbonTracker({ data }) {
  const wasteByType = {
    plastic  : 4200,
    organic  : 3100,
    metal    : 1800,
    glass    : 900,
    hazardous: 450,
  };

  const co2Data = Object.entries(wasteByType).map(([type, kg]) => ({
    name    : type,
    kg      : kg,
    co2_avoided: Math.round(kg * CO2_FACTORS[type] / 1000 * 10) / 10,
  }));

  const totalCO2  = co2Data.reduce((s,d) => s + d.co2_avoided, 0);
  const treesEquiv= Math.round(totalCO2 * 45);

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
                   gap:'1rem',marginBottom:'1.5rem'}}>
        {[
          {label:'CO₂ Avoided',     value:`${totalCO2.toFixed(1)} tons`, color:'#22c55e'},
          {label:'Trees Equivalent',value:`${treesEquiv}`,               color:'#22c55e'},
          {label:'Fuel Saved',      value:'8.4L',                        color:'#38bdf8'},
          {label:'Landfill Diverted',value:'12.4 tons',                  color:'#f59e0b'},
        ].map(s => (
          <div key={s.label} className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:'1.6rem',fontWeight:700,color:s.color}}>{s.value}</div>
            <div style={{fontSize:'0.75rem',color:'#64748b',marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>CO₂ Avoided by Material Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={co2Data} dataKey="co2_avoided"
                   nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {co2Data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v} tons CO₂`}
                       contentStyle={{background:'#1e293b',border:'1px solid #334155'}} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Carbon Accounting Table</h3>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Recycled (kg)</th>
                <th>CO₂ Factor</th>
                <th>CO₂ Avoided</th>
              </tr>
            </thead>
            <tbody>
              {co2Data.map(d => (
                <tr key={d.name}>
                  <td style={{fontWeight:600}}>{d.name}</td>
                  <td>{d.kg.toLocaleString()}</td>
                  <td style={{color:'#64748b'}}>{CO2_FACTORS[d.name]} kg/kg</td>
                  <td style={{color:'#22c55e',fontWeight:600}}>
                    {d.co2_avoided} tons
                  </td>
                </tr>
              ))}
              <tr style={{borderTop:'2px solid #334155'}}>
                <td colSpan={3} style={{fontWeight:700}}>TOTAL</td>
                <td style={{color:'#22c55e',fontWeight:700}}>
                  {totalCO2.toFixed(1)} tons
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}