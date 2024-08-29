/* eslint-disable max-len */
export const errorHelp = {
	R001 : 'A hole is found in the ways of the bus route. Verify the order of the ways and verify if a way is not missing',
	R002 : 'A from tag is missing. Add the tag to the bus/tram/subway route',
	R003 : 'The from tag must be equal to the name of the first platform. Correct the from tag.If the platform is shared between 2 operators and have a different name for each operator the name:operator is also valid',
	R004 : 'A to tag is missing. Add the tag to the bus route',
	R005 : 'The to tag must be equal to the name of the last platform. Correct the to tag. If the platform is shared between 2 operators and have a different name for each operator the name:operator is also valid',
	R006 : 'The name of a route must be \'Bus \' + the ref tag of the route + \': \' + the from tag of the route + \' → \' + the to tag of the route',
	R007 : 'A tag \'name\', \'from\', \'to\' or \'ref\' is missing',
	R008 : 'Reorder the objects in the bus route. Platform and stop must be before the ways in the route relation',
	R009 : 'The node used as platform don\'t have a highway=bus_stop tag. Correct the node or remove it from the bus route',
	R010 : 'The way used as platform don\'t have a highway=platform tag . Correct the way or remove it from the bus route',
	R011 : 'A way or a relation is used as stop_position. A stop_position must be a node',
	R012 : 'A node or a relation is used as way for the bus route. Verify the role of the object (bus_stop or stop_position without role) or remove the object from the bus route',
	R013 : 'This kind of way is normally not for motor vehicle (It\'s a footway, a cycleway, a pedestrian ...) Correct the way (change the highway tag) or add a bus=yes or a psv=yes tag',
	R014 : 'Each way object of a tram route must have a tag railway=tram. Each way object of a subway route must have a tag railway=subway. Correct the way',
	R015 : 'A node or a relation is used as way for the bus route. Verify the role of the object (bus_stop or stop_position without role) or remove the object from the bus route',
	R016 : 'The role is not a valid role for a bus/tram/subway relation. Verify the role or remove the object. Valid roles are \'platform\', \'platform_entry_only\', \'platform_exit_only\' and \'stop\'',
	R017 : 'An operator tag is not found for the route. Add the operator tag',
	R018 : 'The operator is not valid for route. Correct the operator',
	R019 : 'Add a \'public_transport:version\' tag to this route',
	R020 : 'change the \'public_transport:version\' value to 2',
	M001 : 'A route is not attached to a route_master. Search or create the route_master and add the route',
	M002 : 'A route is attached to more than one route_master. Correct the route_masters and probably remove one of the route_master',
	M003 : 'A relation is present in the route_master but it\'s not a bus/tram/subway route. Verify the tags of this bad relation or remove it from the route_master',
	M004 : 'A way or a node is found as member of the route_master. Remove it from the route_master',
	M005 : 'A route_master without ref tag is found.Add the ref tag',
	M006 : 'Verify the ref tag of the route and on the route master',
	M007 : 'The name must be \'Bus \' or \'Tram \' or \'Subway\' + the value of the ref tag'
};