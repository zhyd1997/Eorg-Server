module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2020: true,
	},
	extends: ["eslint:recommended", "airbnb-base"],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		indent: ["error", "tabs"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
