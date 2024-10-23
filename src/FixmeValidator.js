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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * fixme tag validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class FixmeValidator {

	/**
	 *  Validate the fixme tags
	 * @param {Object} element
	 */

	validate ( element ) {
		if ( element?.tags?.fixme ) {
			theReport.addPError (
				'A fixme exists for this relation (' + element.tags.fixme + ')',
				null,
				'W002'
			);
		}
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default FixmeValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */