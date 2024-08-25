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

import theReport from './Report.js';
import theConfig from './Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class search all bus/tram/metro relations without route_master and add the errors to the report
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class MissingRouteMasterValidator {

	/**
	 * Add the errors to the report
	 * @param {Array} elements An erray with routes without route_master
	 */

	#reportMissingRouteMaster ( elements ) {

		// title... if errors found
		if ( elements ) {
			theReport.add ( 'h1', 'Routes without route_master' );
		}

		// errors
		elements.forEach (
			element => {
				theReport.addPError (
					'Route wihout route_master ' + theReport.getOsmLink ( element ),
					element.id
				);
			}
		);
	}

	/**
	* fetch the data from overpass-api
	 */

	 async fetchData ( ) {

		// exit if the control is only on one relation
		if ( 0 !== theConfig.osmRelation ) {
			return;
		}

		// Creation of the uri
		let uriArea = 0 === theConfig.osmArea ? 'rel' : 'relation(area:' + theConfig.osmArea + ')';

		let uri =
			'https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];' +
			uriArea +
			'["network"="' + theConfig.osmNetwork + '"]' +
			'["type"="' + theConfig.osmType + '"]' +
			'["route"="' + theConfig.osmVehicle + '"]' +
			'->.all;' +
			'rel["' + theConfig.osmType + '_master"="' + theConfig.osmVehicle + '"]' +
			'(br.all);rel["' + theConfig.osmType + '"="' + theConfig.osmVehicle + '"]' +
			'(r)->.b;(.all; - .b; );out;';

		// fetch
		await fetch ( uri )
			.then (
				response => {
					if ( response.ok ) {
						return response.json ( );
					}
					console.error ( String ( response.status ) + ' ' + response.statusText );
				}
			)
			.then (
				jsonResponse => {
					this.#reportMissingRouteMaster ( jsonResponse.elements );
				}
			)
			.catch (
				err => {
					console.error ( err );
				}
			);
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default MissingRouteMasterValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */