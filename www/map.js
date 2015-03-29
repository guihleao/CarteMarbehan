// Openlayers - Carte des services - Julien Minet - julien_wa@yahoo.fr - Avril 2014
 
// Parametres generaux et definitions des variables
var map, gnormal, ghyb, gbase, osm, geojson, communes;
var proj = new OpenLayers.Projection("EPSG:900913");
var projLB = new OpenLayers.Projection("EPSG:31370");
var dispproj = new OpenLayers.Projection("EPSG:4326");
var bounds = new OpenLayers.Bounds(4.7, 49.5, 6.2, 50.5);
bounds.transform(dispproj,proj);

// Options de la carte
var options = {
	controls: [],
	projection: proj,
	displayProjection: dispproj,
	units: "m",
	numZoomLevels: 10,
	maxResolution: 1500,
	maxExtent: bounds
	};

// Creation de la carte - debut de la fonction init
function init() {
    map = new OpenLayers.Map('map', options);
 	    
    // Ajout des couches de base 
    var opencyclemap = new OpenLayers.Layer.OSM("OpenCycleMap", ['http://a.tile.thunderforest.com/cycle/${z}/${x}/${y}.png','http://b.tile.thunderforest.com/cycle/${z}/${x}/${y}.png','http://c.tile.thunderforest.com/cycle/${z}/${x}/${y}.png'],{isBaseLayer:true});
    opencyclemap.displayInLayerSwitcher = false;
    map.addLayer(opencyclemap);

    // Couche des POIs
    // Definition des icones        
    var styleGeoJSON = new OpenLayers.Style( {pointRadius:16, fillOpacity:0.8, graphicYOffset:-16, cursor:"pointer"},{
      	    rules: [
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "shop", value: "bakery"}),
	       	    symbolizer: {externalGraphic:'./img/bread.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "shop", value: "butcher"}),
	       	    symbolizer: {externalGraphic:'./img/butcher-2.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "shop", value: "car"}),
	       	    symbolizer: {externalGraphic:'./img/car.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "shop", value: "optician"}),
	       	    symbolizer: {externalGraphic:'./img/glasses.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "shop", value: "supermarket"}),
	       	    symbolizer: {externalGraphic:'./img/supermarket.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "shop", value: "doityourself"}),
	       	    symbolizer: {externalGraphic:'./img/tools.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "amenity", value: "fast_food"}),
	       	    symbolizer: {externalGraphic:'./img/restaurant.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "amenity", value: "pharmacy"}),
	       	    symbolizer: {externalGraphic:'./img/drugstore.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "amenity", value: "pub"}),
	       	    symbolizer: {externalGraphic:'./img/bar.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "amenity", value: "restaurant"}),
	       	    symbolizer: {externalGraphic:'./img/restaurant.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "amenity", value: "school"}),
	       	    symbolizer: {externalGraphic:'./img/school.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO, property: "amenity", value: "kindergarten"}),
	       	    symbolizer: {externalGraphic:'./img/daycare.png'}
		})
				]
			}
		);


    // Modification de la taille de l'icone une fois selectionnee
    var style_sel = new OpenLayers.Style({pointRadius:18});
    var styleMapGeoJSON = new OpenLayers.StyleMap({'default': styleGeoJSON, 'select':style_sel});
	    
    // Definition de la couche des POIs    
    geojson = new OpenLayers.Layer.Vector("Commerces & Services", {protocol: new OpenLayers.Protocol.HTTP({url:"./data/Marbehan.geojson", format: new OpenLayers.Format.GeoJSON()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: dispproj, extractAttributes: true, styleMap:styleMapGeoJSON});

    // Ajout de toutes les couches
    map.addLayers([geojson]);

    // Ajout des Popups sur les couches thematiques
	var selectControl = new OpenLayers.Control.SelectFeature([geojson], {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect}); 
	map.addControl(selectControl);
	selectControl.activate();

	function onFeatureSelect(feature) {
	selectedFeature = feature;
        if (feature.attributes.name != undefined) {p_name = feature.attributes.name} else {p_name = ""}
        //alert(feature.attributes.addr:street)
        //if (feature.attributes.addr:street != undefined) {p_addr_street = feature.attributes.addr:street} else {p_addr_street = ""}
        //if (feature.attributes.addr:housenumber != undefined) {p_addr:housenumber = feature.attributes.addr:housenumber} else {p_addr:housenumber = ""}
        //if (feature.attributes.addr:city != undefined) {p_addr:city = feature.attributes.addr:city} else {p_addr:city = ""}
        if (feature.attributes.phone != undefined) {p_phone = feature.attributes.phone} else {p_phone = ""}
        if (feature.attributes.website != undefined) {p_website = feature.attributes.website} else {p_website = ""}
        if (feature.attributes.opening_hours != undefined) {p_opening_hours = formatOpening_hours(feature);} else {p_opening_hours = ""}
        
        var popupcontent = "<div id='popup_name'>" + p_name + "</div><div id='popup'>" + p_phone + '<br><a target="_blank" href="' + p_website + '">' + p_website + '</a><br>' + p_opening_hours + "</div>";
	var popup = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(100,100),
			popupcontent,
			null, true, 
			onPopupClose);
			feature.popup = popup;
			map.addPopup(popup)	}

	function onPopupClose(evt) {
	selectControl.unselect(selectedFeature);  }
	  
	function onFeatureUnselect(feature) {
	map.removePopup(feature.popup);
	feature.popup.destroy();
	feature.popup = null;   }  
		
	
    // Ajout des controles
    map.addControl(new OpenLayers.Control.Navigation());
    map.addControl(new OpenLayers.Control.Zoom());
    map.addControl(new OpenLayers.Control.Attribution());

    var bounds = new OpenLayers.Bounds(5.526, 49.72, 5.55, 49.73); bounds.transform(dispproj,proj);
    map.zoomToExtent(bounds);

	     
}     // fin de la fonction init 
	

