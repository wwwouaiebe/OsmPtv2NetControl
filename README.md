# OsmPtv2NetControl

## A member of the route_master is not a bus relation

A relation is present in the route_master but it's not a bus route. Verify the tags of this bad relation or remove it from the route_master

## A member of the route master is not a relation

A way or a node is found as member of the route_master. Remove it from the route_master

## Hole found for route ... between way id ... and way id ... Ok

A hole is found in the ways of the bus route. Verify the order of the ways.

## A from tag is not found for route ... Ok

A from tag is missing . Add the tag to the bus route

## The from tag is not equal to the name of the first platform for route... Ok

The from tag must be equal to the name of the first platform. Correct the from tag

## A to tag is not found for route ... Ok

A to tag is missing . Add the tag to the bus route

## The to tag is not equal to the name of the last platform for route ... Ok

The to tag must be equal to the name of the last platform. Correct the to tag

## Invalid name for route ... Ok

The name of a route must be 'Bus ' + the ref tag of the route + ': ' + the from tag of the route + ' → ' + the to tag of the route

## Missing from, to, ref or name tags for route

A tag name, from to or ref is missing

## An unordered object with a role ... is found in the ways of route ... Ok

Reorder the objects in the bus route. 

## An invalid node ... is used as platform for the route ... Ok

The node used as platform don't have a highway=bus_stop key. Correct the node or remove it from the bus route

## An invalid way ... is used as platform for the route ... Ok

The way used as platform don't have a highway=platform key . Correct the way or remove it from the bus route

## An invalid node ... is used as stop_position for the route Ok

The node used as stop_position don't have a public_transport=stop_position key. Correct the node or remove it from the bus route

## An invalid object ... is used as stop_position for the route Ok

A way or a relation is used as stop_position. A stop_position must be a node

## An invalid highway ... is used as way for the route ... Ok

This kind of way cannot be used for a bus route (It's a footway, a cycleway, a pedestrian ...) Correct the route.

## An invalid object ... is used as way for the route Ok

A node or a relation is used as way for the bus route. Verify the role of the object (bus_stop or stop_position without role) or remove the object from the bus route

## An unknow role ... is found in the route ... for the osm object ... Ok

The role is not a valid role for a bus relation. Verify the role or remove the object.

## ref tag of the route master (...) is not the same than the ref tag of the route (...)

Verify the ref tag of the route and of the route master