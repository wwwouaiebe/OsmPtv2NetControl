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
import OsmDataLoader from './OsmDataLoader.js';
import theReport from './Report.js';
import theOsmData from './OsmData.js';
import OsmRouteMasterValidator from './OsmRouteMasterValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Start the app:
 * - read and validate the arguments (nodejs) or the controls on the web page (browser)
 * - set the config
 * - remove the old files if any
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
	* Complete theConfig object from the web page
	 */

	#createConfigForBrowser ( ) {

		theConfig.osmNetwork = document.getElementById ( 'osmNetworkInput' ).value;
		theConfig.osmVehicle = document.getElementById ( 'osmVehicleSelect' ).value;
		theConfig.osmType = document.getElementById ( 'osmTypeSelect' ).value;
		theConfig.osmArea = document.getElementById ( 'osmAreaInput' ).value;
		theConfig.osmRelation = document.getElementById ( 'osmRelationInput' ).value;
		theConfig.engine = 'browser';

		if ( '' === theConfig.osmArea ) {
			theConfig.osmArea = '0';
		}

		theConfig.osmArea = Number.parseInt ( theConfig.osmArea );

		if ( '' === theConfig.osmRelation ) {
			theConfig.osmRelation = '0';
		}
		theConfig.osmRelation = Number.parseInt ( theConfig.osmRelation );
	}

	/**
	* Complete theConfig object from the app parameters
	 */

	#createConfigForNode ( ) {
		theConfig.appDir = process.cwd ( ) + '/node_modules/osmbus2mysql/src';
		process.argv.forEach (
			arg => {
				const argContent = arg.split ( '=' );
				switch ( argContent [ 0 ] ) {
				case '--osmType' :
					theConfig.osmType = argContent [ 1 ] || theConfig.osmType;
					break;
				case '--osmArea' :
					theConfig.osmArea = argContent [ 1 ] || theConfig.osmArea;
					break;
				case '--osmRelation' :
					theConfig.osmRelation = argContent [ 1 ] || theConfig.osmRelation;
					break;
				case '--osmNetwork' :
					theConfig.osmNetwork = argContent [ 1 ] || theConfig.osmNetwork;
					break;
				case '--osmVehicle' :
					theConfig.osmVehicle = argContent [ 1 ] || theConfig.osmVehicle;
					break;
				default :
					break;
				}
			}
		);

		theConfig.appDir = process.argv [ 1 ];
		theConfig.engine = 'nodejs';
	}

	/**
	* Complete theConfig object from the app parameters (nodejs) or the options parameter (browser)
	* @param {?Object} options The options for the app when the browser is used
	* @returns {boolean} True when the config is succesfully created
	 */

	async #createConfig ( options ) {

		if ( 'browser' === options?.engine ) {
			this.#createConfigForBrowser ( );
		}
		else {
			this.#createConfigForNode ( );
		}

		// if osmArea is different of 0, osmArea must be 36 + osmArea with 6 digits (see Overpass-api rules)
		if ( 0 !== theConfig.osmArea ) {
			// eslint-disable-next-line no-magic-numbers
			theConfig.osmArea = Number.parseInt ( '36' + String ( theConfig.osmArea ).padStart ( 8, '0' ) );
		}

		// Set the osmType to the value needed for overpass-api
		switch ( theConfig.osmType ) {
		case 'proposed' :
			theConfig.osmType = 'proposed:route';
			break;
		case 'used' :
		case 'route' :
			theConfig.osmType = 'route';
			break;
		default :
			console.error ( 'Invalid osmType' );
			return false;
		}

		// the config is now sealed
		Object.seal ( theConfig );
		return true;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Load the app, searching all the needed infos to run the app correctly
	 * @param {Object} options Options for the program
	 */

	async loadApp ( options ) {

		if ( ! this.#createConfig ( options ) ) {
			return;
		}

		theOsmData.clear ( );
		theReport.open ( );

		if ( await new OsmDataLoader ( ).fetchData ( ) ) {
			await new OsmRouteMasterValidator ( ).validate ( );
		}
		await theReport.close ( );
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */