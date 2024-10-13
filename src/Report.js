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
import theOsmData from './OsmData.js';
import JosmButtonClickEL from './JosmButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class creates an HTML file with the detected errors (when usedwith nodejs) or add the detected error to
 * the main HTML page (when used from a browser)
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Report {

	/**
	 * The help for the errors
	 * @type {Object}
	 */

	#errorHelp = {};

	/**
	* The report. A string for nodejs or an HTMLElement for browser
	* @type {String|HTMLElement}
	 */

	#report = '';

	/**
	* A counter for errors
	* @type {Number}
	 */

	#errorCounter = 0;

	/**
	* The value of the errorCounter
	@type {Number}
	 */

	get errorCounter ( ) { return this.#errorCounter; }

   	/**
	 * open the report.
	 * - for browser : clean the HTMLElement where the error have to be reported, add a title and start an animation
	 * - for nodejs : add the html header as text to the report and add a line withe user's request
	 */

	async open ( ) {
		this.#errorCounter = 0;

		this.#errorHelp = ( await import ( './ErrorsHelpEN.js' ) ).errorHelp;
		if ( 'browser' === theConfig.engine ) {
			this.#report = document.getElementById ( 'report' );
			while ( this.#report.firstChild ) {
				this.#report.removeChild ( this.#report.firstChild );
			}
			document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
			this.add ( 'h1', '??? errors found' );
		}
		else {
			this.#report =
				'<!DOCTYPE html>\n' +
				'<!--\n' +
				'/*\n' +
				'This  program is free software;\n' +
				'you can redistribute it and/or modify it under the terms of the\n' +
				'GNU General Public License as published by the Free Software Foundation;\n' +
				'either version 3 of the License, or any later version.\n' +
				'\n' +
				'This program is distributed in the hope that it will be useful,\n' +
				'but WITHOUT ANY WARRANTY; without even the implied warranty of\n' +
				'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n' +
				'GNU General Public License for more details.\n' +
				'\n' +
				'You should have received a copy of the GNU General Public License\n' +
				'along with this program; if not, write to the Free Software\n' +
				'Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA\n' +
				'*/\n' +
				'-->\n' +
				'<html>\n' +
				'	<head>\n' +
				'		<meta charset="UTF-8" />\n' +
				'		<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
				'		<title>wwwouaiebe - osm bus relations report</title>\n' +
				'		<link rel="stylesheet" href="report.css" />\n' +
				'	</head>\n' +
				'	<body>\n';

			this.add (
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
	}

  	/**
	 * close the report
	 * for browser: close the animation, add the error counter and event listeners for JOSM buttons
	 * for nodejs: close the body and html tags and save the report to a file
	 */

	async close ( ) {

		if ( 'nodejs' === theConfig.engine ) {
			this.#report +=
				'	</body>\n' +
				'</html>';
			( await import ( 'fs' ) ).writeFileSync ( './report/index.html', this.#report );
		}
		else {
			document.getElementById ( 'waitAnimation' ).style.visibility = 'hidden';
			this.#report.firstChild.textContent = String ( this.#errorCounter ) + ' errors found - ' +
			String ( theOsmData.routeMasters.size ) + ' route_master and ' +
			String ( theOsmData.routes.size ) + ' routes controlled';
			let josmButtons = document.getElementsByClassName ( 'josmButton' );
			for ( let counter = 0; counter < josmButtons.length; counter ++ ) {
				josmButtons[ counter ].addEventListener ( 'click', new JosmButtonClickEL ( ) );
			}
		};
	}

  	/**
	* Add a text to the report
	* @param {String} htmlTag The html tag to use
	* @param {String} text the text to add
	* @param {Object} osmObject When not null, a link to osm is added at the end of the text
	 */

	add ( htmlTag, text, osmObject ) {

		let osmLink = osmObject ? '(' + this.getOsmLink ( osmObject ) + ' )' : '';
		if ( 'browser' === theConfig.engine ) {
			let josmEdit = '';
			if ( osmObject ) {
				josmEdit = '<button title="Edit the relation with JOSM\nJOSM must be already opened!" ' +
					'class="josmButton" data-osm-obj-id="' +
					( osmObject.id ?? osmObject.ref ) + '" >JOSM</button>';
			}
			let htmlElement = document.createElement ( htmlTag );
			htmlElement.innerHTML = text + osmLink + josmEdit;
			this.#report.appendChild ( htmlElement );
		}
		else {
			this.#report += '<' + htmlTag + '>' + text + osmLink + '</ ' + htmlTag + '>\n';
		}
	}

	/**
	* Add an error to the report
	 * @param {String} text The text explaining the error
	 * @param {?Object} osmObject The falsy object. The object's id is used for the JOSM button
	 * @param {String} errorCode. An error code. when not null the help for the error is added in the tooltip.
	 */

	addPError ( text, osmObject, errorCode ) {

		if ( 'browser' === theConfig.engine ) {
			let josmEdit = '';
			if ( osmObject ) {
				josmEdit = '<button title="Edit the relation with JOSM\nJOSM must be already opened!" ' +
					'class="josmButton" data-osm-obj-id="' +
					osmObject.id + '" >JOSM </button>';
			}
			let htmlElement = document.createElement ( 'p' );
			htmlElement.classList.add ( 'error' );
			if ( errorCode ) {
				let title = this.#errorHelp [ errorCode ] + '\n';

				/*
				for ( const property in osmObject.tags ) {
					title += '\n' + property + '=' + osmObject.tags [ property ];
				}
				*/

				htmlElement.title = title;
			}
			htmlElement.innerHTML = text + josmEdit;
			this.#report.appendChild ( htmlElement );
		}
		else {
			let josmEdit = '';
			if ( osmObject ) {
				josmEdit = ' ( <a class ="josmedit" target="_blank" ' +
					'href="http://localhost:8111/load_object?new_layer=true&relation_members=true&objects=r' + osmObject.id +
					'">Edit with JOSM</a> )';
			}
			this.#report += '       <p class="error">' + text + josmEdit + '</p>\n';
		}

		this.#errorCounter ++;
	}

	/**
	 * Get a URL to osm with a ling to an osm object
	 * @param {Object} member an osm object or a member of a relation
	 * @returns {string} An url to osm
	 */

	getOsmLink ( member ) {

		let osmId = member.id ?? member.ref;
		let osmLink = '<a target="_blank" href="https://www.openstreetmap.org/';

		switch ( member.type ) {
		case 'node' :
			osmLink += 'node/' + osmId + '"> node : ' + osmId + '</a>';
			break;
		case 'way' :
			osmLink += 'way/' + osmId + '"> way : ' + osmId + '</a>';
			break;
		case 'relation' :
			osmLink += 'relation/' + osmId + '"> relation : ' + osmId + '</a>';
			break;
		default :
			osmLink = '';
			break;
		}

		return osmLink;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
		this.#errorCounter = 0;
	}
}

/**
 * The one and only one Report object
 * @type {Report}
 */

let theReport = new Report ( );

export default theReport;

/* --- End of file --------------------------------------------------------------------------------------------------------- */