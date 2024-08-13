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
                        previousWay.nodes [ 0 ] !== way.nodes.toReversed [ 0 ]
                        &&
                        previousWay.nodes.toReversed [ 0 ] !== way.nodes [ 0 ]
                        &&
                        previousWay.nodes.toReversed [ 0 ] !== way.nodes.toReversed [ 0 ]
					) {
						console.error (
							'Hole found for route ' + this.#route.id +
                            ' between way id ' + previousWay.id +
                            'and way id ' + way.id
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
			console.error (
				'A from tag is not found for route ' + this.#route.id
			);
		}
		else if ( this.#route.tags.from !== this.#platforms[ 0 ].tags.name ) {
			console.error (
				'The from tag ( ' + this.#route?.tags?.from +
				' ) is not equal to the name of the first platform ( ' +
				this.#platforms[ 0 ].tags.name + ' ) for route ' + this.#route.id
			);
		}
		if ( ! this.#route?.tags?.to ) {
			console.error (
				'A to tag is not found for route ' + this.#route.id
			);
		}
		else if ( this.#route.tags.to !== this.#platforms.toReversed ( )[ 0 ].tags.name ) {
			console.error (
				'The to tag ( ' + this.#route.tags.to +
				' ) is not equal to the name of the last platform ( ' +
				this.#platforms.toReversed ( )[ 0 ].tags.name + ' ) for route ' + this.#route.id
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
					console.error (
						'An unordered object with a role (' + member.ref +
                                ') is found in the ways of route ' + this.#route.id
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
							console.error (
								'An invalid node (' + member.ref +
                                    ') is used as platform for the route ' + this.#route.id
							);
						}
					}
					if ( 'way' === member.type ) {
						let platform = theOsmData.ways.get ( member.ref );
						this.#platforms.push ( platform );
						if ( 'platform' !== platform?.tags?.highway ) {
							console.error (
								'An invalid way (' + member.ref +
                                    ') is used as platform for the route ' + this.#route.id
							);
						}
					}
					break;
				case 'stop' :
					if ( 'node' === member.type ) {
						let stopPosition = theOsmData.nodes.get ( member.ref );
						if ( 'stop_position' !== stopPosition?.tags?.public_transport ) {
							console.error (
								'An invalid node (' + member.ref +
                                    ') is used as stop_position for the route ' + this.#route.id
							);
						}
					}
					else {
						console.error (
							'An invalid object (' + member.ref +
								') is used as stop_position for the route ' + this.#route.id
						);
					}
					break;
				case '' :
					if ( 'way' === member.type ) {
						let way = theOsmData.ways.get ( member.ref );
						if ( -1 === validBusHighways.indexOf ( way?.tags?.highway )
						) {
							console.error (
								'An invalid highway (' + member.ref +
                                    ') is used as way for the route ' + this.#route.id
							);

						}
						else {
							this.#ways.push ( way );
						}
					}
					else {
						console.error (
							'An invalid object (' + member.ref +
                                ') is used as way for the route ' + this.#route.id
						);
					}
					break;
				default :
					console.error (
						'An unknow role (' + member.role +
                            ') is found in the route ' + this.#route.id +
                            ' for the osm object ' + member.ref
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
		console.error (
			'\nNow validating route ' + ( this.#route.tags.name ?? '' ) + ' ( id : ' + this.#route.id + ' )'
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