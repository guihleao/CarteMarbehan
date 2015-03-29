// Carte des services - Liste des POIs - Julien Minet - julien_wa@yahoo.fr - Aout 2014
 
// from http://stackoverflow.com/questions/17066636/jquery-parsing-json-objects-for-html-table
// see also http://stackoverflow.com/questions/12070631/how-to-use-json-file-in-html-code
// and http://stackoverflow.com/questions/21599502/how-to-manipulate-json-data-in-html-within-a-jquery?lq=1

var icon;

$("document").ready(function() {
  $.getJSON("data/Marbehan.geojson", function(data) {

  function add2list(i,f,icon) {
    if (f.properties.name != undefined) {f_name = f.properties.name} else {f_name = ""}  
    $("#list").append("<tr><td><img class='icon_list' src=" + icon + " onclick='selectlist(" + i + ")'></td><td>" + f_name + "</td></tr>");
  }

  // Display data in a table inside the <div> #list
  $("#list").append("<table>");

  // Move the elements to change the order of display
  $("#list").append("<tr><td colspan=2><h2>Horeca</h2></td></tr>");
  $.each(data.features, function(i, f) { if (f.properties.amenity == 'fast_food') {icon = './img/restaurant.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.amenity == 'restaurant') {icon = './img/restaurant.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.amenity == 'pub') {icon = './img/bar.png'; add2list(i,f,icon);}});

  $("#list").append("<tr><td colspan=2><h2>Commerces</h2></td></tr>");
  $.each(data.features, function(i, f) { if (f.properties.shop == 'bakery') {icon = './img/bread.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.shop == 'butcher') {icon = './img/butcher-2.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.shop == 'supermarket') {icon = './img/supermarket.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.amenity == 'pharmacy') {icon = './img/drugstore.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.shop == 'optician') {icon = './img/glasses.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.shop == 'doityourself') {icon = './img/tools.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.shop == 'car') {icon = './img/car.png'; add2list(i,f,icon);}});

  $("#list").append("<tr><td colspan=2><h2>Services</h2></td></tr>");
  $.each(data.features, function(i, f) { if (f.properties.amenity == 'school') {icon = './img/school.png'; add2list(i,f,icon);}});
  $.each(data.features, function(i, f) { if (f.properties.amenity == 'kindergarten') {icon = './img/daycare.png'; add2list(i,f,icon);}});


  $("#list").append("</table>");
  });
});


