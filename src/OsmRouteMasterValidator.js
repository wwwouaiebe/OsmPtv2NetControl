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
import theConfig from './Config.js';
import theReport from './Report.js';
import OsmRouteValidator from './OsmRouteValidator.js';
import MissingRouteMasterValidator from './MissingRouteMasterValidator.js';
import TagsValidator from './TagsValidator.js';
import TagsBuilder from './TagsBuilder.js';
import FixmeValidator from './FixmeValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * route_master validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteMasterValidator {

	/**
     * the used tags
     * @type {Object}
     */

	#tags;

	/**
	 * The currently validated route master
	 * @type {Object}
	 */

	#routeMaster;

	/**
	 * An OsmRouteValidator object
	 * @type {OsmRouteValidator}
	 */

	#osmRouteValidator;

	/**
	 * Verify that only one route_master use a route
	 */

	#validateOnlyOneRouteMaster ( ) {
		theReport.add ( 'h1', 'Routes with more than one route_master' );
		theOsmData.routes.forEach (
			route => {
				if ( 1 !== route.routeMasters.length ) {
					let text = 'Route with more than one route_master (route_masters:';
					route.routeMasters.forEach (
						routeMaster => {
							text += theReport.getOsmLink ( theOsmData.routeMasters.get ( routeMaster ) ) + ' ';
						}
					);
					text += ') routes:' + theReport.getOsmLink ( route );
					theReport.addPError ( text, route, 'M002' );
				}
			}

		);
	}

	/**
	 * verify that
	 * - the members are relations
	 * - the relation members are route relations
	 */

	#validateMembers ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmData.routes.get ( member.ref );
					if ( ! route ) {
						theReport.addPError (
							'A relation member of the route master is not a ' +
                            theConfig.osmVehicle + ' relation',
							this.#routeMaster,
							'M003'
					 );
					}
				}
				else {
					theReport.addPError (
						'A member of the route master is not a relation (' +
                        member.type + ' ' + member.ref + ' )',
						this.#routeMaster,
						'M004'
					);
				}
			}
		);
	}

	/**
	 * Verify that the route_master have a ref tag
	 */

	#validateRefTag ( ) {
		if ( ! this.#routeMaster?.tags?.ref ) {
			theReport.addPError (
				'Route_master without ref tag ',
				this.#routeMaster,
				 'M005'
			);
		}
	}

	/**
	 * verify that
	 * - the ref tag is the same on the route_master and on all route members
	 */

	#validateSameRefTag ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmData.routes.get ( member.ref );
					if ( route ) {
						if ( this.#routeMaster.tags.ref !== route.tags.ref ) {
							theReport.addPError (
								'ref tag of the route master (' + this.#routeMaster.tags.ref +
								') is not the same than the ref tag of the route (' + route.tags.ref + ')',
								this.#routeMaster,
								'M006'
							);
						}
					}
				}
			}
		);
	}

	/**
	 * verify that the name tag is compliant with the osm rules
	 */

	#validateName ( ) {
		let vehicle = theConfig.osmVehicle.substring ( 0, 1 ).toUpperCase ( ) +
			theConfig.osmVehicle.substring ( 1 ) + ' ';
		if ( this.#routeMaster.tags.name !== vehicle + this.#routeMaster.tags.ref ) {
			theReport.addPError (
				'Invalid name for route_master (must be ' + vehicle + this.#routeMaster.tags.ref + ')'
				, this.#routeMaster,
				'M007'
			);
		}
	}

	/**
	 * validate each route associated to the route_master
	 */

	#validateRoutes ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmData.routes.get ( member.ref );
					if ( route ) {
						this.#osmRouteValidator.validateRoute ( route );
					}
				}
			}
		);
	}

	/**
	 * validate completely a route_master
	 */

	#validateRouteMaster ( ) {

		// heading in the report
		theReport.add (
			'h1',
			'Now validating route_master ' +
            ( this.#routeMaster.tags.name ?? '' ) + ' ' +
            ( this.#routeMaster.tags.description ?? '' ) + ' ',
			this.#routeMaster
		);

		// validation of the route_master
		new TagsValidator ( this.#routeMaster, this.#tags ).validate ( );
		this.#validateMembers ( );
		this.#validateRefTag ( );
		this.#validateSameRefTag ( );
		this.#validateName ( );
		new FixmeValidator ( ).validate ( this.#routeMaster );
		this.#validateRoutes ( );
	}

	/**
	 * create an array with all route_master and sort this array based on the ref of each route_master
	 * @returns {Array} An array of route_master sorted by ref
	 */

	#sortRouteMasters ( ) {
		let routeMasterArray = [];

		// Collecting route_masters
		theOsmData.routeMasters.forEach (
			routeMaster => {
				routeMasterArray.push ( routeMaster );
			}
		);

		// Sorting the route_masters
		routeMasterArray.sort (
			( first, second ) => {

				// split the name into the numeric part and the alphanumeric part:
				// numeric part
				let firstPrefix = String ( Number.parseInt ( first.tags.ref ) );
				let secondPrefix = String ( Number.parseInt ( second.tags.ref ) );

				// alpha numeric part
				let firstPostfix = ( first.tags.ref ?? '' ).replace ( firstPrefix, '' );
				let secondPostfix = ( second.tags.ref ?? '' ).replace ( secondPrefix, '' );

				// complete the numeric part with spaces on the left and compare
				let result =
					( firstPrefix.padStart ( 5, ' ' ) + firstPostfix )
						.localeCompare ( secondPrefix.padStart ( 5, ' ' ) + secondPostfix );

				return result;
			}
		);

		return routeMasterArray;
	}

	/**
	 * the main procedure
	 */

	async validate ( ) {
		await new MissingRouteMasterValidator ( ).fetchData ( );
		this.#validateOnlyOneRouteMaster ( );
		this.#sortRouteMasters ( ).forEach (
			routeMaster => {
				this.#routeMaster = routeMaster;
				this.#validateRouteMaster ( );
			}
		);
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		this.#osmRouteValidator = new OsmRouteValidator ( );
		this.#tags = new TagsBuilder ( ).getRouteMasterTags ( );
		Object.freeze ( this );
	};
}

export default OsmRouteMasterValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */