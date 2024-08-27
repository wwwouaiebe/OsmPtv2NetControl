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
 * Validator for osm public_transport routes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteValidator {

 	/**
	 * The route currently controlled
	 * @type {Object}
	 */

	#route = null;

	/**
	 * The platforms associated to the route (= members with 'platform' role)
	 * @type {Array}
	 */

	#platforms = [];

	/**
	 * the ways associated to the route (= members without role but having an highway tag
	 * for bus or a railway tag for tram and subway)
	 * @type {Array}
	 */

	#ways = [];

	/**
	* Verify that a way is circular (= same node for the first and last node)
	 @param {Object} way to verify
	 @returns {boolean} True when the way is circular
	 */

	#wayIsRoundabout ( way ) {
		return way.nodes [ 0 ] === way.nodes.toReversed ( ) [ 0 ];
	}

	/**
	 * Verify that two ways are sharing a node at the beginning or at the end
	 * @param {Object} firstWay The first way to verify
	 * @param {Object} secondWay The second way to verify
	 */

	 #waysHaveCommonNode ( firstWay, secondWay ) {
		return secondWay.nodes [ 0 ] === firstWay.nodes [ 0 ] ||
		secondWay.nodes [ 0 ] === firstWay.nodes.toReversed ( ) [ 0 ] ||
		secondWay.nodes.toReversed ( ) [ 0 ] === firstWay.nodes [ 0 ] ||
		secondWay.nodes.toReversed ( ) [ 0 ] === firstWay.nodes.toReversed ( ) [ 0 ];
	}

	/**
	 * Verify that for two ways:
	 * - one way is circular (= same node for the first and last node)
	 * - the other way have the start node or end node shared with the circular way
	 * @returns {boolean} True when a node is shared between the two ways
	 * @param {Object} firstWay the first way to test
	 * @param {Object} secondWay the second way to test
	 */

	 #waysViaRoundabout ( firstWay, secondWay ) {
		if ( this.#wayIsRoundabout ( firstWay ) ) {
			return -1 !== firstWay.nodes.indexOf ( secondWay.nodes [ 0 ] ) ||
				-1 !== firstWay.nodes.indexOf ( secondWay.nodes.toReversed ( ) [ 0 ] );
		}
		else if ( this.#wayIsRoundabout ( secondWay ) ) {
			return -1 !== secondWay.nodes.indexOf ( firstWay.nodes [ 0 ] ) ||
				-1 !== secondWay.nodes.indexOf ( firstWay.nodes.toReversed ( ) [ 0 ] );
		}
		return false;
	}

	/**
	* Verify that the ways of the route are continuous
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
							null,
							'R001'
						);
						previousWay = null;
					}
				}
				previousWay = way;
			}
		);
	}

	/**
	* Validate the operator tag
	 */

	#validateOperator ( ) {
		if ( this.#route?.tags?.operator ) {
			let operators = this.#route?.tags?.operator.split ( ';' );
			const validOperators = [ 'TEC', 'De lijn', 'STIB/MIVB' ];
			let validOperatorFound = false;
			operators.forEach (
				operator => {
					if ( -1 !== validOperators.indexOf ( operator ) ) {
						validOperatorFound = true;
					}
				}
			);
			if ( ! validOperatorFound ) {
				theReport.addPError (
					'The operator is not valid for route',
					null,
					'R018'
				);

			}
		}
		else {

			// no operator tag
			theReport.addPError (
				'An operator tag is not found for route',
				null,
				'R002'
			);
		}
	}

	/**
	* Validate the from tag
	 */

	#validateFrom ( ) {

		if ( ! this.#route?.tags?.from ) {

			// no from tag
			theReport.addPError (
				'A from tag is not found for route',
				null,
				'R002'
			);
		}
		else if (
			this.#route?.tags?.from !== this.#platforms[ 0 ]?.tags?.name
			&&
			this.#route?.tags?.from !== ( this.#platforms [ 0 ]?.tags [ 'name:' + this.#route?.tags?.operator ] ?? '' )
		) {

			// from tag is not the same than the name of the first platform
			theReport.addPError (
				'The from tag is not equal to the name of the first platform for route ',
				null,
				'R003'
			);
		}
	}

	/**
	* Validate the to tag
	 */

	#validateTo ( )	{
		if ( ! this.#route?.tags?.to ) {

			// no to tag
			theReport.addPError (
				'A to tag is not found for route',
				null,
				'R004'
			);
		}
		else if (
			this.#route?.tags?.to !== this.#platforms.toReversed ( )[ 0 ]?.tags?.name
			&&
			(
				this.#route?.tags?.to
				!==
				( this.#platforms.toReversed ( ) [ 0 ]?.tags [ 'name:' + this.#route?.tags?.operator ] ?? '' )
			)
		) {

			// to tag is not the same than the name of the last platform
			theReport.addPError (
				'The to tag is not equal to the name of the last platform for route',
				null,
				'R005'
			);
		}
	}

	/**
	* Verify that the route have a from tag, a to tag, a name tag and a ref tag
	 */

	#haveTagsNameFromToRef ( ) {
		return this.#route?.tags?.from && this.#route?.tags?.to && this.#route?.tags?.name && this.#route?.tags?.ref;
	}

	/**
	* Verify that the name is compliant with the osm rules
	 */

	#validateName ( ) {
		let vehicle = theConfig.osmVehicle.substring ( 0, 1 ).toUpperCase ( ) +
			theConfig.osmVehicle.substring ( 1 ) + ' ';
		if ( this.#haveTagsNameFromToRef ( ) ) {
			let goodName = vehicle + this.#route?.tags?.ref + ': ' + this.#route?.tags?.from + ' → ' + this.#route?.tags?.to;
			if ( this.#route?.tags?.name !== goodName ) {
				theReport.addPError (
					'Invalid name ("' + this.#route?.tags?.name + '" but expected "' + goodName + '") for route ',
					null,
					'R006'
				);
			}
		}
		else {
			theReport.addPError (
				'Missing from, to, ref or name tags for route',
				null,
				'R007'
			);
		}
	}

	/**
	 * Verify the position of the objects with a role. The objects with a role
	 * must be at the top of the relation and the objects without role at the end
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
                                ') is found in the ways of route ',
						null,
						'R008'
					);
				}
			}
		);
	}

	/**
	 * Verify that, for objects having a 'platform' role:
	 * - the platform have an highway='bus_stop' tag when the platform is a node
	 * - the platform have an highway='platform' tag when the plaform is a way and the vehicle is a bus
	 * - the platform have an railway='platform' tag when the plaform is a way and the vehicle is a tram or subway
	 * - note: role can be platform, platform_entry_only or platform_exit_only
    @param { Object } member The osm member with the 'platform' role
	 */

	#validatePlatformRole ( member ) {
		if ( 'node' === member.type ) {
			let busStop = theOsmData.nodes.get ( member.ref );
			this.#platforms.push ( busStop );
			if ( 'bus_stop' !== busStop?.tags?.highway ) {
				theReport.addPError (
					'An invalid node (' + theReport.getOsmLink ( member ) +
						') is used as platform for the route',
					null,
					'R009'
				);
			}
		}
		if ( 'way' === member.type ) {
			let platform = theOsmData.ways.get ( member.ref );
			this.#platforms.push ( platform );
			if (
				( 'platform' !== platform?.tags?.highway && 'bus' === theConfig.osmVehicle )
				||
				( 'platform' !== platform?.tags?.railway && 'tram' === theConfig.osmVehicle )
			) {
				theReport.addPError (
					'An invalid way (' + theReport.getOsmLink ( member ) +
						') is used as platform for the route',
					null,
					'R010'
				);
			}
		}
	}

	/**
	 * Verify that, for objects having a 'stop' role:
	 * - the member have a tag public_transport='stop_position'
     * @param { Object } member The osm member with the 'stop' role
	 */

	#validateStopRole ( member ) {
		if ( 'node' === member.type ) {
			let stopPosition = theOsmData.nodes.get ( member.ref );
			if ( 'stop_position' !== stopPosition?.tags?.public_transport ) {
				theReport.addPError (
					'An invalid node (' + theReport.getOsmLink ( member ) +
						') is used as stop_position for the route',
					null,
					'R011'
				);
			}
		}
		else {
			theReport.addPError (
				'An invalid object (' + theReport.getOsmLink ( member ) +
					') is used as stop_position for the route',
				null,
				'R012'
			);
		}
	}

	/**
	 * Verify that a way is a valid way for a bus:
	 * - the highway tag of way is in the validBusHighways highway
	 * - or the way have a bus=yes tag or psv=yes tag
	 * @param {Object} way The way to verify
	 */

	#validateWayForBus ( way ) {
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
		if (
			-1 === validBusHighways.indexOf ( way?.tags?.highway )
			&&
			'yes' !== way?.tags?.psv
			&&
			'yes' !== way?.tags [ theConfig.osmVehicle ]
	   ) {
		   theReport.addPError (
			   'An invalid highway (' + theReport.getOsmLink ( way ) +
				   ') is used as way for the route',
			   null,
			   'R013'
		   );
	   }
	   else {
		   this.#ways.push ( way );
	   }

	}

	/**
	 * Verify that a way is valid for a tram:
	 * - the way must have a railway=tram tag
	 * @param {Object} way The way to verify
	 */

	#validateWayForTram ( way ) {
		if ( 'tram' !== way?.tags?.railway ) {
			theReport.addPError (
				'An invalid railway (' + theReport.getOsmLink ( way ) +
					') is used as way for the route',
				null,
				'R014'
			);
		}

	}

	/**
	 * Verify that a way is valid for a subway:
	 * - the way must have a railway=subway tag
	 * @param {Object} way The way to verify
	 */

	#validateWayForSubway ( way ) {
		if ( 'subway' !== way?.tags?.railway ) {
			theReport.addPError (
				'An invalid railway (' + theReport.getOsmLink ( way ) +
					') is used as way for the route',
				null,
				'R014'
			);
		}
	}

	/**
	* Verify that a way is a valid way for an empty role
    @param { Object } member the member to verify
	 */

	#validateWayRole ( member ) {
		let way = theOsmData.ways.get ( member.ref );
		if ( 'way' === member.type ) {
			switch ( theConfig.osmVehicle ) {
			case 'bus' :
				this.#validateWayForBus ( way );
				break;
			case 'tram' :
				this.#validateWayForTram ( way );
				break;
			case 'subway' :
				this.#validateWayForSubway ( way );
				break;
			default :
				break;
			}
		}
		else {
			theReport.addPError (
				'An invalid object (' + theReport.getOsmLink ( member ) +
					') is used as way for the route',
				null,
				'R015'
			);
		}
	}

	/**
	 * Verify that all the members of the route relation have a valid role
	 * and can be used for this role
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
                            ') is found in the route for the osm object ' + theReport.getOsmLink ( member ),
						null,
						'R016'
					);
					break;
				}
			}
		);
	}

	/**
	 * Validate a route
     * @param { Object } route The route to validate
	 */

	validateRoute ( route ) {
		this.#route = route;

		// title
		theReport.add (
			'h2',
			'\nNow validating route ' + ( this.#route.tags.name ?? '' ) + ' ',
			this.#route
		);

		// validation
		this.#platforms = [];
		this.#ways = [];
		this.#validateOperator ( );
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

export default OsmRouteValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */