import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
delete L.Icon.Default.prototype._getIconUrl;

const BINS = [
  {id:'BIN-001',lat:31.5204,lng:74.3587,fill:0.92,type:'plastic',  zone:'Gulberg III'},
  {id:'BIN-002',lat:31.5134,lng:74.3290,fill:0.45,type:'organic',  zone:'DHA Phase 1'},
  {id:'BIN-003',lat:31.5320,lng:74.3450,fill:0.78,type:'metal',    zone:'Model Town'},
  {id:'BIN-004',lat:31.5410,lng:74.3600,fill:0.21,type:'glass',    zone:'Johar Town'},
  {id:'BIN-005',lat:31.5250,lng:74.3700,fill:0.88,type:'hazardous',zone:'Gulberg III'},
  {id:'BIN-006',lat:31.5180,lng:74.3400,fill:0.60,type:'plastic',  zone:'Garden Town'},
  {id:'BIN-007',lat:31.5380,lng:74.3520,fill:0.15,type:'organic',  zone:'Bahria Town'},
  {id:'BIN-008',lat:31.5090,lng:74.3650,fill:0.95,type:'hazardous',zone:'DHA Phase 5'},
];

const color = (fill, type) => {
  if (type === 'hazardous') return '#ef4444';
  if (fill >= 0.85) return '#f59e0b';
  if (fill >= 0.5)  return '#3b82f6';
  return '#22c55e';
};

export default function WasteMap() {
  const full      = BINS.filter(b => b.fill >= 0.85).length;
  const hazardous = BINS.filter(b => b.type === 'hazardous').length;

  return (
    <div>
      <div style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
        {[
          {label:'Total Bins',  value:BINS.length, color:'#38bdf8'},
          {label:'Full (>85%)', value:full,         color:'#f59e0b'},
          {label:'Hazardous',   value:hazardous,    color:'#ef4444'},
          {label:'Normal',      value:BINS.length - full - hazardous, color:'#22c55e'},
        ].map(s => (
          <div key={s.label} className="card" style={{flex:1,textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',fontWeight:700,color:s.color}}>{s.value}</div>
            <div style={{fontSize:'0.75rem',color:'#64748b'}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <MapContainer center={[31.5204, 74.3587]} zoom={13}
          style={{height:'500px',width:'100%',borderRadius:12}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {BINS.map(bin => (
            <CircleMarker key={bin.id} center={[bin.lat, bin.lng]}
              radius={16} fillColor={color(bin.fill, bin.type)}
              color="#0f172a" weight={2} fillOpacity={0.9}>
              <Popup>
                <strong>{bin.id}</strong><br/>
                Zone: {bin.zone}<br/>
                Type: {bin.type}<br/>
                Fill: {Math.round(bin.fill*100)}%
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}