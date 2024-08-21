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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Report {

	/**
	* Coming soon
	* @type {String}
	 */

	#report = '';

	/**
	* Coming soon
	* @type {Number}
	 */

	#errorCounter = 0;

	/**
	* Coming soon
	@type {Number}
	 */

	get errorCounter ( ) { return this.#errorCounter; }

   	/**
	* Coming soon
	 */

	open ( ) {
		this.#errorCounter = 0;
		if ( 'browser' === theConfig.engine ) {
			this.#report = document.getElementById ( 'report' );
			while ( this.#report.firstChild ) {
				this.#report.removeChild ( this.#report.firstChild );
			}
			document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
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
		}
	}

  	/**
	* Coming soon
	 */

	async close ( ) {

		if ( 'nodejs' === theConfig.engine ) {
			await import ( 'fs' );
			this.#report +=
				'	</body>\n' +
				'</html>';
			( await import ( 'fs' ) ).writeFileSync ( './report/index.html', this.#report );
		}
		else {
			document.getElementById ( 'waitAnimation' ).style.visibility = 'hidden';
		}

	}

  	/**
	* Coming soon
	* @param {String} htmlTag Coming soon
	* @param {String} text Coming soon
	* @param {Object} osmObject Coming soon
	 */

	add ( htmlTag, text, osmObject ) {

		let osmLink = osmObject ? '(' + this.getOsmLink ( osmObject ) + ')' : '';
		if ( 'browser' === theConfig.engine ) {
			let htmlElement = document.createElement ( htmlTag );
			htmlElement.innerHTML = text + osmLink;
			this.#report.appendChild ( htmlElement );
		}
		else {
			this.#report += '<' + htmlTag + '>' + text + osmLink + '</ ' + htmlTag + '>\n';
		}
	}

	/**
	* Coming soon
	* @param {String} text Coming soon
	* @param {Number} osmId Coming soon
	 */

	addPError ( text, osmId ) {

		let josmEdit = ' ( <a class ="josmedit" target="_blank" ' +
		'href="http://localhost:8111/load_object?new_layer=true&relation_members=true&objects=r' + osmId + 
		'">Edit with JOSM</a> )';

		if ( 'browser' === theConfig.engine ) {
			let htmlElement = document.createElement ( 'p' );
			htmlElement.classList.add ( 'error' );
			htmlElement.innerHTML = text + josmEdit;
			this.#report.appendChild ( htmlElement );
		}
		else {
			this.#report += '       <p class="error">' + text + josmEdit + '</p>\n';
		}

		this.#errorCounter ++;
	}

	/**
	* Coming soon
	* @param {?Object} member Coming soon
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
 * Coming soon
 * @type {Object}
 */

let theReport = new Report ( );

export default theReport;

/* --- End of file --------------------------------------------------------------------------------------------------------- */