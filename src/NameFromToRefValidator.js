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
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * fixme tag validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class NameFromtoRefValidator {

   	/**
	 * The route currently controlled
	 * @type {Object}
	 */

	#route = null;

	/**
	 * The platforms associated to the route (= members with 'platform' role)
	 * @type {Array}
	 */

	#platforms;

	/**
	* Verify that the route have a from tag, a to tag, a name tag and a ref tag
	 */

	#haveTagsNameFromToRef ( ) {
		return this.#route?.tags?.from && this.#route?.tags?.to && this.#route?.tags?.name && this.#route?.tags?.ref;
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
	 * Coming soon
	 */

	validate ( ) {
		this.#validateFrom ( );
		this.#validateTo ( );
		this.#validateName ( );
	}

	/**
	 * The constructor
	 * @param {Object} route the route to validate
	 * @param {Array} platforms The platforms attached to the route
	 */

	constructor ( route, platforms ) {
		this.#route = route;
		this.#platforms = platforms;
		Object.freeze ( this );
	}
}

export default NameFromtoRefValidator;