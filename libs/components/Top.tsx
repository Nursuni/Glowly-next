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
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Logout } from '@mui/icons-material';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar, cartVar } from '../../apollo/store';
import { NEXT_PUBLIC_API_URL } from '../config';
import Image from 'next/image';
import BasketModal from './basket/BasketModal';
import AnnouncementBar from './AnnouncementBar';
import { DELETE_NOTIFICATION, MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATION_READ } from '@/apollo/user/mutation';
import { GET_NOTIFICATIONS, GET_UNREAD_COUNT } from '@/apollo/user/query';

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		disableScrollLock
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
	const cartItems = useReactiveVar(cartVar);
	const { t } = useTranslation('common');
	const router = useRouter();

	const [basketOpen, setBasketOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = basketOpen ? 'hidden' : 'auto';
	}, [basketOpen]);

	// ── Cart handlers ──
	const handleQtyChange = (id: string, delta: number) => {
		cartVar(
			cartVar().map((item) => (item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
		);
	};

	const handleRemove = (id: string) => {
		cartVar(cartVar().filter((item) => item._id !== id));
	};

	// ── Language dropdown ──
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string>(router.locale || 'en');
	const drop = Boolean(anchorEl2);

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

	// ── Navbar scroll & background ──
	const [scrolled, setScrolled] = useState(false);
	const [bgColor, setBgColor] = useState(false);
	const [navReady, setNavReady] = useState(false);

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

	// ── User dropdown ──
	const [userDropOpen, setUserDropOpen] = useState(false);
	const userDropRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (userDropRef.current && !userDropRef.current.contains(e.target as Node)) {
				setUserDropOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	const avatar = user?.memberImage ? `${NEXT_PUBLIC_API_URL}/${user.memberImage}` : '/img/profile/user.svg';

	// ── Notifications ──
	const { data: notifData, refetch: refetchNotifs } = useQuery(GET_NOTIFICATIONS, {
		variables: {
			input: {
				page: 1,
				limit: 20,
				search: {},
			},
		},
		skip: !user,
	});

	const { data: unreadData } = useQuery(GET_UNREAD_COUNT, { skip: !user });

	const [markRead] = useMutation(MARK_NOTIFICATION_READ);
	const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

	const [notifOpen, setNotifOpen] = useState(false);
	const notifRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
				setNotifOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	const unreadCount = unreadData?.getUnreadCount || 0;

	// ── Mobile ──
	if (device === 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>{t('home')}</Link>
				<Link href={'/catalog'}>{t('catalog')}</Link>
				<Link href={'/brand'}>{t('brands')}</Link>
				<Link href={'/blog?articleCategory=FREE'}>{t('blog')}</Link>
				<Link href={'/support'}>{t('support')}</Link>
				<Link href={'/about'}>{t('about')}</Link>
			</Stack>
		);
	}

	// ── Desktop ──
	return (
		<>
			<AnnouncementBar navReady={navReady} />
			<div className={`navbar${navReady ? ' nb-ready' : ''}`}>
				<div className={`navbar-main${bgColor ? ' transparent' : ''}${scrolled ? ' scrolled' : ''}`}>
					<div className="container">
						{/* Logo */}
						<div className="logo-box nb-item">
							<Link href="/">
								<Image src="/img/logo/glowly.svg" alt="Glowly" width={120} height={40} />
							</Link>
						</div>

						{/* Nav Links */}
						<div className="router-box">
							<Link href="/" className={router.pathname === '/' ? 'active' : ''}>
								{t('home')}
							</Link>
							<Link href="/catalog" className={router.pathname.startsWith('/catalog') ? 'active' : ''}>
								{t('catalog')}
							</Link>
							<Link href="/brand" className={router.pathname.startsWith('/brand') ? 'active' : ''}>
								{t('brands')}
							</Link>
							<Link href="/blog?articleCategory=FREE" className={router.pathname.startsWith('/blog') ? 'active' : ''}>
								{t('blog')}
							</Link>
							<Link href="/support" className={router.pathname.startsWith('/support') ? 'active' : ''}>
								{t('support')}
							</Link>
							<Link href="/about" className={router.pathname.startsWith('/about') ? 'active' : ''}>
								{t('about')}
							</Link>
						</div>

						{/* User Box */}
						<div className="user-box">
							{/* Basket */}
							<button className="icon-btn basket-btn" onClick={() => setBasketOpen(true)}>
								<img src="/img/icons/basket.svg" alt="basket" />
								{cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
							</button>
							<BasketModal
								open={basketOpen}
								onClose={() => setBasketOpen(false)}
								items={cartItems}
								onQtyChange={handleQtyChange}
								onRemove={handleRemove}
							/>

							{/* Notifications */}
							{user && (
								<div className="notif-wrap" ref={notifRef}>
									<button
										className="icon-btn notification-btn"
										onClick={() => setNotifOpen((v) => !v)}
										aria-label="Notifications"
									>
										<NotificationsOutlinedIcon />
										{unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
									</button>

									{notifOpen && (
										<div className="notification-panel">
											<div className="np-header">
												<span>Notifications</span>
												<button
													onClick={async () => {
														await markAllRead();
														refetchNotifs();
													}}
												>
													Mark All Read
												</button>
											</div>
											<div className="np-list">
												{notifData?.getNotifications?.list?.map((n: any) => (
													<div key={n._id} className={`np-item ${n.notificationStatus === 'UNREAD' ? 'unread' : ''}`}>
														<div className="np-item-left">
															<img
																src={n.authorData?.avatar || '/img/default-avatar.png'}
																alt="avatar"
																className="np-avatar"
															/>
															<div>
																<div className="np-content">{n.content}</div>
																<div className="np-date">{new Date(n.createdAt).toLocaleString()}</div>
															</div>
														</div>
														<div className="np-item-right">
															{n.notificationStatus === 'UNREAD' && (
																<button
																	onClick={async () => {
																		await markRead({ variables: { notificationId: n._id } });
																		refetchNotifs();
																	}}
																>
																	✔
																</button>
															)}
															<button
																onClick={async () => {
																	await deleteNotification({ variables: { notificationId: n._id } });
																	refetchNotifs();
																}}
															>
																🗑
															</button>
														</div>
													</div>
												))}
												{notifData?.getNotifications?.list?.length === 0 && (
													<div className="np-empty">No notifications</div>
												)}
											</div>
										</div>
									)}
								</div>
							)}

							{/* User Dropdown */}
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
										{user?._id ? (
											<>
												<div className="ud-header">
													<img
														src={
															user.memberImage ? `${NEXT_PUBLIC_API_URL}/${user.memberImage}` : '/img/profile/user.svg'
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
												<Link
													href="/mypage?category=myFavorites"
													className="ud-item"
													onClick={() => setUserDropOpen(false)}
												>
													<FavoriteBorderOutlinedIcon /> Wishlist
												</Link>
												<Link
													href="/mypage?category=myOrder"
													className="ud-item"
													onClick={() => setUserDropOpen(false)}
												>
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
												<Link
													href="/account/join"
													className="ud-item ud-item--primary"
													onClick={() => setUserDropOpen(false)}
												>
													<AccountCircleOutlinedIcon /> Login/Sign Up
												</Link>
											</>
										)}
									</div>
								)}
							</div>

							{/* Language Selector */}
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
									<img src="/img/flag/langen.png" width="16" style={{ marginRight: 8 }} alt="en" /> English
								</MenuItem>
								<MenuItem id="kr" onClick={langChoice}>
									<img src="/img/flag/langkr.png" width="16" style={{ marginRight: 8 }} alt="kr" /> 한국어
								</MenuItem>
								<MenuItem id="ru" onClick={langChoice}>
									<img src="/img/flag/langru.png" width="16" style={{ marginRight: 8 }} alt="ru" /> Русский
								</MenuItem>
								<MenuItem id="uz" onClick={langChoice}>
									<img src="/img/flag/languz.png" width="16" style={{ marginRight: 8 }} alt="uz" /> O'zbek
								</MenuItem>
							</StyledMenu>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Top;
