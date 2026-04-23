/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

module.exports = {
	reactStrictMode: true,

	experimental: {
		optimizePackageImports: ['@mui/material', '@mui/icons-material', '@mui/lab'],
	},

	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},

	i18n,

	compiler: {
		styledComponents: true,
	},

	sassOptions: {
		includePaths: [path.join(__dirname)],
		silenceDeprecations: ['legacy-js-api', 'import', 'color-functions', 'global-builtin'],
	},

	webpack(config) {
		config.resolve.alias['~'] = path.resolve(__dirname);
		return config;
	},
};
