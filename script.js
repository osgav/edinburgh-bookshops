
////////////////////////////////////////////////////////////////////////////////
//// initialize Leaflet map
//
var map = L.map("map", {
  zoomSnap: 0.05
}) .setView([55.9400, -3.1925], 12.35);



////////////////////////////////////////////////////////////////////////////////
//// configure map debug information
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
//// configure basemap
//
var basemap = protomapsL.leafletLayer({url: "edinburgh.pmtiles", theme: "white"});
basemap.addTo(map);



////////////////////////////////////////////////////////////////////////////////
//// configure point styles
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

function style_bookshop_point_reset(feature) {
  return style_bookshop_point;
}

function style_bookshop_point_selected(feature) {
  return {
    radius: 16,
    weight: 4,
    color: "#954AA2",
    fillColor: "#954AA2",
    fillOpacity: 0.7,
    opacity: 1,
  };
}



////////////////////////////////////////////////////////////////////////////////
//// load features
//
const bookshops = L.geoJson(bookshop_points, {
  pointToLayer: function (feature, latlng) {
    return L.circle(latlng, style_bookshop_point);
  },
  onEachFeature
});



////////////////////////////////////////////////////////////////////////////////
//// define info box behaviour
//
const infoBox = document.querySelector("#infobox");
const closeInfoBoxBtn = document.querySelector("#close-info");

closeInfoBoxBtn.addEventListener("click", hideInfoBox);

function showInfoBox() {
  //infoBox.style.visibility = "visible";
  infoBox.classList.remove("hide");
}

function hideInfoBox() {
  //infoBox.style.visibility = "hidden";
  infoBox.classList.add("hide");
}

function updateInfoBox(bookshop_data) {
  const infoBoxBookshopName = document.querySelector("#bookshop-name");
  const infoBoxBookshopAddress1 = document.querySelector("#bookshop-address-line-1");
  const infoBoxBookshopAddress2 = document.querySelector("#bookshop-address-line-2");
  const infoBoxBookshopPostcode = document.querySelector("#bookshop-postcode");
  const infoBoxBookshopCity = document.querySelector("#bookshop-city");
  const infoBoxBookshopWebsite = document.querySelector("#bookshop-website");
  const infoBoxBookshopGoogleMaps = document.querySelector("#bookshop-google-maps");
  infoBoxBookshopName.textContent = bookshop_data.name;
  infoBoxBookshopAddress1.textContent = bookshop_data.address_line_1;
  infoBoxBookshopAddress2.textContent = bookshop_data.address_line_2;
  infoBoxBookshopPostcode.textContent = bookshop_data.postcode;
  infoBoxBookshopCity.textContent = bookshop_data.city;
  infoBoxBookshopWebsite.textContent = bookshop_data.website;
  infoBoxBookshopGoogleMaps.textContent = bookshop_data.google_maps;
}

function clearInfoBox() {
  const infoBoxBookshopName = document.querySelector("#bookshop-name");
  const infoBoxBookshopAddress1 = document.querySelector("#bookshop-address-line-1");
  const infoBoxBookshopAddress2 = document.querySelector("#bookshop-address-line-2");
  const infoBoxBookshopPostcode = document.querySelector("#bookshop-postcode");
  const infoBoxBookshopCity = document.querySelector("#bookshop-city");
  const infoBoxBookshopWebsite = document.querySelector("#bookshop-website");
  const infoBoxBookshopGoogleMaps = document.querySelector("#bookshop-google-maps");
  infoBoxBookshopName.textContent = "";
  infoBoxBookshopAddress1.textContent = "";
  infoBoxBookshopAddress2.textContent = "";
  infoBoxBookshopPostcode.textContent = "";
  infoBoxBookshopCity.textContent = "";
  infoBoxBookshopWebsite.textContent = "";
  infoBoxBookshopGoogleMaps.textContent = "";
}



////////////////////////////////////////////////////////////////////////////////
//// ...
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




function selectBookshop(e) {
  showInfoBox();
  updateInfoBox(e.target.feature.properties);
  console.log(e);
  e.target.setStyle(style_bookshop_point_selected(e.target.feature));
  e.target.setRadius(26);
}

function deselectBookshop(e) {
  hideInfoBox();
  clearInfoBox();
  e.target.setStyle(style_bookshop_point_reset(e.target.feature));
  e.target.setRadius(16);
}


function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
  layer.on({
  //  click: zoomToFeature,
    popupopen: selectBookshop,
    popupclose: deselectBookshop,
  });
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






