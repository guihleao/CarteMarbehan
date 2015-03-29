CartesDesServices

// ENGLISH - SHORT NOTICE

Map of local shops and amenities based on OpenStreetMap

The aim of this project is to provide a local map for people from a village, a town or a city, based on geographic data from OpenStreetMap (OSM), showing all shops and amenities, with their full contact information (including phone number and website) and opening hours.

This was done in 3 main steps: 1) Shops & amenities data were got from OSM using overpass-turbo.eu 2) These data are displayed in a webmap built with OpenLayers 3) The list on the right is built with jquery

// FRENCH - LONG NOTICE

Carte des commerces et services basée sur OpenStreetMap

Le but est de fournir une carte à destination des habitants d'un village, d'une commune ou d'une ville, sous une version web, de tous les commerces et services disponibles, avec leur coordonnées (téléphone, site internet) et les heures d'ouvertures.

Comment c'est fait ?

1) on récupère des données de commerces & services d'OSM avec le site web overpass-turbo.eu

2) on fourre tout ça dans une (belle) carte dynamique construite avec OpenLayers

3) on rajoute une liste à droite construite avec jquery.

Détaillons un peu:

La première étape consiste à récupérer les informations sur les commerces et services à partir d'OSM. Pour cela, nous faisons une requête sur le site overpass-turbo.eu, puis le résultat de la requête est enregistré au format geojson, un format de données géographiques. Les informations reprises seront tous les éléments taggés comme “shop” et “amenity”, qui rassemblent la plupart des commerces et des services dans la terminologie d'OSM. Plusieurs exemples de requêtes pour overpass-turbo existent sur le site, sous l'onglet "Charger". Mais plusieurs formulations de requêtes sont possibles pour notre application:

1) Requête en fonction du nom de l'endroit Par exemple, on va chercher tous les éléments en fonction du nom de l'endroit, ce qui pose évidemment problème s'il existe plusieurs endroits avec le même nom. Notez que tous les éléments « shop » et « amenity » sont cherché aussi bien en tant que points (« nodes »), surfaces (« ways ») que relations.

2) Requête en fonction d'une étendue définie sur la carte

Assez simple, il suffit de se déplacer sur la carte d'overpass-turbo, et de lancer la requête sur l'étendue affichée. Par contre, si on veut se restreindre à une ville et pas une autre, alors que ces deux villes sont imbriquées ou côte-à-côte, la requête donnera des résultats mélangés.

<!-- gather results -->

...

Deuxième étape, afficher ces données dans une carte dynamique. J'ai choisi la librairie OpenLayers, qui reste la plus flexible pour ce genre d'applications. J'ai aussi essayé avec Leaflet, mais certaines limitations demanderait de chercher un peu plus avec cette librairie. Le code source se trouve ici. Rien de bien complexe dans cette carte de base, qui se contente de charger le fichier geojson issu de notre requête sur overpass-turbo, de l'afficher avec des icônes différentes suivant ses propriétés, et de faire ouvrir des popups avec les informations sur ces icônes. Toutes ces informations du popup sont tirées du fichier geojson que nous avons exporté depuis OpenStreetMap. L'exactitude, la précision et la mise à jour de ces informations dépend donc des contributeurs OpenStreetMap du lieu.

Une petite manipulation tout de même : si le fichier geojson contient des polygones (représentant le bâtiment du commerce) plutôt que des points, il faut tout d'abord transformer ces polygones en points, ce qui se fait très facilement sous QGIS par exemple, avec la fonction « Polygon Centroid ». Les polygones (bâtiments) sont alors remplacés par des points en conservant toutes les informations de l'objet.

Le fond cartographique choisi est celui d'OpenCycleMap. Pour cette carte, j'ai utilisé la collection d’icônes de mapicons.nicolasmollet.com, qui propose des centaines d’icônes sous différents formes et à la couleur au choix.

Dernière étape, créer une liste des éléments affichés sur la carte. Le même fichier geojson sert à afficher les points sur la carte, à générer les popups et à construire la liste à gauche de la carte. Le fichier geojson est lu ici par une fonction de base de la librairie en jquery. Pour chaque élément du fichier geojson qui correspond à une catégorie, le nom du lieu et son icône correspondante (selon sa catégorie) est affichée.

Keep It Safe and Simple. La méthodologie pour créer cette carte n'est pas très alambiquée, et même si le code en javascript pourrait certainement être simplifié, il reste compréhensible. Le lien dynamique avec OpenStreetMap (actualisation automatique de la carte en même temps qu'OpenStreetMap) n'a pas été fait, ce qui permet de garder un contrôle sur la carte finale. La carte est plutôt adaptée à un petit territoire (village, quartier), car un grand nombre d'éléments à afficher nécessiterait une gestion de clustering des symboles et une gestion de la liste. Par contre, la méthodologie a une portée globale, c'est-à-dire qu'elle peut être appliquée dans n'importe quel endroit du monde pour autant qu'OpenStreetMap soit suffisamment développé dans la localité. Sinon, c'est l'occasion d'y contribuer !

 
