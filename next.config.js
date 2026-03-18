/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
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

	// 🔥 Reduce build overhead
	compiler: {
		styledComponents: true,
	},
};

module.exports = nextConfig;
