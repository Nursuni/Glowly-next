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
				<Link href={'/seller'}>
					<div>{t('Sellers')}</div>
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
		<Stack className={'navbar'}>
			<Stack
				className={`navbar-main
					${colorChange ? 'transparent' : ''}
					${bgColor ? 'transparent' : ''}
					${scrolled ? 'scrolled' : ''}
				`}
			>
				<Stack className={'container'}>
					{/* LOGO */}
					<Box component={'div'} className={'logo-box'}>
						<Link href={'/'}>
							<img src="/img/logo/Glowy.png" alt="Glowly" />
						</Link>
					</Box>

					{/* NAV LINKS */}
					<Box component={'div'} className={'router-box'}>
						<Link href={'/'}>
							<div className={isActive('/') && router.pathname === '/' ? 'active' : ''}>{t('Home')}</div>
						</Link>
						<Link href={'/catalog'}>
							<div className={isActive('/catalog') ? 'active' : ''}>{t('Catalog')}</div>
						</Link>
						<Link href={'/seller'}>
							<div className={isActive('/seller') ? 'active' : ''}>{t('Sellers')}</div>
						</Link>
						<Link href={'/blog?articleCategory=FREE'}>
							<div className={isActive('/blog') ? 'active' : ''}>{t('Blog')}</div>
						</Link>
						{user?._id && (
							<Link href={'/mypage'}>
								<div className={isActive('/mypage') ? 'active' : ''}>{t('My Page')}</div>
							</Link>
						)}
						<Link href={'/support'}>
							<div className={isActive('/support') ? 'active' : ''}>{t('Support')}</div>
						</Link>
						<Link href={'/about'}>
							<div className={isActive('/about') ? 'active' : ''}>{t('About us')}</div>
						</Link>
					</Box>
					<Box>
						{' '}
						<img src="/img/icons/search.svg" alt="profile" />
					</Box>

					<Box>
						{' '}
						<img src="/img/icons/basket.svg" alt="basket" />
					</Box>
					{/* USER BOX */}
					<Box component={'div'} className={'user-box'}>
						{/* Auth */}
						{user?._id ? (
							<>
								<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
									<img
										src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/icons/userWhite.svg'}
										alt="profile"
									/>
								</div>

								<Menu
									id="basic-menu"
									anchorEl={logoutAnchor}
									open={logoutOpen}
									onClose={() => setLogoutAnchor(null)}
									sx={{ mt: '6px' }}
								>
									<MenuItem onClick={() => logOut()}>
										<Logout fontSize="small" style={{ color: '#c08a5e', marginRight: '10px' }} />
										{t('Logout')}
									</MenuItem>
								</Menu>
							</>
						) : (
							<Link href={'/account/join'}>
								<div className={'join-box'}>
									<AccountCircleOutlinedIcon />
									<span>
										{t('Login')} / {t('Register')}
									</span>
								</div>
							</Link>
						)}

						{/* Divider */}
						<div className={'divider'} />

						{/* Notifications + Language */}
						<Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
							{/* Notification Bell */}
							{user?._id && (
								<Box
									component="button"
									onClick={() => router.push('/mypage?tab=notifications')}
									sx={{
										position: 'relative',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 36,
										height: 36,
										borderRadius: '10px',
										border: 'none',
										background: 'transparent',
										cursor: 'pointer',
										transition: 'background 0.18s ease',
										'&:hover': { background: 'rgba(0,0,0,0.05)' },
									}}
								>
									<NotificationsOutlinedIcon sx={{ fontSize: 20, color: '#666' }} />
									{/* Unread dot — wire to real notification count when ready */}
									<Box
										sx={{
											position: 'absolute',
											top: 7,
											right: 7,
											width: 7,
											height: 7,
											borderRadius: '50%',
											backgroundColor: '#e05c5c',
											border: '1.5px solid white',
										}}
									/>
								</Box>
							)}

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

							{/* Language Dropdown */}
							<StyledMenu
								anchorEl={anchorEl2}
								open={drop}
								onClose={langClose}
								TransitionProps={{ timeout: 150 }}
								sx={{
									'& .MuiPaper-root': {
										borderRadius: '14px',
										padding: '5px',
										minWidth: 170,
										boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
										border: '1px solid rgba(0,0,0,0.06)',
										marginTop: '6px',
									},
									'& .MuiList-root': { padding: 0 },
									'& .MuiMenuItem-root': {
										borderRadius: '9px',
										padding: '8px 11px',
										fontSize: '13px',
										fontWeight: 500,
										color: '#1a1a1a',
										display: 'flex',
										alignItems: 'center',
										gap: '10px',
										transition: 'background 0.13s ease',
										'&:hover': { backgroundColor: '#f5f5f5' },
									},
								}}
							>
								{(
									[
										{ id: 'en', src: '/img/flag/langen.png', label: t('English') },
										{ id: 'kr', src: '/img/flag/langkr.png', label: t('Korean') },
										{ id: 'uz', src: '/img/flag/languz.png', label: t('Uzbek') },
										{ id: 'ru', src: '/img/flag/langru.png', label: t('Russian') },
									] as const
								).map(({ id, src, label }) => (
									<MenuItem key={id} disableRipple onClick={langChoice} id={id}>
										<Box
											sx={{
												width: 21,
												height: 21,
												borderRadius: '50%',
												overflow: 'hidden',
												flexShrink: 0,
												boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
											}}
										>
											<img
												src={src}
												alt={label}
												style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
											/>
										</Box>
										<span style={{ flex: 1 }}>{label}</span>
										{lang === id && (
											<Box
												sx={{
													width: 6,
													height: 6,
													borderRadius: '50%',
													backgroundColor: '#111',
													flexShrink: 0,
												}}
											/>
										)}
									</MenuItem>
								))}
							</StyledMenu>
						</Box>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withRouter(Top);
