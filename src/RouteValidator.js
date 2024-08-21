/*
Copyright - 2024 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theConfig from './Config.js';
import theOsmData from './OsmData.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteValidator {

 	/**
	 * Coming soon
	 * @type {Object}
	 */

	#route = null;

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#platforms = [];

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#ways = [];

	/**
	* Coming soon
	 @param {Object} way Coming soon
	 */

	#wayIsRoundabout ( way ) {
		return way.nodes [ 0 ] === way.nodes.toReversed ( ) [ 0 ];
	}

	/**
	* Coming soon
	 @param {Object} way Coming soon
	 @param {Object} previousWay Coming soon
	 */

	 #waysHaveCommonNode ( way, previousWay ) {
		return previousWay.nodes [ 0 ] === way.nodes [ 0 ] || previousWay.nodes [ 0 ] === way.nodes.toReversed ( ) [ 0 ] ||
		previousWay.nodes.toReversed ( ) [ 0 ] === way.nodes [ 0 ] ||
		previousWay.nodes.toReversed ( ) [ 0 ] === way.nodes.toReversed ( ) [ 0 ];
	}

	/**
	* Coming soon
	 @param {Object} way Coming soon
	 @param {Object} previousWay Coming soon
	 */

	 #waysViaRoundabout ( way, previousWay ) {
		if ( this.#wayIsRoundabout ( way ) ) {
			return -1 !== way.nodes.indexOf ( previousWay.nodes [ 0 ] ) ||
				-1 !== way.nodes.indexOf ( previousWay.nodes.toReversed ( ) [ 0 ] );
		}
		else if ( this.#wayIsRoundabout ( previousWay ) ) {
			return -1 !== previousWay.nodes.indexOf ( way.nodes [ 0 ] ) ||
				-1 !== previousWay.nodes.indexOf ( way.nodes.toReversed ( ) [ 0 ] );
		}
		return false;
	}

	/**
	* Coming soon
	 */

	#validateWaysOrder ( ) {
		let previousWay = null;
		this.#ways.forEach (
			way => {
				if ( previousWay ) {
					if (
						! this.#waysHaveCommonNode ( way, previousWay )
						&&
						! this.#waysViaRoundabout ( way, previousWay )
					) {
						theReport.addPError (
							'Hole found for route ' + theReport.getOsmLink ( this.#route ) +
                            ' between way id ' + theReport.getOsmLink ( previousWay ) +
                            ' and way id ' + theReport.getOsmLink ( way ),
							this.#route.id
						);
						previousWay = null;
					}
				}
				previousWay = way;
			}
		);
	}

	/**
	* Coming soon
	 */

	#validateFrom ( ) {
		if ( ! this.#route?.tags?.from ) {
			theReport.addPError (
				'A from tag is not found for route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
		else if ( this.#route?.tags?.from !== this.#platforms[ 0 ]?.tags?.name ) {
			theReport.addPError (
				'The from tag ( ' + this.#route?.tags?.from +
				' ) is not equal to the name of the first platform ( ' +
				this.#platforms[ 0 ]?.tags?.name + ' ) for route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
	}

	/**
	* Coming soon
	 */

	#validateTo ( )	{
		if ( ! this.#route?.tags?.to ) {
			theReport.addPError (
				'A to tag is not found for route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
		else if ( this.#route?.tags?.to !== this.#platforms.toReversed ( )[ 0 ]?.tags?.name ) {
			theReport.addPError (
				'The to tag ( ' + this.#route?.tags?.to +
				' ) is not equal to the name of the last platform ( ' +
				this.#platforms.toReversed ( )[ 0 ]?.tags?.name + ' ) for route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
	}

	/**
	* Coming soon
	 */

	#haveTagsNameFromToRef ( ) {
		return this.#route?.tags?.from && this.#route?.tags?.to && this.#route?.tags?.name && this.#route?.tags?.ref;
	}

	/**
	* Coming soon
	 */

	#validateName ( ) {
		let vehicle = theConfig.osmVehicle.substring ( 0, 1 ).toUpperCase ( ) +
			theConfig.osmVehicle.substring ( 1 ) + ' ';
		if ( this.#haveTagsNameFromToRef ( ) ) {
			let goodName = vehicle + this.#route?.tags?.ref + ': ' + this.#route?.tags?.from + ' → ' + this.#route?.tags?.to;
			if ( this.#route?.tags?.name !== goodName ) {
				theReport.addPError (
					'Invalid name (' + this.#route?.tags?.name + ' <> ' + goodName + ') for route ' +
					theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
		}
		else {
			theReport.addPError (
				'Missing from, to, ref or name tags for route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
	}

	/**
	* Coming soon
	 */

	#validateRolesOrder ( ) {
		let emptyRole = false;
		this.#route.members.forEach (
			member => {
				if ( '' === member.role && ! emptyRole ) {
					emptyRole = true;
				}
				else if ( emptyRole && '' !== member.role ) {
					theReport.addPError (
						'An unordered object with a role (' + theReport.getOsmLink ( member ) +
                                ') is found in the ways of route ' + theReport.getOsmLink ( this.#route ),
						this.#route.id
					);
				}
			}
		);
	}

	/**
	* Coming soon
    @param { Object } member Coming soon
	 */

	#validatePlatformRole ( member ) {
		if ( 'node' === member.type ) {
			let busStop = theOsmData.nodes.get ( member.ref );
			this.#platforms.push ( busStop );
			if ( 'bus_stop' !== busStop?.tags?.highway ) {
				theReport.addPError (
					'An invalid node (' + theReport.getOsmLink ( member ) +
						') is used as platform for the route ' + theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
		}
		if ( 'way' === member.type ) {
			let platform = theOsmData.ways.get ( member.ref );
			this.#platforms.push ( platform );
			if (
				( 'platform' !== platform?.tags?.highway  && 'bus' ===theConfig.osmVehicle )
				||
				( 'platform' !== platform?.tags?.railway  && 'tram' ===theConfig.osmVehicle )
			) {
				theReport.addPError (
					'An invalid way (' + theReport.getOsmLink ( member ) +
						') is used as platform for the route ' + theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
		}
	}

	/**
	* Coming soon
    @param { Object } member Coming soon
	 */

	#validateStopRole ( member ) {
		if ( 'node' === member.type ) {
			let stopPosition = theOsmData.nodes.get ( member.ref );
			if ( 'stop_position' !== stopPosition?.tags?.public_transport ) {
				theReport.addPError (
					'An invalid node (' + theReport.getOsmLink ( member ) +
						') is used as stop_position for the route ' + theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
		}
		else {
			theReport.addPError (
				'An invalid object (' + theReport.getOsmLink ( member ) +
					') is used as stop_position for the route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
	}

	/**
	* Coming soon
    @param { Object } member Coming soon
	 */

	#validateWayRole ( member ) {
		const validBusHighways =
		[
			'motorway',
			'motorway_link',
			'trunk',
			'trunk_link',
			'primary',
			'primary_link',
			'secondary',
			'secondary_link',
			'tertiary',
			'tertiary_link',
			'service',
			'residential',
			'unclassified',
			'living_street',
			'busway'
		];
		let way = theOsmData.ways.get ( member.ref );
		if ( 'way' === member.type && 'bus' === theConfig.osmVehicle ) {
			if (
				 -1 === validBusHighways.indexOf ( way?.tags?.highway )
				 &&
				 'yes' !== way?.tags?.psv
				 &&
				 'yes' !== way?.tags [ theConfig.osmVehicle ]
			) {
				theReport.addPError (
					'An invalid highway (' + theReport.getOsmLink ( member ) +
						') is used as way for the route ' + theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
			else {
				this.#ways.push ( way );
			}
		}
		else if ( 'way' === member.type && 'tram' === theConfig.osmVehicle ) {
			if ( 'tram' !== way?.tags?.railway ) {
				theReport.addPError (
					'An invalid railway (' + theReport.getOsmLink ( member ) +
						') is used as way for the route ' + theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
		}
		else if ( 'way' === member.type && 'subway' === theConfig.osmVehicle ) {
			if ( 'subway' !== way?.tags?.railway ) {
				theReport.addPError (
					'An invalid railway (' + theReport.getOsmLink ( member ) +
						') is used as way for the route ' + theReport.getOsmLink ( this.#route ),
					this.#route.id
				);
			}
		}
		else {
			theReport.addPError (
				'An invalid object (' + theReport.getOsmLink ( member ) +
					') is used as way for the route ' + theReport.getOsmLink ( this.#route ),
				this.#route.id
			);
		}
	}

	/**
	* Coming soon
	 */

	#validateRolesObjects ( ) {
		this.#route.members.forEach (
			member => {
				switch ( member.role ) {
				case 'platform' :
				case 'platform_entry_only' :
				case 'platform_exit_only' :
					this.#validatePlatformRole ( member );
					break;
				case 'stop' :
					this.#validateStopRole ( member );
					break;
				case '' :
					this.#validateWayRole ( member );
					break;
				default :
					theReport.addPError (
						'An unknow role (' + member.role +
                            ') is found in the route ' + theReport.getOsmLink ( this.#route ) +
                            ' for the osm object ' + theReport.getOsmLink ( member ),
						this.#route.id
					);
					break;
				}
			}
		);
	}

	/**
	* Coming soon
    @param { Object } route Coming soon
	 */

	validateRoute ( route ) {
		this.#route = route;
		theReport.add (
			'h2',
			'\nNow validating route ' + ( this.#route.tags.name ?? '' ),
			this.#route
		);

		this.#platforms = [];
		this.#ways = [];
		this.#validateRolesObjects ( );
		this.#validateRolesOrder ( );
		this.#validateWaysOrder ( );
		this.#validateFrom ( );
		this.#validateTo ( );
		this.#validateName ( );
	}

 	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * The one and only one instance of RouteValidator class.
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

let theRouteValidator = new RouteValidator;

export default theRouteValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */