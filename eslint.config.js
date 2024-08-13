export default [
	{

		/*
		"env": {
			"browser": true,
			"es6": true
		},
		"extends": "eslint:recommended",
		"globals": {
			"Atomics": "readonly",
			"SharedArrayBuffer": "readonly"
		},
		"parserOptions": {
			"ecmaVersion": "latest",
			"sourceType": "module",
			"requireConfigFile": false
		},
		*/

		rules : {
			curly : [ 'warn' ],
			complexity : [ 'warn', 20 ],
			'default-case' : [ 'warn' ],
			'dot-location' : [ 'warn', 'property' ],
			eqeqeq : [ 'warn', 'always' ],
			'no-case-declarations' : [ 'warn' ],
			'no-else-return' : [ 'warn' ],
			'no-eval' : [ 'error' ],
			'no-console' : [ 'warn', { allow : [ 'error', 'clear', 'info' ] } ],
			'no-extend-native' : [ 'error' ],
			'no-extra-bind' : [ 'error' ],
			'no-implicit-coercion' : [ 'error' ],
			'no-implicit-globals' : [ 'error' ],
			'no-labels' : [ 'error' ],
			'no-lone-blocks' : [ 'error' ],
			'no-magic-numbers' : [ 'warn', { ignoreArrayIndexes : false, detectObjects : true, ignore : [ -1, 0, 1, 2, 3, 4, 5 ] } ],
			'no-multi-spaces' : [ 'warn' ],
			'no-param-reassign' : [ 'warn' ],
			'no-self-assign' : [ 'warn' ],
			'no-self-compare' : [ 'warn' ],
			'no-sequences' : [ 'warn' ],
			'no-throw-literal' : [ 'warn' ],
			'no-unmodified-loop-condition' : [ 'warn' ],
			'no-useless-return' : [ 'warn' ],
			'no-unused-vars' : [ 'warn' ],
			'prefer-promise-reject-errors' : [ 'warn' ],
			yoda : [ 'warn', 'always' ],

			'init-declarations' : [ 'warn', 'always' ],
			'no-shadow' : [ 'error', { builtinGlobals : true, hoist : 'all' } ],
			'no-undef-init' : [ 'warn' ],
			'no-use-before-define' : [ 'warn', { functions : true, classes : true } ],

			'array-bracket-newline' : [ 'warn', 'consistent' ],
			'array-bracket-spacing' : [ 'warn', 'always' ],
			'array-element-newline' : [ 'warn', 'consistent' ],
			'block-spacing' : [ 'warn', 'always' ],
			'brace-style' : [ 'warn', 'stroustrup', { allowSingleLine : true } ],
			camelcase : [ 'error', { properties : 'always' } ],
			'comma-dangle' : [ 'warn', 'never' ],
			'comma-spacing' : [ 'warn' ],
			'comma-style' : [ 'warn' ],
			'computed-property-spacing' : [ 'warn', 'always' ],
			'consistent-this' : [ 'warn' ],
			'eol-last' : [ 'warn', 'never' ],
			'func-call-spacing' : [ 'warn', 'always' ],
			'func-style' : [ 'warn', 'declaration' ],
			'function-call-argument-newline' : [ 'warn', 'consistent' ],
			'id-length' : [ 'warn', { min : 2 } ],
			'implicit-arrow-linebreak' : [ 'warn', 'beside' ],
			indent : [ 'warn', 'tab' ],
			'key-spacing' : [ 'warn', { beforeColon : true, afterColon : true, mode : 'strict' } ],
			'keyword-spacing' : [ 'warn' ],
			'lines-around-comment' : [ 'warn', { beforeBlockComment : true, afterBlockComment : true, beforeLineComment : true, afterLineComment : false } ],
			'max-lines' : [ 'warn', { max : 300, skipBlankLines : true, skipComments : true } ],
			'max-depth' : [ 'warn', { max : 4 } ],
			'max-len' : [ 'warn', { code : 128 } ],
			'max-nested-callbacks' : [ 'warn', { max : 3 } ],
			'max-params' : [ 'warn', { max : 3 } ],
			'max-statements' : [ 'warn', 40 ],
			'max-statements-per-line' : [ 'warn' ],
			'newline-per-chained-call' : [ 'warn' ],
			'no-array-constructor' : [ 'warn' ],
			'no-bitwise' : [ 'warn' ],
			'no-continue' : [ 'warn' ],
			'no-lonely-if' : [ 'warn' ],
			'no-mixed-operators' : [ 'warn' ],
			'no-multi-assign' : [ 'warn' ],
			'no-multiple-empty-lines' : [ 'warn', { max : 1 } ],
			'no-negated-condition' : [ 'warn' ],
			'no-new-object' : [ 'warn' ],
			'no-trailing-spaces' : [ 'warn' ],
			'no-underscore-dangle' : [ 'warn' ],
			'no-unneeded-ternary' : [ 'warn' ],
			'object-curly-newline' : [ 'warn', { consistent : true } ],
			'object-curly-spacing' : [ 'warn', 'always', { arraysInObjects : true, objectsInObjects : true } ],
			'object-property-newline' : [ 'warn', { allowAllPropertiesOnSameLine : true } ],
			'one-var-declaration-per-line' : [ 'warn' ],
			'operator-assignment' : [ 'warn', 'always' ],
			'quote-props' : [ 'warn', 'as-needed' ],
			quotes : [ 'warn', 'single' ],
			semi : [ 'error', 'always' ],
			'semi-spacing' : [ 'warn', { before : false, after : true } ],
			'semi-style' : [ 'error', 'last' ],
			'space-before-blocks' : [ 'warn', 'always' ],
			'space-before-function-paren' : [ 'warn', 'always' ],
			'space-in-parens' : [ 'warn', 'always' ],
			'space-infix-ops' : [ 'warn' ],
			'space-unary-ops' : [ 'warn', { words : true, nonwords : true, overrides : { '-' : false } } ],
			'spaced-comment' : [ 'warn', 'always' ],
			'switch-colon-spacing' : [ 'warn', { after : true, before : true } ],
			'wrap-regex' : [ 'warn' ],

			'arrow-body-style' : [ 'warn', 'as-needed' ],
			'arrow-parens' : [ 'warn', 'as-needed' ],
			'arrow-spacing' : [ 'warn', { before : true, after : true } ],
			'no-duplicate-imports' : [ 'warn' ],
			'no-var' : [ 'error' ]
		}
	}
];