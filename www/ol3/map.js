// Carte des services - oct. 2016

var webmap = {

   ///////////////
	// VARIABLES //
	///////////////
	globalvar : undefined,
	showPanel : true,
	showPanelXs : false,
	url : "data/Marbehan.geojson",
	
	/////////////
	// OBJECTS //
	/////////////
	
	// Map creation (using OpenLayers 3)
	olmap : new ol.Map({
	   target: document.getElementById('map'),  // instead of "target: 'map' " because of the cursor pointer
	   view: new ol.View({
	   	center: ol.proj.transform([5.54, 49.73], 'EPSG:4326', 'EPSG:3857'),
	      zoom: 13
	   })
	}),

	
	///////////////
	// FUNCTIONS //   - by alphabetic order, except init()
	///////////////
	

    /*//// Add popups //// TO DO / REVOIR
    
    // Add popup
    var element = document.getElementById('popup'),

    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false
    }),
    olmap.addOverlay(popup),

    // display popup on click
    olmap.on('click', function(evt) {
       var feature = olmap.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {
            return feature;
          });

      if (feature) {
        popup.setPosition(evt.coordinate);
        $(element).popover({
          'placement': 'top',
          'html': true,
          content: "<div id='popup'>" + feature.get('UNIT') + "</div><div id='popup_wp'>" + feature.get('WP') + "</div><div id='popup_partner'>MACSUR partner #" + feature.get('PARTNER_FO') +"</div>"
        });
        $(element).popover('show');
      } else {
        $(element).popover('destroy');
      }
    });

    // change mouse cursor when over marker
    olmap.on('pointermove', function(e) {
      if (e.dragging) {
        $(element).popover('destroy');
        return;
      }
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      olmap.getTarget().style.cursor = hit ? 'pointer' : '';
    });
 */
 
 
   // Add points of interests to the list
   add2list: function(index, feature, category) {
   	//console.log(feature)
   	// TO DO: delete index if not needed in the OL3 gestion of firing popups. 
   	var featureName, catItems, imgFile;
   	
      if (feature.properties.name != undefined){
         featureName = feature.properties.name;
         }
      else {
      	featureName = "";
      	}         
           
      [catItems, imgFile] = webmap.mapCategory(feature);
      	
      if (catItems === category) { // TO DO: add here a condition to see if the feature is on the current view 
         $("#list").append("<tr><td><img class='icon_list' src='img/" + imgFile + ".png' onclick='selectlist(" + index + ")'></td><td>" + featureName + "</td></tr>");
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
	
   // Test if feature is in category and return corresponding icon file
   mapCategory : function (feature) {
      var feature_type, cat, img_file, OSM_key_in_geojson, OSM_value_in_geojson    	

      if (feature.properties.amenity != undefined){
     	   feature_type = "amenity";      
      } else {
         if (feature.properties.shop != undefined){
     	      feature_type = "shop";         
         }      
         else {
            feature_type = undefined;    
         } 
      }
       
      switch (feature_type){
         case "amenity":
            //console.log('amenity here');
     	      OSM_key_in_geojson = "amenity";    
            OSM_value_in_geojson = feature.properties.amenity;
            break;
         case "shop":
            //console.log('shop here');
            OSM_key_in_geojson = "shop";    
            OSM_value_in_geojson = feature.properties.shop;
            break; 
         default:
            //console.log('default');
            OSM_key_in_geojson = undefined;    
            OSM_value_in_geojson = undefined;
            break; 
      }    	

     // loop over the category on items.json
     for (i = 0; i < items.length; i++) {
        if (items[i].OSM_key == OSM_key_in_geojson && items[i].OSM_value == OSM_value_in_geojson){
           cat = items[i].category;
           img_file = items[i].png_file;
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
         $("#list").append("<table>");      
      
         // Note: Move the elements to change the order of display
         $("#list").append("<tr><td colspan=2><h2>Horeca</h2></td></tr>");
         
         $.each(data.features, function(i, f, cat) { 
            webmap.add2list(i,f,"horeca");
         });
       
         $("#list").append("<tr><td colspan=2><h2>Commerces</h2></td></tr>");
         
         $.each(data.features, function(i, f, cat) { 
            webmap.add2list(i,f,"commerces");
         });
         
         $("#list").append("<tr><td colspan=2><h2>Services</h2></td></tr>");
         
         $.each(data.features, function(i, f, cat) { 
            webmap.add2list(i,f,"services");
         });
         // End of the list
         $("#list").append("</table>");
      
      });
   },	
	
	// Set the GeoJSON layer
	setGeojsonLayer : function () {
		var geojsonLayer;
		
		// Define the source of the data
	   var geojsonSource = new ol.source.Vector({
         url: webmap.url,
         format: new ol.format.GeoJSON()
      });
      
     /* // Get features
      geojsonLayer.once('change', function(){
         if (geojsonLayer.getState() == 'ready')
          { var features = geojsonLayer.getFeatures();
          console.log(features);
           }
      });    */ 
      
      // Define the layer      
      var geojsonLayer = new ol.layer.Vector({
         title: 'Carte des Services',
         source: geojsonSource,
         //style: iconStyle
         style: webmap.styleFunction
         // un truc du genre: onEach: setStyle();
         // + filter;
      });
       
      return geojsonLayer; 
       	
	},
	 
	// getIcon function, similar to mapCategory() 
   getIcon : function (feature) {
      var feature_type, img_file, OSM_key_in_geojson, OSM_value_in_geojson; 

      if (feature.values_.amenity != undefined){
     	   feature_type = "amenity";      
      } else {
         if (feature.values_.shop != undefined){
     	      feature_type = "shop";         
         }      
         else {
            feature_type = undefined;    
         } 
      }

      switch (feature_type){
         case "amenity":
            //console.log('amenity here');
     	      OSM_key_in_geojson = "amenity";    
            OSM_value_in_geojson = feature.values_.amenity;
            break;
         case "shop":
            //console.log('shop here');
            OSM_key_in_geojson = "shop";    
            OSM_value_in_geojson = feature.values_.shop;
            break; 
         default:
            //console.log('default');
            OSM_key_in_geojson = undefined;    
            OSM_value_in_geojson = undefined;
            break; 
      }   
     
     // loop over the category on items.json
     for (i = 0; i < items.length; i++) {
        if (items[i].OSM_key == OSM_key_in_geojson && items[i].OSM_value == OSM_value_in_geojson){
           img_file = items[i].png_file;
           break;
        }
        else {
           img_file = "foo";
        }
        
     }         
     return img_file;
     
   },
	
	// set the style of the function, meaning the icon of the POIs
   styleFunction : function (feature, resolution) {
      var img_src;
      //var name = feature.get('name');
    	img_src = 'img/' + webmap.getIcon(feature) + '.png';
    	
      var styleGeojson = new ol.style.Style({
            image: new ol.style.Icon({
               anchor: [0.5, 46],
               anchorXUnits: 'fraction',
               anchorYUnits: 'pixels',
               opacity: 0.75,
               src: img_src
            })
            
      });
      
      return [styleGeojson]; 
   },  
	
	// Show map panel (jquery)	
   showMapPanel : function () {	
		$('#map').show();
   },	 
	 
	// init function: perform this at the opening of the page (using jquery & OpenLayers 3)
	init : function () {

	    // hide the graph panel		
		webmap.showMapPanel();
		
		// Add a OSM layer as background (using OpenLayers 3)
		var osmLayer = new ol.layer.Tile({
	      source: new ol.source.OSM()
	   });
	   webmap.olmap.addLayer(osmLayer);
	   
	   // Add POI layer (OpenLayers 3)
      var geojsonLayer = webmap.setGeojsonLayer();
      webmap.olmap.addLayer(geojsonLayer);
	   
	   // Add specific classes to OpenLayers elements  (using jquery & Bootstrap class)
      $('.ol-scale-line').addClass('hidden-xs');
      $('.ol-attribution').addClass('hidden-xs');      
      
      // Populate the list
      webmap.populateList(webmap.url);
	}	 

}; // end of webmap object. 


// Initialize the page
webmap.init();












