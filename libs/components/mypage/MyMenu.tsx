import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import PortraitIcon from '@mui/icons-material/Portrait';
import IconButton from '@mui/material/IconButton';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { toastInfo } from '../../toast';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await toastInfo('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	}

	return (
		<Stack width={'100%'} padding={'30px 24px'}>
			{/* PROFILE */}
			<Stack className={'profile'}>
				<Box component={'div'} className={'profile-img'}>
					<img
						src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt="member-photo"
					/>
				</Box>
				<Stack className={'user-info'}>
					<Typography className={'user-name'}>{user?.memberNick}</Typography>

					<Box component={'div'} className={'user-phone'}>
						<img src="/img/icons/call.svg" alt="icon" />
						<Typography className={'p-number'}>{user?.memberPhone}</Typography>
					</Box>

					{user?.memberType === 'ADMIN' ? (
						<a href="/_admin/users" target="_blank" rel="noreferrer">
							<Typography className={'view-list'}>{user?.memberType}</Typography>
						</a>
					) : (
						<Typography className={'view-list'}>{user?.memberType}</Typography>
					)}
				</Stack>
			</Stack>

			{/* SECTIONS */}
			<Stack className={'sections'}>
				{/* MANAGE LISTINGS */}
				<Stack
					className={'section'}
					style={{
						height: user?.memberType === 'SELLER' ? '228px' : '153px',
					}}
				>
					<Typography className="title" variant="h5">
						MANAGE LISTINGS
					</Typography>

					<List className={'sub-section'}>
						{user?.memberType === 'SELLER' && (
							<>
								{/* ADD PRODUCT */}
								<ListItem className={pathname === 'addProduct' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/mypage',
											query: { category: 'addProduct' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											{category === 'addProduct' ? (
												<img className={'com-icon'} src="/img/icons/whiteTab.svg" alt="icon" />
											) : (
												<img className={'com-icon'} src="/img/icons/newTab.svg" alt="icon" />
											)}

											<Typography className={'sub-title'} variant="subtitle1">
												Add Product
											</Typography>

											<IconButton sx={{ ml: '40px' }}>
												<PortraitIcon style={{ color: 'red' }} />
											</IconButton>
										</div>
									</Link>
								</ListItem>

								{/* MY PRODUCTS */}
								<ListItem className={pathname === 'myProducts' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/mypage',
											query: { category: 'myProducts' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											{category === 'myProducts' ? (
												<img className={'com-icon'} src="/img/icons/homeWhite.svg" alt="icon" />
											) : (
												<img className={'com-icon'} src="/img/icons/home.svg" alt="icon" />
											)}

											<Typography className={'sub-title'} variant="subtitle1">
												My Products
											</Typography>

											<IconButton sx={{ ml: '36px' }}>
												<PortraitIcon style={{ color: 'red' }} />
											</IconButton>
										</div>
									</Link>
								</ListItem>
							</>
						)}

						{/* MY FAVORITES */}
						<ListItem className={pathname === 'myFavorites' ? 'focus' : ''}>
							<Link
								href={{
									pathname: '/mypage',
									query: { category: 'myFavorites' },
								}}
								scroll={false}
							>
								<div className={'flex-box'}>
									{category === 'myFavorites' ? (
										<img className={'com-icon'} src="/img/icons/likeWhite.svg" alt="icon" />
									) : (
										<img className={'com-icon'} src="/img/icons/like.svg" alt="icon" />
									)}
									<Typography className={'sub-title'} variant="subtitle1">
										My Favorites
									</Typography>
								</div>
							</Link>
						</ListItem>

						{/* RECENTLY VISITED */}
						<ListItem className={pathname === 'recentlyVisited' ? 'focus' : ''}>
							<Link
								href={{
									pathname: '/mypage',
									query: { category: 'recentlyVisited' },
								}}
								scroll={false}
							>
								<div className={'flex-box'}>
									{category === 'recentlyVisited' ? (
										<img className={'com-icon'} src="/img/icons/searchWhite.svg" alt="icon" />
									) : (
										<img className={'com-icon'} src="/img/icons/search.svg" alt="icon" />
									)}
									<Typography className={'sub-title'} variant="subtitle1">
										Recently Visited
									</Typography>
								</div>
							</Link>
						</ListItem>

						{/* FOLLOWERS */}
						<ListItem className={pathname === 'followers' ? 'focus' : ''}>
							<Link
								href={{
									pathname: '/mypage',
									query: { category: 'followers' },
								}}
								scroll={false}
							>
								<div className={'flex-box'}>
									<Typography className={'sub-title'} variant="subtitle1">
										My Followers
									</Typography>
								</div>
							</Link>
						</ListItem>

						{/* FOLLOWINGS */}
						<ListItem className={pathname === 'followings' ? 'focus' : ''}>
							<Link
								href={{
									pathname: '/mypage',
									query: { category: 'followings' },
								}}
								scroll={false}
							>
								<div className={'flex-box'}>
									<Typography className={'sub-title'} variant="subtitle1">
										My Followings
									</Typography>
								</div>
							</Link>
						</ListItem>
					</List>
				</Stack>

				{/* MANAGE ACCOUNT */}
				<Stack className={'section'} sx={{ marginTop: '30px' }}>
					<Typography className="title" variant="h5">
						MANAGE ACCOUNT
					</Typography>

					<List className={'sub-section'}>
						<ListItem className={pathname === 'myProfile' ? 'focus' : ''}>
							<Link
								href={{
									pathname: '/mypage',
									query: { category: 'myProfile' },
								}}
								scroll={false}
							>
								<div className={'flex-box'}>
									<Typography className={'sub-title'} variant="subtitle1">
										My Profile
									</Typography>
								</div>
							</Link>
						</ListItem>

						<ListItem onClick={logoutHandler}>
							<div className={'flex-box'}>
								<Typography className={'sub-title'} variant="subtitle1">
									Logout
								</Typography>
							</div>
						</ListItem>
					</List>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default MyMenu;
