import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Following } from '../../types/follow/follow';
import { NEXT_PUBLIC_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { GET_MEMBER_FOLLOWINGS } from '../../../apollo/user/query';

interface MemberFollowingsProps {
	initialInput: FollowInquiry;
	subscribeHandler: (id: string, refetch?: any, input?: FollowInquiry) => void;
	unsubscribeHandler: (id: string, refetch?: any, input?: FollowInquiry) => void;
	likeMemberHandler: (id: string, refetch?: any, input?: FollowInquiry) => void;
	redirectToMemberPageHandler?: (id: string) => void;
}

const MemberFollowings = ({
	initialInput,
	subscribeHandler,
	unsubscribeHandler,
	likeMemberHandler,
	redirectToMemberPageHandler,
}: MemberFollowingsProps) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const category: string = (router.query?.category as string) ?? 'products';

	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(initialInput);
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO QUERY **/
	const { data, refetch } = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followerId,
		notifyOnNetworkStatusChange: true,
	});

	/** DERIVE STATE FROM QUERY DATA **/
	useEffect(() => {
		if (data?.getMemberFollowings) {
			setMemberFollowings(data.getMemberFollowings.list || []);
			setTotal(data.getMemberFollowings.metaCounter?.[0]?.total || 0);
		}
	}, [data]);

	/** SET FOLLOW INQUIRY BASED ON ROUTER OR USER **/
	useEffect(() => {
		setFollowInquiry((prev) => ({
			...prev,
			search: { followerId: (router.query.memberId as string) || user?._id || '' },
		}));
	}, [router.query.memberId, user?._id]);

	/** REFETCH ON FOLLOW INQUIRY CHANGE **/
	useEffect(() => {
		if (followInquiry?.search?.followerId) {
			refetch?.({ input: followInquiry });
		}
	}, [followInquiry]);

	/** PAGINATION HANDLER **/
	const paginationHandler = (_event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry((prev) => ({ ...prev, page: value }));
	};

	/** MOBILE RENDER **/
	if (device === 'mobile') {
		return <div>glowly FOLLOWINGS MOBILE</div>;
	}

	/** DESKTOP RENDER **/
	return (
		<div id="member-follows-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{category === 'followers' ? 'Followers' : 'Followings'}</Typography>
				</Stack>
			</Stack>

			<Stack className="follows-list-box">
				<Stack className="listing-title-box">
					<Typography className="title-text">Name</Typography>
					<Typography className="title-text">Details</Typography>
					<Typography className="title-text">Connection</Typography>
				</Stack>

				{memberFollowings?.length === 0 && (
					<div className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>You're not following anyone yet.</p>
					</div>
				)}

				{memberFollowings.map((following: Following) => {
					const imagePath = following?.followingData?.memberImage
						? `${NEXT_PUBLIC_API_URL}/${following.followingData.memberImage}`
						: '/img/profile/user.svg';

					return (
						<Stack className="follows-card-box" key={following._id}>
							<Stack className="info" onClick={() => redirectToMemberPageHandler?.(following?.followingData?._id)}>
								<Stack className="image-box">
									<img src={imagePath} alt="" />
								</Stack>
								<Stack className="information-box">
									<Typography className="name">{following?.followingData?.memberNick}</Typography>
								</Stack>
							</Stack>

							<Stack className="details-box">
								<Box className="info-box" component="div">
									<p>Followers</p>
									<span>({following?.followingData?.memberFollowers})</span>
								</Box>
								<Box className="info-box" component="div">
									<p>Following</p>
									<span>({following?.followingData?.memberFollowings})</span>
								</Box>
								<Box className="info-box" component="div">
									{following?.meLiked?.[0]?.myFavorite ? (
										<FavoriteIcon
											color="primary"
											onClick={() => likeMemberHandler(following?.followingData?._id, refetch, followInquiry)}
										/>
									) : (
										<FavoriteBorderIcon
											onClick={() => likeMemberHandler(following?.followingData?._id, refetch, followInquiry)}
										/>
									)}
									<span>({following?.followingData?.memberLikes})</span>
								</Box>
							</Stack>

							{user?._id !== following?.followingId && (
								<Stack className="action-box">
									{following?.meFollowed?.[0]?.myFollowing ? (
										<>
											<Typography>Following</Typography>
											<Button
												variant="outlined"
												sx={{ background: '#f78181', ':hover': { background: '#f06363' } }}
												onClick={() => unsubscribeHandler(following?.followingData?._id, refetch, followInquiry)}
											>
												Unfollow
											</Button>
										</>
									) : (
										<Button
											variant="contained"
											sx={{ background: '#60eb60d4', ':hover': { background: '#60eb60d4' } }}
											onClick={() => subscribeHandler(following?.followingData?._id, refetch, followInquiry)}
										>
											Follow
										</Button>
									)}
								</Stack>
							)}
						</Stack>
					);
				})}
			</Stack>

			{memberFollowings.length > 0 && (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							page={followInquiry.page}
							count={Math.ceil(total / followInquiry.limit) || 1}
							onChange={paginationHandler}
							shape="circular"
							color="primary"
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>{total} following</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MemberFollowings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: { followerId: '' },
	},
};

export default MemberFollowings;
