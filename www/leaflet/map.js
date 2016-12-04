// Carte des services - LeafletJS - dec. 2016

var webmap = {

   ///////////////
	// VARIABLES //
	///////////////
	markerList : [],
	showPanel : true,
	showPanelXs : false,
	markerLayer: null,	
	url : "data/Marbehan.geojson",

	/////////////
	// OBJECTS //
	/////////////
	
	// Map creation (using LeafletJS)
	Lmap : L.map('map').setView([49.73, 5.54], 13),
		
	///////////////
	// FUNCTIONS //   - by alphabetic order, except init()
	///////////////
	
   // Add points of interests to the list
   add2list: function(index, feature, category) {
 
   	var featureName, catItems, imgFile;
   	
      if (feature.properties.name != undefined) {poi_name = feature.properties.name} else {poi_name = ""}         
           
      [catItems, imgFile] = webmap.mapCategory(feature);
          
      if (catItems === category) { // TO DO: add here a condition to see if the feature is on the current view 
         poi_content = webmap.formatInfo(feature, index);

         $("#list").append("<div class='poi'><div class='poi_icon'><img src='img/" + imgFile + ".png' onclick=\"webmap.selectPoi('" + index + "')\"></div><div class='poi_name'><a href=\"javascript:webmap.selectPoi('" + index + "');\">" + poi_name + "</a></div>" + poi_content + "</div>");
         
         // hide poi_content for each element
         $('#pid_' + index).hide()

      }
 
   },

	// Select POI: show poi_content and highlight the poi on the map
	selectPoi : function (index) {
      console.log(index)
		// Show poi_content
		var ishidden = $('#pid_' + index).is(':hidden');
		if(ishidden) {
         $('#pid_' + index).show() 
      }
      else{
      	$('#pid_' + index).hide()
      }
	
      // show popup
      //webmap.Lmap.layers_....
      webmap.markerList[index].openPopup();
		
		// Highlight poi on the map
		
       	
	},	
	
		
	// User experience / responsiveness functions (using jquery)
	// Hide/show panel
	collapsePanel : function(){
		if(webmap.showPanel === true){
		   $('div#panel').css('width','35px');
		   $('div#panelContent').css('opacity','0');
		   $('div#collapseBtn button').text('>');
		   webmap.showPanel =! webmap.showPanel;
		}
	   else{
		   $('div#panel').css('width','300px');
		   $('div#panelContent').css('opacity','1');
		   $('div#collapseBtn button').text('<');
		   webmap.showPanel =! webmap.showPanel;
		}
	},
	
	collapsePanelXs : function(){
		if(webmap.showPanelXs === true){
		  $('div#panel').css('width','0px');
		  $('div#panelContent').css('opacity','0' );
		  webmap.showPanelXs =! webmap.showPanelXs;
		  }
	   else{
	     $('div#panel').css('width','calc(100% - 45px)');
	     $('div#panelContent').css('opacity','1');
		  webmap.showPanelXs =! webmap.showPanelXs;
		  }
	},
	
   formatInfo : function (feature, index) {
      var poi_content, poi_name, poi_addr_street, poi_addr_housenumber, poi_addr_city, poi_phone, poi_website, poi_opening_hours
   	
   	poi_phone = webmap.formatPhone(feature);
   	poi_website = webmap.formatWebsite(feature);
   	poi_opening_hours = webmap.formatOpeningHours(feature);
    
      poi_content = "<div class='poi_content' id='pid_" + index + "'>" + poi_phone + poi_website + poi_opening_hours + "</div>";
        
      return poi_content;
   }, 	
	
   formatPhone : function (feature){
   	var poi_phone;
   	var header = "<p class='phone'>";
      var footer = "</p>"; 
   	
   	if (feature.properties.phone != undefined) {
   		var phone = feature.properties.phone;
   		poi_phone = header + phone + footer;
   		} 
   	else {
   		poi_phone = "";
   	}
      
      return poi_phone;
   },	
	
	formatWebsite : function (feature){
   	var poi_website;
   	var header = "<p class='website'>";
      var footer = "</p>"; 
   	
   	if (feature.properties.website != undefined) {
   		var website = feature.properties.website;
   		poi_website = header + "<a target='_blank' href='" + website + "'>" + website + '</a>' + footer;
   		} 
   	else {
   		poi_website = "";
   	}
      
      return poi_website;
   },
	
	
   formatOpeningHours : function (feature){
   	var poi_opening_hours;
      var header = "<p class='opening_hours'><img src='img/openinghours.png'>";
      var footer = "</p>"; 
      
      if (feature.properties.opening_hours != undefined) {
   		var opening_hours = feature.properties.opening_hours;
   		opening_hours = opening_hours.replace("Mo", "Lundi");
         opening_hours = opening_hours.replace("Tu", "Mardi");
         opening_hours = opening_hours.replace("We", "Mercredi");
         opening_hours = opening_hours.replace("Th", "Jeudi");
         opening_hours = opening_hours.replace("Fr", "Vendredi");
         opening_hours = opening_hours.replace("Sa", "Samedi");
         opening_hours = opening_hours.replace("Su", "Dimanche");
         opening_hours = opening_hours.replace("24/7", "24h/24h");
         opening_hours = opening_hours.replace(",", ", ");
   		poi_opening_hours = header + opening_hours + footer;
   		} 
   	else {
   		poi_opening_hours = ""
   	}
          
      return poi_opening_hours;
      // find something in case of the opening_hours not well formated in OSM
   },	
		
   // Test if feature is in category and return corresponding icon file
   mapCategory : function (feature) {
      var cat, img_file, OSM_key_in_geojson, OSM_value_in_geojson    	

      if (feature.properties.amenity != undefined){
     	   OSM_key_in_geojson = "amenity";
     	   OSM_value_in_geojson = feature.properties.amenity;    
      } else {
         if (feature.properties.shop != undefined){
     	      OSM_key_in_geojson = "shop";    
            OSM_value_in_geojson = feature.properties.shop;         
         }      
         else {
            OSM_key_in_geojson = undefined;    
            OSM_value_in_geojson = undefined;    
         } 
     }     	

     // loop over the category on items.json
     for (i = 0; i < items.length; i++) {
        if (items[i].OSM_key == OSM_key_in_geojson && items[i].OSM_value == OSM_value_in_geojson){
           cat = items[i].category;
           img_file = items[i].png_file;
           break;
        }
        else {
           img_file = "foo";
        }
     }         
        
     return [cat, img_file];
   },	
	
	// Populate the list
   populateList : function(url) {
   	
      // Get data
      $.getJSON(url, function(data) {
      
         // Construct list
         // Display data in a table inside the <div> #list
         $("#list").append("<div>");      
         
         // Note: Move the elements to change the order of display
         $("#list").append("<div class='poi_title' id='first_poi_title'>Horeca</div>");
         
         $.each(data.features, function(i, f, cat) { 
            webmap.add2list(i,f,"horeca");
         });
       
         $("#list").append("<div class='poi_title'>Commerces</div>");
         
         $.each(data.features, function(i, f, cat) { 
            webmap.add2list(i,f,"commerces");
         });
         
         $("#list").append("<div class='poi_title'>Services<div>");
         
         $.each(data.features, function(i, f, cat) { 
            webmap.add2list(i,f,"services");
         });
         // End of the list
         $("#list").append("</div>");
      
      });
     
   },	
	
	// Set the GeoJSON layer
	setGeojsonLayer : function () {
      var geojsonLayer;
           // Get data
      //$.getJSON(webmap.url, function(data) {

      //console.log(data);
		//geojsonLayer = L.geoJson(data, {
		geojsonLayer = L.geoJson(geojson, {	
        pointToLayer: function(feature, latlng) {
               return webmap.markerLayer = L.marker(latlng, {
	            	icon: webmap.stylePoi(feature)
	            	});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(webmap.makePopupContent(feature));
			    webmap.markerList.push(webmap.markerLayer);
	        }
		//filter: function(feature, layer) {
	      //      return feature.properties.type == 'gac';
		   // }	        
      });
      //})
		
		return geojsonLayer;
       	
	},
	
	// display popup
	makePopupContent : function (feature) {
      var popupContent = "<div id='popup'>" + feature.properties.name + "</div>";     

      return popupContent;
    },
		
	// set the style of the function, meaning the icon of the POIs
   stylePoi : function (feature) {
    	var img_src = 'img/' + webmap.mapCategory(feature)[1] + '.png';      
      
      var iconPOI = new L.Icon({
      	iconUrl: img_src,
      	iconAnchor: [0, 0],
      	popupAnchor: [0, 0],
      	iconSize: [30, 30]
      });
      
      return iconPOI; 
   },  
   
	// Show map panel (jquery)	
   showMapPanel : function () {	
		$('#map').show();
   },	 
   
	// init function: perform this at the opening of the page (using jquery & LeafletJS)
	init : function () {

	   // show the map panel		
		webmap.showMapPanel();
		
		// Add a background layer (LeafletJS)
      var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });
	   webmap.Lmap.addLayer(osm);
	   
	   // Add POI layer (LeafletJS)
      var geojsonLayer = webmap.setGeojsonLayer();
      webmap.Lmap.addLayer(geojsonLayer);    
      
      // Populate the list
      webmap.populateList(webmap.url);
      
	}	 

}; // end of webmap object. 


// Initialize the page
webmap.init();












