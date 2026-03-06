import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 4,
		marginTop: theme.spacing(1),
		minWidth: 160,
		border: '1px solid #f0ebe4',
		boxShadow: '0 8px 32px rgba(42,42,42,0.10)',
		'& .MuiMenu-list': { padding: '4px 0' },
		'& .MuiMenuItem-root': {
			fontFamily: "'Jost', sans-serif",
			fontSize: 13,
			letterSpacing: '0.05em',
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();

	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);

	const [colorChange, setColorChange] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);

	const lastScrollY = useRef(0);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/catalog/detail':
				setBgColor(true);
				break;
			default:
				setBgColor(false);
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
			setScrolled(true);
		} else {
			setColorChange(false);
			setScrolled(false);
		}
		lastScrollY.current = window.scrollY;
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', changeNavbarColor);
		}
		return () => window.removeEventListener('scroll', changeNavbarColor);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => setAnchorEl2(e.currentTarget);
	const langClose = () => setAnchorEl2(null);

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	/* helper: is this route active? */
	const isActive = (path: string) => router.pathname === path || router.asPath.startsWith(path);

	/* handlers */
	const goToSearch = useCallback(() => {
		router.push('/search');
	}, [router]);

	const goToBasket = useCallback(() => {
		router.push('/basket');
	}, [router]);

	/* ─── MOBILE ─── */
	if (device === 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/catalog'}>
					<div>{t('Catalog')}</div>
				</Link>
				<Link href={'/brand'}>
					<div>{t('Brands')}</div>
				</Link>
				<Link href={'/blog?articleCategory=FREE'}>
					<div>{t('Blog')}</div>
				</Link>
				<Link href={'/support'}>
					<div>{t('Support')}</div>
				</Link>
				<Link href={'/about'}>
					<div>{t('About us')}</div>
				</Link>
			</Stack>
		);
	}

	/* ─── DESKTOP ─── */
	return (
		<>
			{/* Announcement bar */}
			<div className="announcement-bar">FREE SHIPPING ON ORDERS OVER $50</div>

			<div className="navbar">
				<div
					className={`navbar-main 
          ${bgColor ? 'transparent' : ''} 
          ${scrolled ? 'scrolled' : ''}`}
				>
					<div className="container">
						{/* LOGO */}
						<div className="logo-box">
							<Link href="/">
								<img src="/logo.svg" alt="logo" />
							</Link>
						</div>

						{/* ROUTER */}
						<div className="router-box">
							<Link href="/" className={isActive('/') ? 'active' : ''}>
								{t('Home')}
							</Link>

							<Link href="/catalog" className={isActive('/catalog') ? 'active' : ''}>
								{t('Catalog')}
							</Link>

							<Link href="/brand" className={isActive('/brand') ? 'active' : ''}>
								{t('Brands')}
							</Link>

							<Link href="/blog?articleCategory=FREE" className={isActive('/blog') ? 'active' : ''}>
								{t('Blog')}
							</Link>

							<Link href="/support" className={isActive('/support') ? 'active' : ''}>
								{t('Support')}
							</Link>

							<Link href="/about" className={isActive('/about') ? 'active' : ''}>
								{t('About us')}
							</Link>
						</div>

						{/* USER BOX */}
						<div className="user-box">
							<Box className="nav-icon" onClick={goToSearch}>
								<img src="/img/icons/search.svg" alt="search" />
							</Box>

							<Box className="nav-icon basket-icon" onClick={goToBasket}>
								<img src="/img/icons/basket.svg" alt="basket" />

								{/* basket count */}
								<span className="cart-count">2</span>
							</Box>
							{/* Notifications */}
							<button className="notification-btn">
								<NotificationsOutlinedIcon />
								<span className="unread-dot"></span>
							</button>

							<div className="divider"></div>

							{/* Language Button */}
							<Button
								disableRipple
								onClick={langClick}
								sx={{
									minWidth: 0,
									padding: '5px 9px',
									borderRadius: '10px',
									backgroundColor: 'transparent',
									border: '1px solid transparent',
									display: 'flex',
									alignItems: 'center',
									gap: '5px',
									transition: 'all 0.18s ease',
									'&:hover': {
										backgroundColor: 'rgba(0,0,0,0.05)',
										borderColor: 'rgba(0,0,0,0.08)',
									},
								}}
							>
								<Box
									sx={{
										width: 21,
										height: 21,
										borderRadius: '50%',
										overflow: 'hidden',
										flexShrink: 0,
										boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
									}}
								>
									<img
										src={lang ? `/img/flag/lang${lang}.png` : '/img/flag/langen.png'}
										alt="lang"
										style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
									/>
								</Box>
								<CaretDown
									size={10}
									weight="fill"
									style={{
										color: '#999',
										transition: 'transform 0.2s ease',
										transform: drop ? 'rotate(180deg)' : 'rotate(0deg)',
									}}
								/>
							</Button>

							<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
								<MenuItem id="en" onClick={langChoice}>
									<img src="/img/flag/langen.png" width="18" style={{ marginRight: 8 }} />
									English
								</MenuItem>

								<MenuItem id="kr" onClick={langChoice}>
									<img src="/img/flag/langkr.png" width="18" style={{ marginRight: 8 }} />
									한국어
								</MenuItem>

								<MenuItem id="ru" onClick={langChoice}>
									<img src="/img/flag/langru.png" width="18" style={{ marginRight: 8 }} />
									Русский
								</MenuItem>

								<MenuItem id="uz" onClick={langChoice}>
									<img src="/img/flag/languz.png" width="18" style={{ marginRight: 8 }} />
									O‘zbek
								</MenuItem>
							</StyledMenu>

							<div className="divider"></div>

							{/* USER */}
							{user ? (
								<>
									<div className="login-user" onClick={(e) => setLogoutAnchor(e.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'
											}
										/>
									</div>

									<StyledMenu anchorEl={logoutAnchor} open={logoutOpen} onClose={() => setLogoutAnchor(null)}>
										<MenuItem onClick={() => router.push('/mypage')}>
											<AccountCircleOutlinedIcon />
											My Page
										</MenuItem>

										<MenuItem
											onClick={() => {
												logOut();
												router.push('/');
											}}
										>
											<Logout />
											Logout
										</MenuItem>
									</StyledMenu>
								</>
							) : (
								<Link href="/login" className="join-box">
									<AccountCircleOutlinedIcon />
									<span>{t('Login')}</span>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withRouter(Top);
