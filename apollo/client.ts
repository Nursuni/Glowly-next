// libs/apollo/client.ts
import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { getJwtToken } from '../libs/auth';
import { socketVar } from './store';
import { onError } from '@apollo/client/link/error';
import { toastError } from '@/libs/toast';

let apolloClient: ApolloClient<NormalizedCacheObject>;

/** Get headers with JWT token */
function getHeaders() {
	const headers: HeadersInit = {};
	const token = getJwtToken();
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

/** Custom WebSocket wrapper */
class LoggingWebSocket {
	private socket: WebSocket;
	constructor(url: string) {
		this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
		socketVar(this.socket);

		this.socket.onopen = () => console.log('WebSocket connected');
		this.socket.onmessage = (msg) => console.log('WS message:', msg.data);
		this.socket.onerror = (err) => console.log('WS error:', err);
	}
	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}
	close() {
		this.socket.close();
	}
}

/** Create Apollo link (HTTP + WS + auth + error) */
function createIsomorphicLink() {
	if (typeof window === 'undefined')
		return createUploadLink({ uri: process.env.REACT_APP_API_GRAPHQL_URL }) as unknown as ApolloLink;

	// Auth link
	const authLink = new ApolloLink((operation, forward) => {
		operation.setContext(({ headers = {} }) => ({
			headers: { ...headers, ...getHeaders() },
		}));
		return forward(operation);
	});

	// Upload HTTP link
	const httpLink = createUploadLink({
		uri: process.env.REACT_APP_API_GRAPHQL_URL,
	});

	// WebSocket link
	const wsLink = new WebSocketLink({
		uri: process.env.REACT_APP_API_WS ?? 'ws://127.0.0.1:3007/graphql',
		options: {
			reconnect: true,
			connectionParams: () => ({ headers: getHeaders() }),
		},
		webSocketImpl: LoggingWebSocket,
	});

	// Split for subscriptions vs queries/mutations
	const splitLink = split(
		({ query }) => {
			const def = getMainDefinition(query);
			return def.kind === 'OperationDefinition' && def.operation === 'subscription';
		},
		wsLink,
		authLink.concat(httpLink),
	);

	// Error handling
	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors && graphQLErrors.length > 0) {
			graphQLErrors.forEach((err) => {
				const msg = err.message || 'An unknown GraphQL error occurred';
				toastError(msg);
				console.log(`[GraphQL error]: Message: ${msg}`, err);
			});
		}

		if (networkError) {
			const msg = 'message' in networkError ? networkError.message : 'A network error occurred';
			toastError(msg);
			console.log(`[Network error]:`, networkError);
		}
	});

	return from([errorLink, splitLink]);
}

/** Create Apollo client */
function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
	});
}

/** Initialize Apollo client */
export function initializeApollo(initialState: any = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window !== 'undefined' && !apolloClient) apolloClient = _apolloClient;
	return _apolloClient;
}

/** Hook for React components */
export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
