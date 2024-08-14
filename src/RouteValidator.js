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
	 */

	#validateWaysOrder ( ) {
		let previousWay = null;
		this.#ways.forEach (
			way => {
				if ( previousWay ) {
					if (
						previousWay.nodes [ 0 ] !== way.nodes [ 0 ]
                        &&
                        previousWay.nodes [ 0 ] !== way.nodes.toReversed ( ) [ 0 ]
                        &&
                        previousWay.nodes.toReversed ( ) [ 0 ] !== way.nodes [ 0 ]
                        &&
                        previousWay.nodes.toReversed ( ) [ 0 ] !== way.nodes.toReversed ( ) [ 0 ]
					) {
						theReport.addP (
							'Hole found for route ' + theReport.getOsmLink ( this.#route ) +
                            ' between way id ' + theReport.getOsmLink ( previousWay ) +
                            ' and way id ' + theReport.getOsmLink ( way )
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

	#validateFromTo ( ) {
		if ( ! this.#route?.tags?.from ) {
			theReport.addP (
				'A from tag is not found for route ' + theReport.getOsmLink ( this.#route )
			);
		}
		else if ( this.#route.tags.from !== this.#platforms[ 0 ].tags.name ) {
			theReport.addP (
				'The from tag ( ' + this.#route?.tags?.from +
				' ) is not equal to the name of the first platform ( ' +
				this.#platforms[ 0 ].tags.name + ' ) for route ' + theReport.getOsmLink ( this.#route )
			);
		}
		if ( ! this.#route?.tags?.to ) {
			theReport.addP (
				'A to tag is not found for route ' + theReport.getOsmLink ( this.#route )
			);
		}
		else if ( this.#route.tags.to !== this.#platforms.toReversed ( )[ 0 ].tags.name ) {
			theReport.addP (
				'The to tag ( ' + this.#route.tags.to +
				' ) is not equal to the name of the last platform ( ' +
				this.#platforms.toReversed ( )[ 0 ].tags.name + ' ) for route ' + theReport.getOsmLink ( this.#route )
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
					theReport.addP (
						'An unordered object with a role (' + theReport.getOsmLink ( member ) +
                                ') is found in the ways of route ' + theReport.getOsmLink ( this.#route )
					);
				}
			}
		);
	}

	/**
	* Coming soon
	 */

	#validateRolesObjects ( ) {
		const validBusHighways = [
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
		this.#route.members.forEach (
			// eslint-disable-next-line complexity
			member => {
				switch ( member.role ) {
				case 'platform' :
				case 'platform_entry_only' :
				case 'platform_exit_only' :
					if ( 'node' === member.type ) {
						let busStop = theOsmData.nodes.get ( member.ref );
						this.#platforms.push ( busStop );
						if ( 'bus_stop' !== busStop?.tags?.highway ) {
							theReport.addP (
								'An invalid node (' + theReport.getOsmLink ( member ) +
                                    ') is used as platform for the route ' + theReport.getOsmLink ( this.#route )
							);
						}
					}
					if ( 'way' === member.type ) {
						let platform = theOsmData.ways.get ( member.ref );
						this.#platforms.push ( platform );
						if ( 'platform' !== platform?.tags?.highway ) {
							theReport.addP (
								'An invalid way (' + theReport.getOsmLink ( member ) +
                                    ') is used as platform for the route ' + theReport.getOsmLink ( this.#route )
							);
						}
					}
					break;
				case 'stop' :
					if ( 'node' === member.type ) {
						let stopPosition = theOsmData.nodes.get ( member.ref );
						if ( 'stop_position' !== stopPosition?.tags?.public_transport ) {
							theReport.addP (
								'An invalid node (' + theReport.getOsmLink ( member ) +
                                    ') is used as stop_position for the route ' + theReport.getOsmLink ( this.#route )
							);
						}
					}
					else {
						theReport.addP (
							'An invalid object (' + theReport.getOsmLink ( member ) +
								') is used as stop_position for the route ' + theReport.getOsmLink ( this.#route )
						);
					}
					break;
				case '' :
					if ( 'way' === member.type ) {
						let way = theOsmData.ways.get ( member.ref );
						if ( -1 === validBusHighways.indexOf ( way?.tags?.highway )
						) {
							theReport.addP (
								'An invalid highway (' + theReport.getOsmLink ( member ) +
                                    ') is used as way for the route ' + theReport.getOsmLink ( this.#route )
							);

						}
						else {
							this.#ways.push ( way );
						}
					}
					else {
						theReport.addP (
							'An invalid object (' + theReport.getOsmLink ( member ) +
                                ') is used as way for the route ' + theReport.getOsmLink ( this.#route )
						);
					}
					break;
				default :
					theReport.addP (
						'An unknow role (' + member.role +
                            ') is found in the route ' + theReport.getOsmLink ( this.#route ) +
                            ' for the osm object ' + theReport.getOsmLink ( member )
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
		theReport.addH2 (
			'\nNow validating route ' + ( this.#route.tags.name ?? '' ) +
			' ( ' + theReport.getOsmLink ( this.#route ) + ' )'
		);

		this.#platforms = [];
		this.#ways = [];
		this.#validateRolesObjects ( );
		this.#validateRolesOrder ( );
		this.#validateWaysOrder ( );
		this.#validateFromTo ( );
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