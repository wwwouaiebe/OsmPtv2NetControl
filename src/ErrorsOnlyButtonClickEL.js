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
 * Simple click event handler for the 'Show errors only' button of the web page
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class ErrorsOnlyButtonClickEL {

	#buttonValue = 'Errors only';

	/**
	 * The contructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * event handler
	 */

	handleEvent ( event ) {
		event.target.value = 'All' === event.target.value ? 'Error only'  : 'All';
		report.classList.toggle ( 'errorsOnly' );
		let showH1H2 = report.classList.contains ( 'errorsOnly' );
		let previousH1 = null;
		let previousH2 = null;
		report.childNodes.forEach (
			node => {
				switch ( node.tagName ) {
				case 'H1' :
					previousH1 = node;
					break;
				case 'H2' :
					previousH2 = node;
					break;
				case 'P' :
					if ( previousH1 ) {
						if ( showH1H2 ) {
							previousH1.classList.add ( 'showOnError' );
						}
						else {
							previousH1.classList.remove ( 'showOnError' );
						}
					}
					if ( previousH2 ) {
						if ( showH1H2 ) {
							previousH2.classList.add ( 'showOnError' );
						}
						else {
							previousH2.classList.remove ( 'showOnError' );
						}
					}
					break;
				default :
					break;
				}
			}
		);
		report.firstChild.classList.add ( 'showOnError' );
	}

}

export default ErrorsOnlyButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */