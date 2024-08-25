# OsmPtv2NetControl

A validator for OpenStreetMap bus, tram and subway route and route_master relations.

## License

See the LICENSE file (GNU GENERAL PUBLIC LICENSE Version 3).

## Installation

You are null for program installation? Use the demo or the version installed on my [web site](https://www.ouaie.be/OsmPtv2NetControl/) 

You have a web server (local or on the web)? Download the last release and install the src folder on your server (you can rename the folder to what you will) and load the index.html file from your browser.

You are a crazy developper? install nodejs, npm, the npm package osmptv2netcontrol and Visual Studio Code. Good luck.

## How to use 

On the main web page complete:
- the network (for BE users: 'TECL', TECX', 'TECN', 'TECB', 'TECC', 'TECH', 'IBXL', 'DLOV','DLLi'...)
- select a vehicle in the dropdown list
- select a type ('used' for the currently used relations, 'proposed' for the relations with 'proposed' status)
- enter an area osm id if you will limit the control to a precise area (exemple: 1681788 for Liège, 897671 for Gent... )
- enter a route relation osm id if you will limit to one relation. In that case, it's not needed to complete the network. The route and all the routes attached to the same route_master are controlled.
- click on the 'go' button to start the program
- click on the 'errors button' to show only the errors or show all

## detected errors and how to solve

### Route wihout route_master ...

A route is not attached to a route_master. Search or create the route_master and add the route.
It's important to fix this error first because routes without route_master are not longer controlled.

### Route with more than one route_master...

A route is attached to more than one route_master. Correct the route_masters and probably remove one of the route_master

### A relation member of the route master is not a bus/tram/subway relation

A relation is present in the route_master but it's not a bus/tram/subway route. Verify the tags of this bad relation or remove it from the route_master

### A member of the route master is not a relation

A way or a node is found as member of the route_master. Remove it from the route_master

### Route_master without ref tag 

A route_master without ref tag is found.Add the ref tag

### ref tag of the route master (...) is not the same than the ref tag of the route (...)

Verify the ref tag of the route and on the route master

### Invalid name for route_master (must be ...) ...

The name must be 'Bus ' or 'Tram ' or 'Subway' + the value of the ref tag

### Hole found for route ... between way id ... and way id ...

A hole is found in the ways of the bus route. Verify the order of the ways and verify if a way is not missing.

### A from tag is not found for route ...

A from tag is missing . Add the tag to the bus route

### The from tag is not equal to the name of the first platform for route...

The from tag must be equal to the name of the first platform. Correct the from tag

### A to tag is not found for route ...

A to tag is missing . Add the tag to the bus route

### The to tag is not equal to the name of the last platform for route ...

The to tag must be equal to the name of the last platform. Correct the to tag

### Invalid name for route ...

The name of a route must be 'Bus ' + the ref tag of the route + ': ' + the from tag of the route + ' → ' + the to tag of the route

### Missing from, to, ref or name tags for route ...

A tag name, from, to or ref is missing

### An unordered object with a role ... is found in the ways of route ...

Reorder the objects in the bus route. Platform and stop must be before the ways in the route relation

### An invalid node ... is used as platform for the route ...

The node used as platform don't have a highway=bus_stop tag. Correct the node or remove it from the bus route

### An invalid way ... is used as platform for the route ... 

The way used as platform don't have a highway=platform tag . Correct the way or remove it from the bus route

### An invalid node ... is used as stop_position for the route ...

The node used as stop_position don't have a public_transport=stop_position tag. Correct the node or remove it from the bus route

### An invalid object ... is used as stop_position for the route ...

A way or a relation is used as stop_position. A stop_position must be a node

### An invalid highway ... is used as way for the route ...

This kind of way is normally not for motor vehicle (It's a footway, a cycleway, a pedestrian ...) Correct the way (change the highway tag) or add a bus=yes or a psv=yes tag.

### An invalid railway ... is used as way for the route ...

Each way object of a tram route must have a tag railway=tram. Each way object of a subway route must have a tag railway=subway. Correct the way.

### An invalid object ... is used as way for the route ...

A node or a relation is used as way for the bus route. Verify the role of the object (bus_stop or stop_position without role) or remove the object from the bus route

### An unknow role ... is found in the route ... for the osm object ... 

The role is not a valid role for a bus/tram/subway relation. Verify the role or remove the object. Valid roles are 'platform', 'platform_entry_only', 'platform_exit_only' and 'stop'

## Bugs, issues, questions about the app

Please fill an issue in Github. If it's REALLY to complex for you, send a message via my osm account (but remember that in that case I have to fill the issue for you 👿).

All questions, discussions, polemics about osm have to be posted on OSM forums and not there.

This program is only there to help mappers do a better map. In all case it's not a control of your works...

In case of contradictions between this app and the openstreetmap wiki, the wiki is the truth.