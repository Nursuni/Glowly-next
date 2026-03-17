import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { NEXT_PUBLIC_API_URL } from '../../config';
import { logOut } from '../../auth';
import { toastInfo } from '../../toast';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const NAV_ITEMS = [
	{
		key: 'myFavorites',
		label: 'My Favorites',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill={active ? '#fff' : 'none'}
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
			</svg>
		),
	},
	{
		key: 'recentlyVisited',
		label: 'Recently Viewed',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.35-4.35" />
			</svg>
		),
	},
	{
		key: 'myOrder',
		label: 'My Purchases',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
				<line x1="3" y1="6" x2="21" y2="6" />
				<path d="M16 10a4 4 0 0 1-8 0" />
			</svg>
		),
	},
	{
		key: 'followers',
		label: 'Followers',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
		),
	},
	{
		key: 'followings',
		label: 'Following',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<line x1="19" y1="8" x2="19" y2="14" />
				<line x1="22" y1="11" x2="16" y2="11" />
			</svg>
		),
	},
	{
		key: 'writeArticle',
		label: 'Write Article',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M12 20h9" />
				<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
			</svg>
		),
	},
	{
		key: 'myArticles',
		label: 'My Articles',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="16" y1="13" x2="8" y2="13" />
				<line x1="16" y1="17" x2="8" y2="17" />
			</svg>
		),
	},
];

const BRAND_ITEMS = [
	{
		key: 'addProduct',
		label: 'Add New Product',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="16" />
				<line x1="8" y1="12" x2="16" y2="12" />
			</svg>
		),
	},
	{
		key: 'myProducts',
		label: 'My Products',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
			</svg>
		),
	},
];

const SETTINGS_ITEMS = [
	{
		key: 'myProfile',
		label: 'Profile Settings',
		icon: (active: boolean) => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke={active ? '#fff' : '#c9a8b8'}
				strokeWidth="1.8"
			>
				<circle cx="12" cy="8" r="4" />
				<path d="M20 21a8 8 0 1 0-16 0" />
			</svg>
		),
	},
];

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: string = (router.query?.category as string) ?? 'myProfile';
	const user = useReactiveVar(userVar);

	const logoutHandler = async () => {
		try {
			if (await toastInfo('Do you want to sign out?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') return <div>MY MENU</div>;

	const avatarSrc = user?.memberImage ? `${NEXT_PUBLIC_API_URL}/${user.memberImage}` : '/img/profile/user.svg';
	const isBrand = user?.memberType === 'BRAND';
	const isAdmin = user?.memberType === 'ADMIN';

	return (
		<div className="mymenu-wrap">
			{/* ── Banner + Avatar ─────────────────────── */}
			<div className="mymenu-banner">
				<div className="mymenu-banner-dots" />
				<div className="mymenu-avatar-ring">
					<img src={avatarSrc} alt={user?.memberNick ?? 'user'} />
				</div>
			</div>

			{/* ── Profile info ────────────────────────── */}
			<div className="mymenu-info">
				<p className="mymenu-name">{user?.memberNick ?? 'Guest'}</p>
				<div className="mymenu-phone">
					<img src="/img/icons/call.svg" alt="" />
					{user?.memberPhone}
				</div>
				{isAdmin ? (
					<a href="/_admin/users" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
						<span className="mymenu-badge admin">{user?.memberType}</span>
					</a>
				) : (
					<span className={`mymenu-badge ${isBrand ? 'brand' : 'user'}`}>{user?.memberType ?? 'USER'}</span>
				)}
			</div>

			{/* ── Navigation ──────────────────────────── */}
			<nav className="mymenu-nav">
				{/* Brand Tools — only for BRAND members */}
				{isBrand && (
					<div>
						<p className="mymenu-section-label">Brand Tools</p>
						{BRAND_ITEMS.map((item) => {
							const active = category === item.key;
							return (
								<Link
									key={item.key}
									href={{ pathname: '/mypage', query: { category: item.key } }}
									scroll={false}
									className={`mymenu-item${active ? ' active' : ''}`}
								>
									<span className="mymenu-item-icon">{item.icon(active)}</span>
									<span className="mymenu-item-label">{item.label}</span>
									<svg
										className="mymenu-item-arrow"
										viewBox="0 0 24 24"
										fill="none"
										stroke={active ? '#fff' : '#c9a8b8'}
										strokeWidth="2"
									>
										<path d="M9 18l6-6-6-6" />
									</svg>
								</Link>
							);
						})}
					</div>
				)}

				{/* Activity */}
				<div>
					<p className="mymenu-section-label">Activity</p>
					{NAV_ITEMS.map((item) => {
						const active = category === item.key;
						return (
							<Link
								key={item.key}
								href={{ pathname: '/mypage', query: { category: item.key } }}
								scroll={false}
								className={`mymenu-item${active ? ' active' : ''}`}
							>
								<span className="mymenu-item-icon">{item.icon(active)}</span>
								<span className="mymenu-item-label">{item.label}</span>
								<svg
									className="mymenu-item-arrow"
									viewBox="0 0 24 24"
									fill="none"
									stroke={active ? '#fff' : '#c9a8b8'}
									strokeWidth="2"
								>
									<path d="M9 18l6-6-6-6" />
								</svg>
							</Link>
						);
					})}
				</div>

				{/* Settings */}
				<div>
					<p className="mymenu-section-label">Settings</p>
					{SETTINGS_ITEMS.map((item) => {
						const active = category === item.key;
						return (
							<Link
								key={item.key}
								href={{ pathname: '/mypage', query: { category: item.key } }}
								scroll={false}
								className={`mymenu-item${active ? ' active' : ''}`}
							>
								<span className="mymenu-item-icon">{item.icon(active)}</span>
								<span className="mymenu-item-label">{item.label}</span>
								<svg
									className="mymenu-item-arrow"
									viewBox="0 0 24 24"
									fill="none"
									stroke={active ? '#fff' : '#c9a8b8'}
									strokeWidth="2"
								>
									<path d="M9 18l6-6-6-6" />
								</svg>
							</Link>
						);
					})}
				</div>
			</nav>

			<div className="mymenu-divider" />

			{/* ── Logout ──────────────────────────────── */}
			<div className="mymenu-logout" onClick={logoutHandler}>
				<span className="mymenu-logout-icon">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eb6753" strokeWidth="1.8">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</span>
				<span className="mymenu-logout-label">Sign Out</span>
			</div>
		</div>
	);
};

export default MyMenu;
