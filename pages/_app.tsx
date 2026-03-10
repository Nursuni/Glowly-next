import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../scss/app.scss';
import '../scss/pc/main.scss';
import { useApollo } from '../apollo/client';

import { CurrencyProvider } from '../libs/context/CurrencyContext';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import ScrollToTop from '@/libs/components/common/ScrollToTop';
import { useRouter } from 'next/router';

const light = {
	palette: {
		mode: 'light' as const,
	},
};

const App = ({ Component, pageProps }: AppProps) => {
	const theme = createTheme(light);
	const client = useApollo(pageProps.initialApolloState);
	const router = useRouter();

	useEffect(() => {
		const handleStart = () => {
			sessionStorage.setItem('scrollPos', String(window.scrollY));
		};
		const handleComplete = () => {
			const pos = sessionStorage.getItem('scrollPos');
			if (pos) window.scrollTo(0, parseInt(pos));
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
		};
	}, [router]);
	return (
		<ApolloProvider client={client}>
			<CurrencyProvider>
				{' '}
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
					<ScrollToTop />
					<ToastContainer
						position="top-right"
						autoClose={2500}
						newestOnTop
						closeOnClick
						pauseOnHover
						draggable
						pauseOnFocusLoss
						limit={3}
						theme="colored"
					/>
				</ThemeProvider>
			</CurrencyProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
