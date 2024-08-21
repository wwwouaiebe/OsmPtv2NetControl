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
import theRouteValidator from './RouteValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmDataValidator {

	/**
	* Coming soon
	* @param {?Object} routeMaster Coming soon
	 */

	validateRouteMaster ( routeMaster ) {
		theReport.add (
			'h1',
			'Now validating route_master ' +
            ( routeMaster.tags.name ?? '' ) + ' ' +
            ( routeMaster.tags.description ?? '' ) +
            ' ( ' + theReport.getOsmLink ( routeMaster ) + ' )'
		);

		routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmData.routes.get ( member.ref );
					if ( route ) {
						theRouteValidator.validateRoute ( route );
						if ( routeMaster.tags.ref !== route.tags.ref ) {
							theReport.addPError (
								'ref tag of the route master (' + routeMaster.tags.ref +
								') is not the same than the ref tag of the route (' + route.tags.ref + ')',
								routeMaster.id
							);
						}
					}
					else {
						theReport.addPError ( 'A member of the route master is not a bus relation' );
					}
				}
				else {
					theReport.addPError (
						'A member of the route master is not a relation (' +
                        member.type + ' ' + member.ref + ' )'
					);
				}
			}

		);
	}

	/**
	* Coming soon
	 */

	validate ( ) {

		let routeMasterArray = [];
		let routeMasterWithoutRef = false;
		theOsmData.routeMasters.forEach (
			routeMaster => {
				routeMasterArray.push ( routeMaster );
				if ( ! routeMaster?.tags?.ref ) {
					theReport.addPError (
						'Route_master without ref tag ', routeMaster.id
					);
					routeMasterWithoutRef = true;
				}

				if ( routeMaster.tags.name !== 'Bus ' + routeMaster.tags.ref ) {
					theReport.addPError (
						'Bad name for route_master (must be Bus ' + routeMaster.tags.ref + ')'
						, routeMaster.id
					);
				}
			}
		);

		routeMasterArray.sort (
			( first, second ) => {
				let result = String ( first.tags.ref ).padStart ( 5, ' ' )
					.localeCompare ( String ( second.tags.ref ).padStart ( 5, ' ' ) );
				return result;
			}
		);
		if ( routeMasterWithoutRef ) {
			return;
		}
		routeMasterArray.forEach (
			routeMaster => this.validateRouteMaster ( routeMaster )
		);
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmDataValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */