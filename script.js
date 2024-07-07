
////////////////////////////////////////////////////////////////////////////////
// initialize Leaflet map
//
var map = L.map("map", {
  zoomSnap: 0.05
}) .setView([55.9400, -3.1925], 12.35);


////////////////////////////////////////////////////////////////////////////////
// configure map debug information
//
map.whenReady(updateDebugInfoZoom);
map.whenReady(updateDebugInfoBounds);
map.whenReady(updateDebugInfoCenter);

map.on("zoomstart zoom zoomend", updateDebugInfoZoom);
map.on("zoomstart zoom zoomend movestart move moveend", updateDebugInfoBounds);
map.on("zoomstart zoom zoomend movestart move moveend", updateDebugInfoCenter);
map.on("mousemove", updateDebugInfoMouse);

function updateDebugInfoZoom(event) {
  const debugInfoZoom = document.querySelector("#zoom");
  debugInfoZoom.textContent = `Zoom level: ${map.getZoom()}`;
}

function updateDebugInfoBounds(event) {
  const debugInfoBounds = document.querySelector("#bounds");
  debugInfoBounds.textContent = `Bounds: ${map.getBounds().toBBoxString()}`;
}

function updateDebugInfoCenter(event) {
  const debugInfoCenter = document.querySelector("#center");
  debugInfoCenter.textContent = `Map center: ${map.getCenter().toString()}`;
}

function updateDebugInfoMouse(event) {
  const debugInfoMouse = document.querySelector("#mouse");
  debugInfoMouse.textContent = `Mouse location: ${event.latlng.toString()}`;
}


////////////////////////////////////////////////////////////////////////////////
// configure basemap
//
var basemap = protomapsL.leafletLayer({url: "edinburgh.pmtiles", theme: "white"});
basemap.addTo(map);


////////////////////////////////////////////////////////////////////////////////
// configure point styles
//
var style_point = {
    radius: 16,
    weight: 4,
    color: "#008800",
    fillColor: "#008800",
    fillOpacity: 0.25,
    opacity: 1,
};

var style_bookshop_point = {
    radius: 16,
    weight: 4,
    color: "#954AA2",
    fillColor: "#954AA2",
    fillOpacity: 0.25,
    opacity: 1,
};

////////////////////////////////////////////////////////////////////////////////
// load features
//
const bookshops = L.geoJson(bookshop_points, {
  pointToLayer: function (feature, latlng) {
    return L.circle(latlng, style_bookshop_point);
  },
  onEachFeature
});




////////////////////////////////////////////////////////////////////////////////
// ...
//
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function style(feature) {
  return {
    weight: 2.5,
    color: "#000000",
  };
}



function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
  //layer.on({
  //  click: zoomToFeature,
  //});
}


var pointMarkers = new L.FeatureGroup();
pointMarkers.addLayer(bookshops);

map.on("zoomend", function() {
  if (map.getZoom() < 8) {
    map.removeLayer(pointMarkers);
    //paths.setStyle(f => ({weight: 5}));
  } else {
    map.addLayer(pointMarkers);
  }
});

