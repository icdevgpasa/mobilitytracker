const checkbox = document.getElementById('onlyMine')

checkbox.addEventListener('change', (event) => {
  reloadPolygons(+event.currentTarget.checked);
})
  async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  alert('Obszar zapisany poprawnie!')
  return response.json(); // parses JSON response into native JavaScript objects
}
async function postDataWarehouse(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
 
  return response.json(); // parses JSON response into native JavaScript objects
}
function editRoutes() {
MicroModal.init('modal-1',{awaitCloseAnimation: true});
reloadPolygons(1);
MicroModal.show('modal-1');
}
function showHideStops() {
  if (countVisibleMarkers(window.map)>0) {
    //hide
    map.eachLayer((layer) => {
    if (layer instanceof L.Marker) { layer.remove();}
    });
  } else {
    fetch('https://mobilitytracker.ml/stops')
.then(response => response.json())
.then(data => {
    data.forEach(function(e,i,a) {
   
        var marker = L.marker([e.lat,e.lng]);
        marker.backend_id = e.id;
        marker.bindPopup("Przystanek: <b>"+e.name+"</b><br/>Nazwa skrócona: "+e.shortname+"<br/><br/>Dzielnica: "+(e.district || "---")+"<br/><br/><b>Lat:</b> "+e.lat+"<br/><b>Lng:</b>"+e.lng).addTo(map);

    });
});

  }

}
function reloadPolygons(mine) {
  document.getElementById("polygonFrom").innerHTML = "";
  document.getElementById("polygonTo").innerHTML = "";
  //document.getElementById('onlyMine').checked = true;
  fetch('https://mobilitytracker.ml/polygon/'+mine)
.then(response => response.json())
.then(data => {
  let polygonFrom = document.querySelector('#polygonFrom');
  let polygonTo = document.querySelector('#polygonTo');
  var opt = document.createElement("option");
    opt.value="0";
    opt.text = "wybierz...";
    var opt2= document.createElement("option");
    opt2.value="0";
    opt2.text = "wybierz...";
    polygonFrom.add(opt,null);
    polygonTo.add(opt2,null);

  data.forEach(function(e,i,a) {
    var opt = document.createElement("option");
    opt.value = e.id;//JSON.stringify(e.polygon);
    opt.text = e.name;
    var opt2 = document.createElement("option");
    opt2.value = e.id//JSON.stringify(e.polygon);
    opt2.text = e.name;
    polygonFrom.add(opt,null);
    polygonTo.add(opt2,null);

  });

});
}
function countVisibleMarkers(map) {
    var bounds = map.getBounds();
    var count = 0;

    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            count++;
         }
    });
    return count;
}
async function search() {

  MicroModal.close('modal-1');
//magic happenes here
//JSON.parse

let polygonFrom = document.querySelector('#polygonFrom').value;
let polygonTo = document.querySelector('#polygonTo').value;
let timeFrom = document.querySelector('#timeFrom').value;
let timeTo = document.querySelector('#timeTo').value;
let dateFrom = document.querySelector('#dateFrom').value;
let dateTo = document.querySelector('#dateTo').value;
let workingDays = document.querySelector('#workingDays').checked;
let saturDay = document.querySelector('#saturDay').checked;
let sunDay = document.querySelector('#sunDay').checked;

let resp = await postDataWarehouse('https://mobilitytracker.ml/data', {polygonFrom: polygonFrom,polygonTo:polygonTo,timeFrom:timeFrom,timeTo:timeTo,dateFrom:dateFrom,dateTo:dateTo,workingDays:workingDays,saturDay:saturDay,sunDay:sunDay});
console.log(resp.data);
let out='';
var data2=[];
resp.data.forEach(function(e,i,a) {
out = out+'<tr><td>'+e.ED+"</td><td>"+e.ile+"</td></tr>";

});
out = "<table style='width:150px;'>"+out+"</table>";
let pf = L.polygon(JSON.parse(resp.params.pF.polygon),{'color':'#3388ff'});
    pf.bindTooltip("<div style='text-align:center; font-size:16px; color:#3388ff;'><b>"+resp.params.pF.name+"</b></div>",{permanent: true, direction:"center"}).openTooltip();
    pf.from =true;
    pf.addTo(window.editableLayers);
    window.map.fitBounds(editableLayers.getBounds());
    let pt = L.polygon(JSON.parse(resp.params.pT.polygon),{'color':'red'});
    pt.bindTooltip("<div style='text-align:center; font-size:16px;'><b style='color:red;'>"+resp.params.pT.name+"</b>"+out+"</div>",{permanent: true, direction:"center"}).openTooltip();
    pt.to=true;
    pt.addTo(window.editableLayers);
    window.map.fitBounds(editableLayers.getBounds());
let from;
let to;
from  = pf.getBounds().getCenter();
to = pt.getBounds().getCenter();
resp.data.forEach(function(e,i,a) {
  out = out+'<tr><td>'+e.ED+"</td><td>"+e.ile+"</td></tr>";
  data2.push({value:e.ile/200,"from": [from.lng+((Math.random()-0.5)*2/1000),from.lat+((Math.random()-0.5)*2/1000)],"to":[to.lng+((Math.random()-0.5)*2/1000),to.lat+((Math.random()-0.5)*2/1000)],"labels":[null,null],"color":'#'+Math.floor(Math.random()*16777215).toString(16)});
  });
setTimeout(function() {
  console.log(data2);
window.migrationLayer.setData(data2);
if (data2.length<1) {
  window.migrationLayer.hide();
  alert('Brak danych dla wybranych kryteriów!');
  editRoutes();
} else {
  window.migrationLayer.show();

}
  window.map.fitBounds(window.editableLayers.getBounds());
  window.map.touchZoom.disable();
window.map.doubleClickZoom.disable();
window.map.scrollWheelZoom.disable();
window.map.boxZoom.disable();
window.map.keyboard.disable();
document.querySelector(".leaflet-control-zoom").style.visibility="hidden";

},500);
}

document.addEventListener("DOMContentLoaded", function() {
  



  function clearPolygons(from) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) { layer.remove();}
    if(layer instanceof L.Polygon) { 
      console.log(layer);
      if (from) {
        if (layer.from) {
          layer.remove();
        }
      } else {
        if (layer.to) {
          layer.remove();

        }
      }
      }
});
}
  let polygonFrom = document.querySelector('#polygonFrom');
  let polygonTo = document.querySelector('#polygonTo');
  polygonFrom.addEventListener('change',function(e) {
    clearPolygons(true);
    console.log(e.target.value);
    // let pf = L.polygon(JSON.parse(e.target.value),{'color':'#3388ff'});
    // pf.bindTooltip("<div style='text-align:center; font-size:16px; color:#3388ff;'><b>"+e.target.options[e.target.selectedIndex].text+"</b></div>",{permanent: true, direction:"center"}).openTooltip();
    // pf.from =true;
    // pf.addTo(editableLayers);
    // map.fitBounds(editableLayers.getBounds());
  })
  polygonTo.addEventListener('change',function(e) {
    console.log(e.target.value);
    clearPolygons(false);
    // let pt = L.polygon(JSON.parse(e.target.value),{'color':'red'});
    // pt.bindTooltip("<div style='text-align:center; font-size:16px; color:red;'><b>"+e.target.options[e.target.selectedIndex].text+"</b></div>",{permanent: true, direction:"center"}).openTooltip();
    // pt.to=true;
    // pt.addTo(editableLayers);
    // map.fitBounds(editableLayers.getBounds());
  })
  let offset = (24*60*60*1000) * 1;
let today = new Date();
let sDate = new Date();
let oneWeekAgo = new Date();
sDate.setTime((new Date()).getTime() - (24*60*60*1000) * 95);
oneWeekAgo.setTime(today.getTime() - (24*60*60*1000) * 65);

document.getElementById('dateTo').valueAsDate = oneWeekAgo;
document.getElementById('dateFrom').valueAsDate = sDate;

document.querySelector('#mapComponent').style.height=(document.body.clientHeight-50)+"px";
var map = L.map('mapComponent',{drawControl:false, zoomControl: false }).setView([50.089722,18.530880], 14);
window.map = map;
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWNkZXZncGFzYWNvbSIsImEiOiJja2xnbjdxZzExaGgzMnltZ2MzYWU4bHFuIn0.XkFyVxXqBWNMViAJW-13UA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 38,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaWNkZXZncGFzYWNvbSIsImEiOiJja2xnbjdxZzExaGgzMnltZ2MzYWU4bHFuIn0.XkFyVxXqBWNMViAJW-13UA'
}).addTo(map);
L.control.zoom({
    position: 'bottomright'
}).addTo(map);
var editableLayers = new L.FeatureGroup();
window.editableLayers = editableLayers;
//map.addLayer(editableLayers);
L.drawLocal.draw.toolbar.actions.title = 'Anuluj';
L.drawLocal.draw.toolbar.actions.text = 'Anuluj';
L.drawLocal.draw.toolbar.finish.title = 'Zakończ';
L.drawLocal.draw.toolbar.finish.text = 'Zakończ';
L.drawLocal.draw.toolbar.undo.title = 'Usuń ostatni punkt';
L.drawLocal.draw.toolbar.undo.text = 'Usuń ostatni punkt';
L.drawLocal.draw.handlers.polygon.tooltip.start = 'Kliknij aby rozpocząć rysowanie';
L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Kliknij aby dodać następny punkt';
L.drawLocal.draw.handlers.polygon.tooltip.end = 'Kliknij w pierwszy punkt aby zakończyć rysowanie obszaru';
L.drawLocal.draw.toolbar.buttons.polygon = 'Kliknij aby dodać nowy obszar';

var options = {
  position: 'bottomright',
  draw: {
    polygon: {
      title : 'Kliknij aby utworzyć nowy obręb',
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    polyline: {
    	shapeOptions: {
        color: '#f357a1',
        weight: 100
          }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: false, // Turns off this drawing tool
    polygon: true,
    marker: false,
    circlemarker: false,
    rectangle: false,
  },
  
};
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.addLayer(editableLayers);
var data3=[{"from":[-73.875523,40.781063],"to":[-80.247887,25.792296],"labels":["New York","Maima"],"color":"#05ffd9"},{"from":[-73.875523,40.781063],"to":[-118.2705,33.9984],"labels":[null,"Los Angeles"],"color":"#00ccff"},{"from":[-73.875523,40.781063],"to":[-87.724088,41.917846],"labels":[null,"Chicago"],"color":"#ffc726"},{"from":[-73.875523,40.781063],"to":[-71.058437,42.35902],"labels":[null,"Boston"],"color":"#e9ff20"},{"from":[-73.875523,40.781063],"to":[-75.683057,45.42172],"labels":[null,"Ottawa"],"color":"#99ff1b"}];

  var migrationLayer = new L.migrationLayer({
    map: window.map,
    data: data3,
    pulseRadius:1,
          pulseBorderWidth:1,
        
          arcLabel:true,
          arcLabelFont:'10px sans-serif',
          maxWidth:10
  });
  window.migrationLayer = migrationLayer;
  migrationLayer.hide();
  migrationLayer.addTo(window.editableLayers);
function isMarkerInsidePolygon(marker, poly) {
    var inside = false;
    var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
    for (var ii=0;ii<poly.getLatLngs().length;ii++){
        var polyPoints = poly.getLatLngs()[ii];
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    }

    return inside;
};
map.on('draw:created', function(e) {
  var type = e.layerType;
   let layer = e.layer;
  if (type==='polygon') {
   // drawnItems.addLayer(layer);
    let polygon = layer.getLatLngs();
    let polygonLayer = layer;
    console.log(polygon);
    let markers = [];
    map.eachLayer((layer) => {
    if(layer instanceof L.Marker && map.getBounds().contains(polygon)) {
      if (isMarkerInsidePolygon(layer, polygonLayer)) {
        if (layer._popupHandlersAdded) {
          markers.push(layer.backend_id);
        }
      }
    }
  });
  setTimeout(function() {
    let person = prompt("Podaj nazwę obszaru", "");
    console.log("MAMY MARKERY");
    console.log(person);
    console.log(polygon);
    console.log(markers);
    if (person.length<1) {
      alert('Musisz podać nazwę')
    } else {
     map.removeLayer(polygonLayer);
    postData('https://mobilitytracker.ml/polygon', {name: person, polygon: polygon, markers : markers});
     }
   },100);
 }

  if (type === 'polyline') {
    layer.bindPopup('A polyline!');
  } else if ( type === 'polygon') {
    console.log(e);
  	layer.bindPopup('A polygon!');
  } else if (type === 'marker') 
  {layer.bindPopup('marker!');}
  else if (type === 'circle') 
  {layer.bindPopup('A circle!');}
   else if (type === 'rectangle') 
  {layer.bindPopup('A rectangle!');}


  editableLayers.addLayer(layer);
});

fetch('https://mobilitytracker.ml/stops')
.then(response => response.json())
.then(data => {
    data.forEach(function(e,i,a) {
   
        var marker = L.marker([e.lat,e.lng]);
        marker.backend_id = e.id;
        marker.bindPopup("Przystanek: <b>"+e.name+"</b><br/>Nazwa skrócona: "+e.shortname+"<br/><br/>Dzielnica: "+(e.district || "---")+"<br/><br/><b>Lat:</b> "+e.lat+"<br/><b>Lng:</b>"+e.lng).addTo(map);

    });
});


});
