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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class JosmButtonClickEL {

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
     * Event handler
     * @param {Object} event The triggered event
     */

	async handleEvent ( event ) {
		let osmObjId = event.target.dataset.osmObjId;
		event.target.classList.add ( 'josmButtonVisited' );
		await fetch (
			'http://localhost:8111/load_object?new_layer=true&relation_members=true&objects=r' + osmObjId
		)
			.then (
				response => {
					console.error ( String ( response.status ) + ' ' + response.statusText );
				}
			)
			.catch (
				err => {
					alert ( err + '\n\n Are you sure that JOSM is opened and ' +
                        'the remote control activated ?' +
                        '\n\nSee: https://josm.openstreetmap.de/wiki/Help/Preferences/RemoteControl' );
				}
			);
	}
}

export default JosmButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */