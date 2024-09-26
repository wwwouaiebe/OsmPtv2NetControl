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
 * Validator for the tags
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TagsValidator {

	/**
     * the used tags
     * @type {Object}
     */

	#tags;

 	/**
	 * The relation currently controlled
	 * @type {Object}
	 */

	#relation;

	/**
     * Search the missing tags
     */

	#searchMissingTags ( ) {
		for ( const [ key, value ] of Object.entries ( this.#tags ) ) {
			if ( this.#relation.tags [ key ] ) {
				if (
					'*' !== value
                    &&
                    '?' !== value
                    &&
                    this.#relation.tags [ key ] !== value
				) {
					theReport.addPError (
						'Invalid value ' + this.#relation.tags [ key ] +
                        ' for tag ' + key + ' (expected ' + value + ')'
					);
				}
			}
			else if ( '?' !== value ) {
				theReport.addPError (
					'No ' + key + ' key for this route'
				);
			}
		}
	}

	/**
     * Search the unuseful tags
     */

	#searchUnusefulTags ( ) {
		if ( 'TECL' !== theConfig.osmNetwork || 'proposed:route' !== theConfig.osmType ) {
			return;
		}
		for ( const key of Object.keys ( this.#relation.tags ) ) {
			if ( ! this.#tags [ key ] ) {
				theReport.addPError (
					'Unuseful ' + key + ' key for this route'
				);
			}
		}
	}

	/**
     * Start the validation
     */

	validate ( ) {
		this.#searchMissingTags ( );

		this.#searchUnusefulTags ( );
	}

	/**
	 * The constructor
	 * @param {Object} relation The controlled route or route_master
     * @param {Object} tags The valid tags
	 */

	constructor ( relation, tags ) {
		this.#relation = relation;
		this.#tags = tags;
		Object.freeze ( this );
	}
}

export default TagsValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */