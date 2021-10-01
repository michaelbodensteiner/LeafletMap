var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {

    var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        accessToken: API_KEY});
    
    var map = L.map("map", {
        center: [30,-20],
        zoom: 3,});
    greyscaleMap.addTo(map);

    function setColor(magnitude) {
        if (magnitude > 5){
            return "#dc143c";}
        if (magnitude > 4){
            return "#d84f3a";}
        if (magnitude > 3){
            return "#d67238";}
        if (magnitude > 2){
            return "#d2a137";}
        if (magnitude > 1){
            return "#cfd035";}
        else {
            return "#ccff33";}
    }

    function setRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    function styleInfo(feature) {
        return {
        fillOpacity: 1,
        fillColor: setColor(feature.properties.mag),
        weight: 0.2,
        radius: setRadius(feature.properties.mag),
        stroke: true
        };
    }

    var earthquakes = new L.LayerGroup();
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }

    }).addTo(earthquakes);
    earthquakes.addTo(map);

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        
        var div = L.DomUtil.create("div", "info legend");
   
        var magColor = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < magColor.length; i++) {
            div.innerHTML += "<i style='background: " + setColor(magColor[i]) + "'></i> " +
            magColor[i] + (magColor[i + 1] ? " - " + magColor[i + 1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(map);

});