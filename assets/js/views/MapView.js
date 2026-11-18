/** Mapa cartográfico OSM; marcadores e parceiros são dados fictícios. */
import {DatabaseModel} from '../models/DatabaseModel.js';
export class MapView {
  static map=null;static fence=null;static person=null;static partners=[];
  static init(){if(this.map||typeof L==='undefined')return;const db=DatabaseModel.read();this.map=L.map('map',{scrollWheelZoom:false}).setView(db.location.home,15);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:19}).addTo(this.map);this.render();}
  static render(){const db=DatabaseModel.read();if(!db)return;const {location,partners}=db;
    document.getElementById('fenceRadius').value=location.radius;document.getElementById('radiusValue').textContent=location.radius;document.getElementById('geoStatus').innerHTML=`<span class="badge ${location.inside?'status-safe':'text-bg-danger'} p-2">${location.inside?'Dentro da cerca virtual':'Fora da cerca virtual'}</span><p class="small muted mt-2 mb-0">Posição fictícia: ${location.position.map(x=>x.toFixed(4)).join(', ')}</p>`;
    if(!this.map)return;
    if(this.fence)this.map.removeLayer(this.fence);this.fence=L.circle(location.home,{radius:location.radius,color:location.inside?'#006D77':'#D9531E',fillColor:'#006D77',fillOpacity:.12,weight:2}).addTo(this.map).bindPopup('Cerca virtual residencial (simulada)');
    const icon=L.divIcon({className:'',html:`<div class="map-dot ${location.inside?'':'warn'}"></div>`,iconSize:[28,28],iconAnchor:[14,14]});
    if(this.person)this.map.removeLayer(this.person);this.person=L.marker(location.position,{icon}).addTo(this.map).bindPopup('Maria Oliveira • DEMO-IDOSO-001 (posição simulada)');
    this.partners.forEach(p=>this.map.removeLayer(p));this.partners=partners.map(p=>L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:'<div style="background:#0F2C59;color:white;border-radius:50%;padding:7px;box-shadow:0 2px 12px #3335"><i class="bi bi-hospital"></i></div>',iconSize:[32,32]})}).addTo(this.map).bindPopup(`${p.name}<br>${p.type}<br>Parceiro fictício`));
  }
  static reveal(){this.init();setTimeout(()=>this.map?.invalidateSize(),100);}
  static zoomToPerson(){if(this.map){this.map.flyTo(DatabaseModel.read().location.position,15,{duration:.8});}}
}
