import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Logout } from '@mui/icons-material';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../config';
import Image from 'next/image';

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
			letterSpacing: '0.03em',
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
	const { t } = useTranslation('common');
	const router = useRouter();

	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string>(router.locale || 'en');
	const drop = Boolean(anchorEl2);

	const [scrolled, setScrolled] = useState(false);
	const [bgColor, setBgColor] = useState(false);
	const [navReady, setNavReady] = useState(false);

	const [userDropOpen, setUserDropOpen] = useState(false);
	const userDropRef = useRef<HTMLDivElement>(null);

	const catalogTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const avatar = user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/user.svg';
	useEffect(() => {
		setNavReady(false);
		const id = setTimeout(() => setNavReady(true), 30);
		return () => clearTimeout(id);
	}, [router.pathname]);

	useEffect(() => {
		setLang(router.locale || 'en');
	}, [router.locale]);

	useEffect(() => {
		setBgColor(router.pathname === '/catalog/detail');
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (userDropRef.current && !userDropRef.current.contains(e.target as Node)) {
				setUserDropOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	const langClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl2(e.currentTarget);
	const langClose = () => setAnchorEl2(null);
	const langChoice = useCallback(
		async (e: React.MouseEvent<HTMLLIElement>) => {
			const id = (e.currentTarget as HTMLElement).id;
			setLang(id);
			localStorage.setItem('locale', id);
			setAnchorEl2(null);
			router.push(router.asPath, undefined, { locale: id });
		},
		[router],
	);

	const isActive = (path: string) => {
		if (path === '/') return router.pathname === '/';
		return router.pathname.startsWith(path);
	};

	const goToBasket = useCallback(() => router.push('/basket'), [router]);

	/* ─── MOBILE ─── */
	if (device === 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('home')}</div>
				</Link>
				<Link href={'/catalog'}>
					<div>{t('catalog')}</div>
				</Link>
				<Link href={'/brand'}>
					<div>{t('brands')}</div>
				</Link>
				<Link href={'/blog?articleCategory=FREE'}>
					<div>{t('blog')}</div>
				</Link>
				<Link href={'/support'}>
					<div>{t('support')}</div>
				</Link>
				<Link href={'/about'}>
					<div>{t('about')}</div>
				</Link>
			</Stack>
		);
	}

	/* ─── DESKTOP ─── */
	return (
		<>
			<div className={`announcement-bar${navReady ? ' nb-ready' : ''}`}>Free shipping on orders over $50</div>

			<div className={`navbar${navReady ? ' nb-ready' : ''}`}>
				<div className={`navbar-main${bgColor ? ' transparent' : ''}${scrolled ? ' scrolled' : ''}`}>
					<div className="container">
						{/* LOGO */}
						<div className="logo-box nb-item">
							<Link href="/">
								<Image src="/img/logo/glowly.svg" alt="Glowly" width={120} height={40} />
							</Link>
						</div>

						{/* NAV LINKS */}
						<div className="router-box">
							<Link href="/" className={isActive('/') ? 'active' : ''}>
								{t('home')}
							</Link>

							{/* Catalog + mega-menu */}
							<div>
								<Link href="/catalog" className={isActive('/catalog') ? 'active' : ''}>
									{t('catalog')}
								</Link>
							</div>

							<Link href="/brand" className={isActive('/brand') ? 'active' : ''}>
								{t('brands')}
							</Link>
							<Link href="/blog?articleCategory=FREE" className={isActive('/blog') ? 'active' : ''}>
								{t('blog')}
							</Link>
							<Link href="/support" className={isActive('/support') ? 'active' : ''}>
								{t('support')}
							</Link>
							<Link href="/about" className={isActive('/about') ? 'active' : ''}>
								{t('about')}
							</Link>
						</div>

						{/* Basket */}
						<div className="navbar-right-icons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
							{/* Basket */}
							<button className="icon-btn basket-btn" onClick={goToBasket} aria-label="Basket">
								<ShoppingBagOutlinedIcon />
								<span className="cart-count">2</span>
							</button>

							{/* Notifications */}
							<button className="icon-btn notification-btn" aria-label="Notifications">
								<NotificationsOutlinedIcon />
								<span className="unread-dot" />
							</button>

							{/* Chat */}
							<button className="icon-btn" aria-label="Chat">
								<ChatBubbleOutlineOutlinedIcon />
							</button>

							{/* User dropdown */}
							<div className="user-drop-wrap" ref={userDropRef}>
								<button
									className={`icon-btn user-btn${userDropOpen ? ' active' : ''}`}
									onClick={() => setUserDropOpen((v) => !v)}
									aria-label="Account"
								>
									<img src={avatar} className="user-avatar" alt="avatar" />
								</button>

								{userDropOpen && (
									<div className="user-dropdown">
										{user ? (
											<>
												<div className="ud-header">
													<img
														src={
															user.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/user.svg'
														}
														className="ud-avatar"
														alt="avatar"
													/>
													<div>
														<strong>{user.memberNick || 'My Account'}</strong>
													</div>
												</div>
												<div className="ud-divider" />
												<Link href="/mypage" className="ud-item" onClick={() => setUserDropOpen(false)}>
													<PersonOutlineOutlinedIcon /> My Page
												</Link>
												<Link href="/mypage?tab=wishlist" className="ud-item" onClick={() => setUserDropOpen(false)}>
													<FavoriteBorderOutlinedIcon /> Wishlist
												</Link>
												<Link href="/mypage?tab=orders" className="ud-item" onClick={() => setUserDropOpen(false)}>
													<LocalShippingOutlinedIcon /> Track Orders
												</Link>
												<div className="ud-divider" />
												<button
													className="ud-item ud-logout"
													onClick={() => {
														logOut();
														router.push('/');
														setUserDropOpen(false);
													}}
												>
													<Logout /> Logout
												</button>
											</>
										) : (
											<>
												<div className="ud-header ud-header--guest">
													<PersonOutlineOutlinedIcon className="ud-guest-icon" />
													<div>
														<strong>Welcome</strong>
														<span>Sign in for the best experience</span>
													</div>
												</div>
												<div className="ud-divider" />
												<Link href="/login" className="ud-item ud-item--primary" onClick={() => setUserDropOpen(false)}>
													Login
												</Link>
												<Link href="/join" className="ud-item" onClick={() => setUserDropOpen(false)}>
													<AccountCircleOutlinedIcon /> Sign Up
												</Link>
												<div className="ud-divider" />
												<Link
													href="/login?redirect=wishlist"
													className="ud-item"
													onClick={() => setUserDropOpen(false)}
												>
													<FavoriteBorderOutlinedIcon /> Wishlist
												</Link>
												<Link href="/login?redirect=orders" className="ud-item" onClick={() => setUserDropOpen(false)}>
													<LocalShippingOutlinedIcon /> Track Orders
												</Link>
											</>
										)}
									</div>
								)}
							</div>

							{/* Language */}
							<Button
								disableRipple
								onClick={langClick}
								sx={{
									minWidth: 0,
									padding: '5px 9px',
									borderRadius: '8px',
									backgroundColor: 'transparent',
									border: '1px solid transparent',
									display: 'flex',
									alignItems: 'center',
									gap: '5px',
									transition: 'all 0.18s ease',
									'&:hover': { backgroundColor: 'rgba(0,0,0,0.04)', borderColor: 'rgba(0,0,0,0.07)' },
								}}
							>
								<Box
									sx={{
										width: 20,
										height: 20,
										borderRadius: '50%',
										overflow: 'hidden',
										flexShrink: 0,
										boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
									}}
								>
									<img
										src={lang ? `/img/flag/lang${lang}.png` : '/img/flag/langen.png'}
										alt="lang"
										style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
									/>
								</Box>
								<CaretDown
									size={9}
									weight="fill"
									style={{
										color: '#aaa',
										transition: 'transform 0.2s ease',
										transform: drop ? 'rotate(180deg)' : 'rotate(0deg)',
									}}
								/>
							</Button>

							<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
								<MenuItem id="en" onClick={langChoice}>
									<img src="/img/flag/langen.png" width="16" style={{ marginRight: 8 }} />
									English
								</MenuItem>
								<MenuItem id="kr" onClick={langChoice}>
									<img src="/img/flag/langkr.png" width="16" style={{ marginRight: 8 }} />
									한국어
								</MenuItem>
								<MenuItem id="ru" onClick={langChoice}>
									<img src="/img/flag/langru.png" width="16" style={{ marginRight: 8 }} />
									Русский
								</MenuItem>
								<MenuItem id="uz" onClick={langChoice}>
									<img src="/img/flag/languz.png" width="16" style={{ marginRight: 8 }} />
									O'zbek
								</MenuItem>
							</StyledMenu>
						</div>

						{/* Language */}
					</div>
				</div>
			</div>
		</>
	);
};

export default Top;
