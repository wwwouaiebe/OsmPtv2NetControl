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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmDataLoader {

	/**
	* Coming soon
	* @param {?Object} elements Coming soon
	 */

	async #loadOsmData ( elements ) {

		elements.forEach (
			element => {
				switch ( element.type ) {
				case 'relation' :
					switch ( element.tags.type ) {
					case 'route_master' :
						theOsmData.routeMasters.set ( element.id, element );
						break;
					case 'proposed:route_master' :
						theOsmData.routeMasters.set ( element.id, element );
						break;
					case 'route' :
						theOsmData.routes.set ( element.id, element );
						break;
					case 'proposed:route' :
						theOsmData.routes.set ( element.id, element );
						break;
					default :
						break;
					}
					break;
				case 'way' :
					theOsmData.ways.set ( element.id, element );
					break;
				case 'node' :
					theOsmData.nodes.set ( element.id, element );
					break;
				default :
					break;
				}
			}
		);
	}

	/**
	* Coming soon
	 */

	async fetchData ( ) {
		let uri = '';
		let uriArea = 0 === theConfig.osmArea ? 'rel' : 'relation(area:' + theConfig.osmArea + ')';

		if ( 0 === theConfig.osmRelation ) {
			uri =
			'https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];' +
			uriArea +
			'[network="' + theConfig.osmNetwork + '"]' +
			'["' + theConfig.osmType + '"="' + theConfig.osmVehicle + '"]' +
			'[type="' + theConfig.osmType + '"]' +
			'->.rou;(.rou <<; - .rou;); >> ->.rm;.rm out;';
		}
		else {
			uri = 'https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];relation(' +
			theConfig.osmRelation +
			')->.rou;(.rou <<; - .rou;); >> ->.rm;.rm out;';
		}

		await fetch ( uri )
			.then (
				response => {
					if ( response.ok ) {
						return response.json ( );
					}
					console.error ( String ( response.status ) + ' ' + response.statusText );

					// process.exit ( 1 );
				}
			)
			.then (
				async jsonResponse => {
					await this.#loadOsmData ( jsonResponse.elements );
				}
			)
			.catch (
				err => {
					console.error ( err );

					// process.exit ( 1 );
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

export default OsmDataLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */