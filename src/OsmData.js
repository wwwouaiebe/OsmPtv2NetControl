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

class OsmData {

	/**
	 * Coming soon
	 * @type {Map}
	 */

	routeMasters = new Map ( );

	/**
	 * Coming soon
	 * @type {Map}
	 */

	routes = new Map ( );

	/**
	 * Coming soon
	 * @type {Map}
	 */

	ways = new Map ( );

	/**
	 * Coming soon
	 * @type {Map}
	 */

	platforms = new Map ( );

	/**
	 * Coming soon
	 * @type {Map}
	 */

	nodes = new Map ( );

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	clear ( ) {
		this.nodes.clear ( );
		this.platforms.clear ( );
		this.routeMasters.clear ( );
		this.routes.clear ( );
		this.ways.clear ( );
	}
}

/**
 * Coming soon
 * @type {Object}
 */

let theOsmData = new OsmData ( );

export default theOsmData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */