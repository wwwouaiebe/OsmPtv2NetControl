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

class TagsBuilder {

	/**
	 * Customized tags for TECL and proposed:route
	 * value = '*' : tag is mandatory and value is not controlled
	 * value = '?' tag is not mandatory and value is not controlled
	 * value = 'string' tag is mandatory and value must be 'string'
	 * @type {Array}
	 */

	#customTags = [
		{
			network : 'TECL',
			type : 'proposed:route',
			routeTags : {
				from : '*',
				name : '*',
				network : 'TECL',
				'network:wikidata' : 'Q3512078',
				'network:wikipedia' : 'fr:TEC Liège-Verviers',
				operator : 'TEC',
				'operator:wikidata' : 'Q366922',
				'operator:wikipedia' : 'fr:Opérateur de transport de Wallonie',
				'public_transport:version' : '2',
				ref : '*',
				'proposed:route' : '*',
				to : '*',
				type : '*',
				note : 'This relation is a part of the new bus network starting january 2025',
				// eslint-disable-next-line camelcase
				opening_date : '2025-01',
				via : '?'
			},
			routeMasterTags : {
				description : '*',
				name : '*',
				network : 'TECL',
				'network:wikidata' : 'Q3512078',
				'network:wikipedia' : 'fr:TEC Liège-Verviers',
				operator : 'TEC',
				'operator:wikidata' : 'Q366922',
				'operator:wikipedia' : 'fr:Opérateur de transport de Wallonie',
				ref : '*',
				'ref:TEC' : '*',
				'proposed:route_master' : 'bus',
				type : 'proposed:route_master',
				note : 'This relation is a part of the new bus network starting january 2025',
				// eslint-disable-next-line camelcase
				opening_date : '2025-01'
			}
		}
	];

	/**
	 * The default tags
	 * @type {Object}
	 */

	#defaultTags = {
		routeTags : {
			from : '*',
			name : '*',
			network : '*',
			operator : '*',
			'public_transport:version' : '2',
			ref : '*',
			route : '*',
			to : '*',
			type : '*'
		},
		routeMasterTags : {
			name : '*',
			network : '*',
			operator : '*',
			ref : '*',
			// eslint-disable-next-line camelcase
			route_master : '*',
			type : 'route_master'
		}
	};

	/**
	 * Get the route tags to verify
	 * @returns {Object} the route tags to verify
	 */

	getRouteTags ( ) {
		let customTags =
			this.#customTags.find ( element => element.network === theConfig.osmNetwork && element.type === theConfig.osmType );

		return customTags?.routeTags || this.#defaultTags.routeTags;
	}

	/**
	 * Get the route_master tags to verify
	 * @returns {Object}  the route_master tags to verify
	 */

	getRouteMasterTags ( ) {
		let customTags =
			this.#customTags.find ( element => element.network === theConfig.osmNetwork && element.type === theConfig.osmType );

		return customTags?.routeMasterTags || this.#defaultTags.routeMasterTags;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default TagsBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */