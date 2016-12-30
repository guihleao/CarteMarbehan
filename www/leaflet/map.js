// Carte des services - LeafletJS - dec. 2016

var webmap = {

   ///////////////
	// VARIABLES //
	///////////////
	
	geojsonPOI: [],
	markerLayer: null,	
	markerList : [],
	showPanel : true,
	showPanelXs : false,
	url : "data/Habay_29122016.geojson",

	/////////////
	// OBJECTS //
	/////////////
	
	// Map creation (using LeafletJS)
	Lmap : L.map('map').setView([49.73, 5.58], 12),
		
	///////////////
	// FUNCTIONS //   - by alphabetic order, except init()
	///////////////
	
   // Add points of interests to the list
   add2list: function(index, feature) {
 
   	var poi_name, poi_content, catItems, imgFile;
   	   	
      poi_name = feature.properties.name;
      	
      if (feature.properties.amenity === 'school' || feature.properties.amenity === 'bank') { 
         var poi_city = feature.properties['addr:city'];
      	if (poi_city != undefined) { 
      	   poi_name = poi_name + ' (' + poi_city + ')'
      	}
         else {
      	   console.log('No city name for school / bank')
      	}
      }
        
      // Retrieve information for poi_content
      poi_content = webmap.formatInfo(index, feature);
         
      [catItems, imgFile] = webmap.mapCategory(feature);
          
      if (catItems === 'horeca') { // TO DO: add here a condition to see if the feature is on the current view 
            
         // Build the item of the list
         $("#first_poi_list").append("<div id='pid_" + index + "' class='poi'><div class='poi_icon'><img src='img/" + imgFile + ".png' onclick=\"webmap.selectPoi('" + index + "')\"></div><div class='poi_name'><a href=\"javascript:webmap.selectPoi('" + index + "');\">" + poi_name + "</a></div>" + poi_content + "</div>");
         
         // Hide poi_content for each element
         $('#pcid_' + index).hide()           
      } else {
         if (catItems === 'commerces') { // TO DO: add here a condition to see if the feature is on the current view 
            
            // Build the item of the list
            $("#second_poi_list").append("<div id='pid_" + index + "' class='poi'><div class='poi_icon'><img src='img/" + imgFile + ".png' onclick=\"webmap.selectPoi('" + index + "')\"></div><div class='poi_name'><a href=\"javascript:webmap.selectPoi('" + index + "');\">" + poi_name + "</a></div>" + poi_content + "</div>");
         
            // Hide poi_content for each element
            $('#pcid_' + index).hide() 
         } else {
            if (catItems === 'services') { // TO DO: add here a condition to see if the feature is on the current view 
            
               // Build the item of the list
               $("#third_poi_list").append("<div id='pid_" + index + "' class='poi'><div class='poi_icon'><img src='img/" + imgFile + ".png' onclick=\"webmap.selectPoi('" + index + "')\"></div><div class='poi_name'><a href=\"javascript:webmap.selectPoi('" + index + "');\">" + poi_name + "</a></div>" + poi_content + "</div>");
         
               // Hide poi_content for each element
               $('#pcid_' + index).hide() 
            }	
         }	  
      }                
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
	
   filterGeojson : function (f) {	
	   if (f.geometry.type != 'Polygon' && f.properties.name != undefined ) {
         return f;    
      } 
	},	
	
	filterList : function () {
		var search_txt = document.getElementById('filter_id').value;
		console.log(search_txt)
      for (i = 0; i < webmap.geojsonPOI.length; i++) {
        if (webmap.geojsonPOI[i].properties.name == search_txt){  // replace by a more intelligent and dynamic match criteria
           console.log('match')
           $('#pid_' + i).show();
        }
        else {
           $('#pid_' + i).hide();
        }
      }
   },
   
	
   formatInfo : function (index, feature) {
      var poi_content, poi_name, poi_addr_street, poi_addr_housenumber, poi_addr_city, poi_phone, poi_website, poi_opening_hours
   	
   	poi_phone = webmap.formatPhone(feature);
   	poi_website = webmap.formatWebsite(feature);
   	poi_opening_hours = webmap.formatOpeningHours(feature);
      
      // Add a condition to remove useless div poi_content in case of no content
      if (poi_phone != "" || poi_website != "" || poi_opening_hours != "" ) {
         poi_content = "<div class='poi_content' id='pcid_" + index + "'>" + poi_phone + poi_website + poi_opening_hours + "</div>";
      }
      else{
         poi_content = "";
      }
      
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
		// TO DO: string formatting: remove unuseful http and https
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
   		poi_opening_hours = "";
   	}
          
      return poi_opening_hours;
      // find something in case of the opening_hours not well formated in OSM
   },	

	// Populate the list
   loadGeojson : function(url) {
   	
      // Get data
      $.getJSON(url, function(data) {
         
         // 0) Filter the data!
         cpt = 0;   
         $.each(data.features, function(i, f) { 
            // Filtering
            ff = webmap.filterGeojson(f);
            
            if (ff != undefined ) {
            	// 1) Set the POI layer
               webmap.geojsonPOI.push(ff);
               // 2) Construct the POI list
               webmap.add2list(cpt,ff);
               cpt++;
            }             
         });  
         // Add the POI layer 
         var geojsonLayer = webmap.setGeojsonLayer();
         webmap.Lmap.addLayer(geojsonLayer); 
      
      });    
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
           img_file = "conveniencestore";
        }
     }         
        
     return [cat, img_file];
   },	
   
	// display popup
	makePopupContent : function (feature) {
      var popupContent;	   
	   if (feature.properties.amenity === 'school' || feature.properties.amenity === 'bank') { 
         var poi_city = feature.properties['addr:city'];
      	if (poi_city != undefined) { 
      	   popupContent = "<div id='popup'>" + feature.properties.name + ' (' + poi_city + ')' + "</div>"; 
      	}
      }
      else { popupContent = "<div id='popup'>" + feature.properties.name + "</div>";     
      }
      
      return popupContent;
    },
		
		
	// Select POI: show poi_content and highlight the poi on the map
	selectPoi : function (index) {
      console.log(index)
		// Show poi_content
		var ishidden = $('#pcid_' + index).is(':hidden');
		if(ishidden) {
         $('#pcid_' + index).show();
      }
      else{
      	$('#pcid_' + index).hide();
      }
	
      // highlight icon and/or show popup
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
         // Highlight poi on the map
         webmap.highlightPoi(index); 
      }
      else{
      	// Open popups from the list
         webmap.markerList[index].openPopup();
         
         // Highlight poi on the map
         webmap.highlightPoi(index); 
      }	
	},		
	
	highlightPoi : function (index) { 
	   webmap.unhighlightPoi();
	 
	   console.log('highlight poi');
	   var selected_icon = webmap.markerList[index].options.icon;
      selected_icon.options.iconSize = [42,47]
      webmap.markerList[index].setIcon(selected_icon)
	},
	
   // Un-highlight poi on the map
   // on certains conditions, 	unselected_icon.options.iconSize = [32,37]; webmap.markerList[index].setIcon(unselected_icon)
	// conditions are: single click but no single click on POI icon, other popup fire,  
   unhighlightPoi : function () {   
     console.log('unhighlight poi');
     for (var i = 0; i < webmap.markerList.length; i++) {
        var unselected_icon = webmap.markerList[i].options.icon;
        unselected_icon.options.iconSize = [32,37]
        webmap.markerList[i].setIcon(unselected_icon)
     }
   },	
	
	// Set the GeoJSON layer
	setGeojsonLayer : function () {
      var geojsonLayer;
		geojsonLayer = L.geoJson(webmap.geojsonPOI, {	
        pointToLayer: function(feature, latlng) {
               return webmap.markerLayer = L.marker(latlng, {
	            	icon: webmap.stylePoi(feature)
	            	});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(webmap.makePopupContent(feature));
			    webmap.markerList.push(webmap.markerLayer);
	        }	        
      });		
	   return geojsonLayer;    	
	},
	

	// set the style of the function, meaning the icon of the POIs
   stylePoi : function (feature) {
    	var img_src = 'img/' + webmap.mapCategory(feature)[1] + '.png';      
      
      var iconPOI = new L.Icon({
      	iconUrl: img_src,
      	iconAnchor: [16, 37],
      	popupAnchor: [0, -30],
      	iconSize: [32, 37]
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
      var baseLayer = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://mapicons.mapsmarker.com">Maps Icons Collection</a>',
	      subdomains: 'abcd',
	      minZoom: 0,
	      maxZoom: 20,
	      ext: 'png'
      });		

      /*var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });*/
	   webmap.Lmap.addLayer(baseLayer);  
	  
      // Load Geojson, add layer and populate the list
      webmap.loadGeojson(webmap.url);   
      
      // unhighlight POIs
      $('#map').on('click', function () {webmap.unhighlightPoi();});
      //webmap.Lmap.on('click', function () {webmap.unhighlightPoi();}); // seems not acting on popups so good. No unhighlight but no highlight too...
	}	 

}; // end of webmap object. 

// Initialize the page
webmap.init();
