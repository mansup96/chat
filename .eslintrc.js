module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
	},
	parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
		},
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
		"linebreak-style": ["error", "windows"],
		"semi": ["error", "never"],
		"react/state-in-constructor": ["off"],
		"react/destructuring-assignment": ["off"],
		"react/no-access-state-in-setstate": ["off"],
		"arrow-parens": ["off"],
		"jsx-a11y/click-events-have-key-events": ["off"],
		"jsx-a11y/no-static-element-interactions": ["off"],
		"jsx-a11y/label-has-associated-control": ["off"],
		"object-curly-newline": ["off"],
		"object-curly-spacing": ["off"],
		"react/jsx-one-expression-per-line": ["off"],
		"comma-dangle": ["off"]
  },
};
