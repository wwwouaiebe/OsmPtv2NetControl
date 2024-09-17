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
import TagsValidator from './TagsValidator.js';
import RolesValidator from './RolesValidator.js';
import ContinuousRouteValidator from './ContinuousRouteValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for osm public_transport routes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteValidator {

 	/**
	 * The route currently controlled
	 * @type {Object}
	 */

	#route = null;

	/**
	 * The platforms associated to the route (= members with 'platform' role)
	 * @type {Array}
	 */

	#platforms = [];

	/**
	 * the ways associated to the route (= members without role but having an highway tag
	 * for bus or a railway tag for tram and subway)
	 * @type {Array}
	 */

	#ways = [];

	/**
     * Mandatory tags for TECL and proposed:route
     * @type {Object}
     */

	#mandatoryTeclTags = {
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
	};

	/**
     * Mandatory tags for all routes
     * @type {Object}
     */

	#mandatoryTags = {
		from : '*',
		name : '*',
		network : '*',
		operator : '*',
		'public_transport:version' : '2',
		ref : '*',
		route : '*',
		to : '*',
		type : '*'
	};

	/**
     * the used tags
     * @type {Object}
     */

	#tags;

	/**
	* Validate the operator tag
	 */

	#validateOperator ( ) {
		if ( this.#route?.tags?.operator ) {
			let operators = this.#route?.tags?.operator.split ( ';' );
			const validOperators = [ 'TEC', 'De lijn', 'STIB/MIVB' ];
			let validOperatorFound = false;
			operators.forEach (
				operator => {
					if ( -1 !== validOperators.indexOf ( operator ) ) {
						validOperatorFound = true;
					}
				}
			);
			if ( ! validOperatorFound ) {
				theReport.addPError (
					'The operator is not valid for route',
					null,
					'R018'
				);

			}
		}
		else {

			// no operator tag
			theReport.addPError (
				'An operator tag is not found for route',
				null,
				'R002'
			);
		}
	}

	/**
	* Validate the from tag
	 */

	#validateFrom ( ) {

		if ( ! this.#route?.tags?.from ) {

			// no from tag
			theReport.addPError (
				'A from tag is not found for route',
				null,
				'R002'
			);
		}
		else if (
			this.#route?.tags?.from !== this.#platforms[ 0 ]?.tags?.name
			&&
			this.#route?.tags?.from !== ( this.#platforms [ 0 ]?.tags [ 'name:' + this.#route?.tags?.operator ] ?? '' )
		) {

			// from tag is not the same than the name of the first platform
			theReport.addPError (
				'The from tag is not equal to the name of the first platform for route ',
				null,
				'R003'
			);
		}
	}

	/**
	* Validate the to tag
	 */

	#validateTo ( )	{
		if ( ! this.#route?.tags?.to ) {

			// no to tag
			theReport.addPError (
				'A to tag is not found for route',
				null,
				'R004'
			);
		}
		else if (
			this.#route?.tags?.to !== this.#platforms.toReversed ( )[ 0 ]?.tags?.name
			&&
			(
				this.#route?.tags?.to
				!==
				( this.#platforms.toReversed ( ) [ 0 ]?.tags [ 'name:' + this.#route?.tags?.operator ] ?? '' )
			)
		) {

			// to tag is not the same than the name of the last platform
			theReport.addPError (
				'The to tag is not equal to the name of the last platform for route',
				null,
				'R005'
			);
		}
	}

	/**
	* Verify that the route have a from tag, a to tag, a name tag and a ref tag
	 */

	#haveTagsNameFromToRef ( ) {
		return this.#route?.tags?.from && this.#route?.tags?.to && this.#route?.tags?.name && this.#route?.tags?.ref;
	}

	/**
	* Verify that the name is compliant with the osm rules
	 */

	#validateName ( ) {
		let vehicle = theConfig.osmVehicle.substring ( 0, 1 ).toUpperCase ( ) +
			theConfig.osmVehicle.substring ( 1 ) + ' ';
		if ( this.#haveTagsNameFromToRef ( ) ) {
			let goodName = vehicle + this.#route?.tags?.ref + ': ' + this.#route?.tags?.from + ' → ' + this.#route?.tags?.to;
			if ( this.#route?.tags?.name !== goodName ) {
				theReport.addPError (
					'Invalid name ("' + this.#route?.tags?.name + '" but expected "' + goodName + '") for route ',
					null,
					'R006'
				);
			}
		}
		else {
			theReport.addPError (
				'Missing from, to, ref or name tags for route',
				null,
				'R007'
			);
		}
	}

	/**
	 * Search the fixme and add it to the report
	 */

	#searchFixme ( ) {
		if ( this.#route.tags?.fixme ) {
			theReport.addPError (
				'A fixme exists for this relation (' + this.#route.tags?.fixme + ')',
				null,
				'R021'
			);
		}
	}

	/**
	 * Validate a route
     * @param { Object } route The route to validate
	 */

	validateRoute ( route ) {
		this.#route = route;

		// title
		theReport.add (
			'h2',
			'\nNow validating route ' + ( this.#route.tags.name ?? '' ) + ' ',
			this.#route
		);

		// validation
		this.#platforms = [];
		this.#ways = [];

		this.#validateOperator ( );

		this.#tags =
            'TECL' === theConfig.osmNetwork && 'proposed:route' === theConfig.osmType
            	?
            	this.#mandatoryTeclTags
            	:
            	this.#mandatoryTags;

		new TagsValidator ( this.#route, this.#tags ).validate ( );
		new RolesValidator ( this.#route, this.#platforms, this.#ways ).validate ( );
		new ContinuousRouteValidator ( this.#route, this.#ways ).validate ( );

		this.#validateFrom ( );
		this.#validateTo ( );
		this.#validateName ( );
		this.#searchFixme ( );
	}

 	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default OsmRouteValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */