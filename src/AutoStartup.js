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

import AppLoader from './AppLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * automatic startup
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AutoStartup {

	/**
     * Read and verify the url parameters, complete the form with the parameters and start the control
     */

	start ( ) {

		// reading url
		const docURL = new URL ( window.location );
		let network = docURL.searchParams.get ( 'network' );
		let type = docURL.searchParams.get ( 'type' );
		let vehicle = docURL.searchParams.get ( 'vehicle' );
		let area = docURL.searchParams.get ( 'area' );
		let autoStartup = docURL.searchParams.get ( 'autostartup' );

		// stop if no values
		if ( ! network || ! type || ! vehicle ) {
			return;
		}

		// verification of parameters
		if ( -1 === [ 'bus', 'tram', 'subway' ].indexOf ( vehicle ) ) {
			alert ( 'bad value for vehicle parameter. Must be bus, tram or subway' );
			return;
		}

		if ( -1 === [ 'used', 'proposed', 'disused' ].indexOf ( type ) ) {
			alert ( 'bad value for type parameter. Must be bus used, proposed or disused' );
			return;
		}

		if ( area && ! Number.isInteger ( Number.parseInt ( area ) ) ) {
			alert ( 'bad value for area parameter. Must be a number' );
			return;
		}

		// complete the form
		document.getElementById ( 'osmNetworkInput' ).value = network;
		document.getElementById ( 'osmTypeSelect' ).value = type;
		document.getElementById ( 'osmVehicleSelect' ).value = vehicle;

		if ( area ) {
			document.getElementById ( 'osmAreaInput' ).value = area;
		}

		// auto startup
		if ( 'true' === autoStartup || 'yes' === autoStartup ) {
			new AppLoader ( ).loadApp ( { engine : 'browser' } );
		}
	}

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default AutoStartup;

/* --- End of file --------------------------------------------------------------------------------------------------------- */