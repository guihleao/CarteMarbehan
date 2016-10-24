// 1) Function for formatting the opening hours 
function formatOpening_hours(feature){
  var intro="<i>Heures d'ouverture:</i><br>";
  var str = feature.attributes.opening_hours;
  str = str.replace("Mo", "Lundi");
  str = str.replace("Tu", "Mardi");
  str = str.replace("We", "Mercredi");
  str = str.replace("Th", "Jeudi");
  str = str.replace("Fr", "Vendredi");
  str = str.replace("Sa", "Samedi");
  str = str.replace("Su", "Dimanche");
  str = str.replace("24/7", "24h/24h");
  return intro + str;
  // find something in case of the opening_hours not well formated in OSM
};


// 2) Trier les elements de l'objet geoJSON
// from http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = [-1, 1][+!!reverse];

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

// http://www.devcurry.com/2010/05/sorting-json-array.html
function SortByName(x,y) {
      return ((x.Name == y.Name) ? 0 : ((x.Name > y.Name) ? 1 : -1 ));
    }


// 3)Ajout des popups depuis la liste
var selectedFeature=0;
function selectlist(ii){
  if (selectedFeature!=0){
    try{map.controls[0].unselect(selectedFeature);}
      catch(err){};
    map.controls[0].select(map.layers[1].features[ii]);}
  else{
    map.controls[0].select(map.layers[1].features[ii]);}
};
