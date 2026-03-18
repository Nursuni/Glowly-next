import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';

import { LOGIN, SIGN_UP } from '../../apollo/user/mutation';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (nick: string, password: string): Promise<void> => {
	try {
		const { jwtToken } = await requestJwtToken({ nick, password });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err: any) {
		console.warn('login err', err);
		// ✅ Re-throw so the component's catch block can show the error
		throw err;
	}
};

const requestJwtToken = async ({
	nick,
	password,
}: {
	nick: string;
	password: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberNick: nick, memberPassword: password } },
			fetchPolicy: 'network-only',
		});

		console.log('---------- login ----------');
		const { accessToken } = result?.data?.login;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);

		// ✅ Extract the backend message
		const backendMessage: string = err?.graphQLErrors?.[0]?.message ?? '';

		// ✅ Map all known backend messages to user-friendly strings
		if (backendMessage.includes('login and password do not match')) {
			throw new Error('Incorrect password. Please try again.');
		} else if (backendMessage.includes('user has been blocked')) {
			throw new Error('This account has been blocked.');
		} else if (
			backendMessage.includes('not found') ||
			backendMessage.includes('does not exist') ||
			backendMessage.includes('No member')
		) {
			throw new Error('No account found with that nickname.');
		} else if (backendMessage) {
			// Pass through any other backend message directly
			throw new Error(backendMessage);
		} else {
			throw new Error('Login failed. Please try again.');
		}
	}
};

export const signUp = async (
	nick: string,
	password: string,
	phone: string,
	type: string,
	gender: string,
): Promise<void> => {
	try {
		const { jwtToken } = await requestSignUpJwtToken({ nick, password, phone, type });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err: any) {
		console.warn('signup err', err);
		// ✅ Re-throw so the component's catch block can show the error
		throw err;
	}
};

const requestSignUpJwtToken = async ({
	nick,
	password,
	phone,
	type,
}: {
	nick: string;
	password: string;
	phone: string;
	type: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: { memberNick: nick, memberPassword: password, memberPhone: phone, memberType: type },
			},
			fetchPolicy: 'network-only',
		});

		console.log('---------- signup ----------');
		const { accessToken } = result?.data?.signup;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);

		const backendMessage: string = err?.graphQLErrors?.[0]?.message ?? '';

		if (backendMessage.includes('already exists') || backendMessage.includes('duplicate')) {
			throw new Error('This nickname is already taken.');
		} else if (backendMessage.includes('phone')) {
			throw new Error('Invalid phone number.');
		} else if (backendMessage) {
			throw new Error(backendMessage);
		} else {
			throw new Error('Sign up failed. Please try again.');
		}
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (jwtToken: any) => {
	if (!jwtToken) return false;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	userVar({
		_id: claims._id ?? '',
		memberType: claims.memberType ?? '',
		memberStatus: claims.memberStatus ?? '',
		memberAuthType: claims.memberAuthType,
		memberPhone: claims.memberPhone ?? '',
		memberNick: claims.memberNick ?? '',
		memberFullName: claims.memberFullName ?? '',
		memberImage:
			claims.memberImage === null || claims.memberImage === undefined
				? '/img/profile/user.svg'
				: `${claims.memberImage}`,
		memberAddress: claims.memberAddress ?? '',
		memberGender: claims.memberGender ?? '',
		memberDesc: claims.memberDesc ?? '',
		memberProducts: claims.memberProducts,
		memberRank: claims.memberRank,
		memberArticles: claims.memberArticles,
		memberPoints: claims.memberPoints,
		memberLikes: claims.memberLikes,
		memberViews: claims.memberViews,
		memberWarnings: claims.memberWarnings,
		memberBlocks: claims.memberBlocks,
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberGender: '',
		memberProducts: 0,
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});
};
