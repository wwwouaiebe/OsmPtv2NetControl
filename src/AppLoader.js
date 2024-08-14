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

import process from 'process';
import theConfig from './Config.js';
import OsmDataLoader from './OsmDataLoader.js';
import OsmDataValidator from './OsmDataValidator.js';
import theReport from './Report.js';
import childProcess from 'child_process';

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
	* Complete theConfig object from the app parameters
	* @param {?Object} options The options for the app
	 */

	#createConfig ( options ) {

		if ( options ) {
			theConfig.dbName = options.dbName;
			theConfig.appDir = process.cwd ( ) + '/node_modules/osmbus2mysql/src';
		}
		else {
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
					default :
						break;
					}
				}
			);

			switch ( theConfig.osmType ) {
			case 'proposed' :
				theConfig.osmType = 'proposed:route';
				break;
			case 'used' :
				theConfig.osmType = 'route';
				break;
			default :
				console.error ( 'Invalid osmType' );
				process.exit ( 1 );
			}

			if ( 0 === theConfig.osmArea && 0 === theConfig.osmRelation ) {
				console.error ( 'Invalid osmArea or osmRelation' );
				process.exit ( 1 );
			}

			theConfig.appDir = process.argv [ 1 ];
		}

		// the config is now frozen
		Object.freeze ( theConfig );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Load the app, searching all the needed infos to run the app correctly
	 */

	async loadApp ( /* options */ ) {
		this.#createConfig ( );
		theReport.open ( );
		theReport.addP (
			'Request : ' +
			theConfig.osmType + ' ' +
			( 0 === theConfig.osmArea ? '' : '- area : ' + theConfig.osmArea ) +
			( 0 === theConfig.osmRelation ? '' : 'relation : ' + theConfig.osmRelation )
		);
		await new OsmDataLoader ( ).fetchData ( );
		new OsmDataValidator ( ).validate ( );
		theReport.close ( );
		console.error ( '\n\t... launching in the browser...\n' );
		childProcess.exec ( './report/index.html' );
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */