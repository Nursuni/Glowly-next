import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';

import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';

import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Top from '../Top';
import Footer from '../Footer';
import Chat from '../Chat';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '';
			let desc = '';
			let bgImage = '';

			switch (router.pathname) {
				case '/catalog':
					title = 'Home/Catalog';
					desc = 'Skincare & Cosmetics Collection';
					bgImage = '/img/banner/banner_products.jpg';
					break;

				case '/blog':
					title = 'Home/Blog';
					desc = 'Tips, Trends & Skincare Knowledge';
					bgImage = '/img/banner/journal.jpg';
					break;

				case '/about':
					title = 'Home/Our Story';
					desc = 'Clean Beauty Philosophy';
					bgImage = '/img/banner/aboutus.webp';
					break;

				case '/account/login':
					title = 'Login / Signup';
					desc = 'Access Your Beauty Profile';
					bgImage = '/img/banner/auth.jpg';
					setAuthHeader(true);
					break;

				case '/mypage':
					title = 'Home/My Beauty';
					desc = 'Your Orders & Favorites';
					bgImage = '/img/banner/profile.jpg';
					break;

				default:
					title = 'Home/Beauty Redefined';
					desc = 'Glow Naturally';
					bgImage = '/img/banner/main.jpg';
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Glowly</title>
						<meta name={'title'} content={`Glowly`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							{' '}
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							{' '}
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Glowly</title>
						<meta name={'title'} content={`Glowly`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							{' '}
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader ? 'auth' : ''}`}
							sx={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								boxShadow: 'inset 0 0 150px rgba(24,22,36,0.4)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>
						{user?._id && <Chat />}
						<Stack id={'footer'}>
							{' '}
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
