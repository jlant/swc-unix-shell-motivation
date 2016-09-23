// create group to hold all the features
var feature_group = new L.featureGroup([]);

// create basemaps
var grayscale = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var streets = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
});

var opentopomap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// create map
var map = L.map('map', {
    center: [40.5, -75],
    zoom: 7,
    maxZoom: 19,
    layers: [grayscale]
})

// create popup content for each layer
function popup_drbbasin(feature, layer) {
	var popupContent = 'Delaware River Basin';
	layer.bindPopup(popupContent);
}

function popup_waterbasins(feature, layer) {
	var popupContent = '<table><tr><th scope="row">STAID</th><td>' + String(feature.properties['STAID']) + '</td></tr><tr><th scope="row">DA (SQMI)</th><td>' + String(feature.properties['da_sqmi']) + '</td></tr><tr><th scope="row">ForestSum</th><td>' + String(feature.properties['ForestSum']) + '</td></tr><tr><th scope="row">AgSum</th><td>' + String(feature.properties['AgSum']) + '</td></tr><tr><th scope="row">DevSum</th><td>' + String(feature.properties['DevSum']) + '</td></tr><tr><th scope="row">FORdivAG</th><td>' + String(feature.properties['FORdivAG']) + '</td></tr></table>';
	layer.bindPopup(popupContent);
}

function popup_streams(feature, layer) {
	var popupContent = '<table><tr><th scope="row">Name</th><td>' + String(feature.properties['NAME']) + '</td></tr><tr><th scope="row">Length (KM)</th><td>' + String(feature.properties['LengthKM']) + '</td></tr></table>';
	layer.bindPopup(popupContent);
}

function popup_usgsgages(feature, layer) {
	var popupContent = '<table><tr><th scope="row">Gage</th><td>' + String(feature.properties['gage']) + '</td></tr><tr><th scope="row">State</th><td>' + String(feature.properties['State']) + '</td></tr><tr><th scope="row">Name</th><td>' + String(feature.properties['Name']) + '</td></tr><tr><th scope="row">Latitude</th><td>' + String(feature.properties['LatitudeDD']) + '</td></tr><tr><th scope="row">Longitude</th><td>' + String(feature.properties['LongitudeD']) + '</td></tr><tr><th scope="row">HUC8</th><td>' + String(feature.properties['HUC8']) + '</td></tr><tr><th scope="row">DA</th><td>' + String(feature.properties['DA']) + '</td></tr></table>';
	layer.bindPopup(popupContent);
}

// styles for each feature
function style_drbbasin(feature) {
		return {
			color: '#afb38a',
			fillColor: '#fdbf6f',
			weight: 2,
			dashArray: '',
			opacity: 0.439215686275,
			fillOpacity: 0.439215686275
		};
}

function style_waterbasins(feature) {
		return {
			color: '#809848',
			fillColor: '#088A29',
			weight: 3,
			dashArray: '',
			opacity: 0.486274509804,
			fillOpacity: 0.486274509804
		};
}

function style_streams(feature) {
		return {
			weight: 1.3,
			color: '#1f78b4',
			dashArray: '',
			opacity: 1.0,
			fillOpacity: 1.0
		};
}

var drbbasin = new L.geoJson(drbbasin, {
	onEachFeature: popup_drbbasin,
	style: style_drbbasin
});

var waterbasins = new L.geoJson(waterbasins, {
	onEachFeature: popup_waterbasins,
	style: style_waterbasins
});

var streams = new L.geoJson(streams, {
	onEachFeature: popup_streams,
	style: style_streams
});

var usgsgages = new L.geoJson(usgsgages, {
	onEachFeature: popup_usgsgages,
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			radius: 6.0,
			fillColor: '#000000',
			color: '#000000',
			weight: 1,
			opacity: 1.0,
			fillOpacity: 1.0
		})
	}
});

var cluster_group_usgsgages = new L.MarkerClusterGroup({showCoverageOnHover: false});

// add layers to groups
feature_group.addLayer(drbbasin);
feature_group.addLayer(waterbasins);

cluster_group_usgsgages.addLayer(usgsgages);

// show features on map
cluster_group_usgsgages.addTo(map);
feature_group.addTo(map);

var baseLayers = {
	"Grayscale": grayscale,
	"Streets": streets,
    "Topo": opentopomap
};

var overlays = {
    "USGS gages": cluster_group_usgsgages,
    "Streams": streams,
    "Sample basins": waterbasins,
    "DRB basin": drbbasin
};

L.control.layers(baseLayers, overlays).addTo(map);
L.control.scale().addTo(map);

if(typeof MainWindow != 'undefined') {
    var onMapMove = function() { MainWindow.onMapMove(map.getCenter().lat, map.getCenter().lng) };
    map.on('move', onMapMove);
    onMapMove();
}
