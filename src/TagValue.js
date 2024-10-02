class TagValue {

	#name;

	#isMandatory;

	#values;

	get name ( ) { return this.#name; }

	get isMandatory ( ) { return this.#isMandatory; }

	get values ( ) { return this.#values; }

	constructor ( name, isMandatory, values ) {
		this.#name = name;
		this.#isMandatory = isMandatory;
		this.#values = values;
		Object.freeze ( this );
		Object.freeze ( this.#values );
	}
}

export default TagValue;