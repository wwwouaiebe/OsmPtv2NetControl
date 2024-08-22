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
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GoButtonClickEL {

	/**
	 * The contructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Coming soon
	 */

	handleEvent ( ) {

		let osmNetwork = document.getElementById ( 'osmNetworkInput' ).value;
		let osmVehicle = document.getElementById ( 'osmVehicleSelect' ).value;
		let osmType = document.getElementById ( 'osmTypeSelect' ).value;
		let osmArea = document.getElementById ( 'osmAreaInput' ).value;
		let osmRelation = document.getElementById ( 'osmRelationInput' ).value;

		// Todo verification of input

		if ( '' === osmArea ) {
			osmArea = '0';
		}
		if ( '0' !== osmArea ) {
			// eslint-disable-next-line no-magic-numbers
			osmArea = '36' + osmArea.padStart ( 8, '0' );
		}
		if ( '' === osmRelation ) {
			osmRelation = '0';
		}

		new AppLoader ( ).loadApp (
			{
				osmNetwork : osmNetwork,
				osmVehicle : osmVehicle,
				osmType : osmType,
				osmArea : Number.parseInt ( osmArea ),
				osmRelation : Number.parseInt ( osmRelation )
			}
		);
	}
}

export default GoButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */