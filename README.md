# CarteDesServices

## About
Map of local shops and services based on OpenStreetMap

This project is about building a responsive webmap of shops and services based on OpenStreetMap (OSM) data of a desired location. The goal is to provide a local map for people from a village, a town or a city, showing all shops and services, with their full contact information (including phone number and website) and opening hours. Coded in HTML/CSS/Javascript, with jQuery, Bootstrap and LeafletJS. Versions based on OpenLayers2 and OpenLayers3 were also initiated. 

## Documentation

This project can be divided in two main sections: 1) the collection of OSM data and 2) the development of the webmap.

### Data

The data displayed in this webmap (named points of interests (POI)) represents shops and services. These POI are collected through an overpass-turbo query based on a collection of key-value OSM tags. Data is exported from overpass-turbo as a geoJSON file. Note that for most of POI, both `node` and `ways` are queried, because these POI may be represented either by a point (`node`) or a polygon delineating a building (`ways`). But some POI appeared to be also modelled as `relations` (e.g., school). The query is within the file overpass-query.txt. By adding `center` in `out center body;` at the end of the overpass query, ways and relations are summarized by a point (centroid of the polygons). There may be some duplicata when both a point and ways exist for the same POI. 

The geoJSON file is used twice in the webmap:
* 1) For the map, it is loaded directly in the HTML in a <script></script>.
* 2) For the list, it is loaded by a jquery function ($.getJSON)

This should be merged into one function in the future...

### Webmap development

The global architecture of the webmap is based on the responsive-webmap repository https://github.com/nobohan/responsive-webmap. However, LeafletJS was used instead of OpenLayers 3 as the mapping library. The webmap was mainly developed for smartphone and large screens views.

The list is generated by parsing the geoJSON file (see Data above). Items are included in the list only if they match certain conditions (e.g., have a `name` property). 

The map icons are from https://mapicons.mapsmarker.com/. Colors of the icons can be changed there. 

## TO DO

* Merge the two ways of loading the geoJSON 
* Think about icons
* Attributions of icons
* Sort POI in the list
* Name of the school not explicit enough: add city names
* Make a sequence diagram for JS functions