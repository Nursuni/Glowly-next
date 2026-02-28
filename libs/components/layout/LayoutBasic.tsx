import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';

import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
				case '/shop':
					title = 'Shop';
					desc = 'Discover Your Beauty Essentials';
					bgImage = '/img/banner/shop.jpg';
					break;

				case '/product':
					title = 'Products';
					desc = 'Skincare & Cosmetics Collection';
					bgImage = '/img/banner/products.png';
					break;

				case '/about':
					title = 'Our Story';
					desc = 'Clean Beauty Philosophy';
					bgImage = '/img/banner/about.jpg';
					break;

				case '/community':
					title = 'Beauty Community';
					desc = 'Tips, Trends & Skincare Knowledge';
					bgImage = '/img/banner/journal.jpg';
					break;

				case '/contact':
					title = 'Contact Us';
					desc = 'We Love Hearing From You';
					bgImage = '/img/banner/contact.jpg';
					break;

				case '/account/login':
					title = 'Login / Signup';
					desc = 'Access Your Beauty Profile';
					bgImage = '/img/banner/auth.jpg';
					setAuthHeader(true);
					break;

				case '/mypage':
					title = 'My Beauty';
					desc = 'Your Orders & Favorites';
					bgImage = '/img/banner/profile.jpg';
					break;

				default:
					title = 'Beauty Redefined';
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
						<Stack id={'top'}></Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}></Stack>
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
						<Stack id={'top'}></Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
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

						<Chat />

						<Stack id={'footer'}></Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
