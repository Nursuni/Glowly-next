import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../scss/app.scss';
import '../scss/pc/main.scss';
import { useApollo } from '../apollo/client';

import { CurrencyProvider } from '../libs/context/CurrencyContext';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<CurrencyProvider>
				{' '}
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
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
