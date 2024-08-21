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

// import process from 'process';
import theConfig from './Config.js';
import OsmDataLoader from './OsmDataLoader.js';
import OsmDataValidator from './OsmDataValidator.js';
import theReport from './Report.js';
import MissingRouteMasterValidator from './MissingRouteMasterValidator.js';
import theOsmData from './OsmData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Start the app:
 * - read and validate the arguments
 * - set the config
 * - remove the old files if any
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
     * The version number
     * @type {String}
     */

	static get #version ( ) { return 'v1.1.0'; }

	/**
	* Complete theConfig object from the app parameters (nodejs) or the options parameter (browser)
	* @param {?Object} options The options for the app when the browser is used
	 */

	async #createConfig ( options ) {

		if ( options ) {
			theConfig.osmArea = options.osmArea;
			theConfig.osmNetwork = options.osmNetwork;
			theConfig.osmRelation = options.osmRelation;
			theConfig.osmType = options.osmType;
			theConfig.osmVehicle = options.osmVehicle;
			theConfig.engine = 'browser';
		}
		else {
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
			process.exit ( 1 );
		}

		// the config is now frozen
		// Object.freeze ( theConfig );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Load the app, searching all the needed infos to run the app correctly
	 * @param {Object} options Coming soon
	 */

	async loadApp ( options ) {

		this.#createConfig ( options );
		theOsmData.clear ( );
		theReport.open ( );

		if ( 'nodejs' === theConfig.engine ) {
			theReport.add (
				'p',
				'Request parameters: type = ' +
					theConfig.osmType +
					' - network = ' + theConfig.osmNetwork +
					' - vehicle = ' + theConfig.osmVehicle +
					( 0 === theConfig.osmArea ? '' : ' - area =  ' + theConfig.osmArea ) +
					( 0 === theConfig.osmRelation ? '' : ' - relation = ' + theConfig.osmRelation ) +
					' - ' + new Date ().toString ( )
			);
		}
		await new MissingRouteMasterValidator ( ).fetchData ( );
		await new OsmDataLoader ( ).fetchData ( );
		new OsmDataValidator ( ).validate ( );
		await theReport.close ( );
		console.error ( '\n' + theReport.errorCounter + ' errors  found' );
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */