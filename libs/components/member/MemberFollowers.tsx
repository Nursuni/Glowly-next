import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Follower } from '../../types/follow/follow';
import { NEXT_PUBLIC_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { GET_MEMBER_FOLLOWERS } from '../../../apollo/user/query';

interface MemberFollowsProps {
	initialInput: FollowInquiry;
	subscribeHandler: (id: string, refetch?: any, input?: FollowInquiry) => void;
	unsubscribeHandler: (id: string, refetch?: any, input?: FollowInquiry) => void;
	likeMemberHandler: (id: string, refetch?: any, input?: FollowInquiry) => void;
	redirectToMemberPageHandler?: (id: string) => void;
}

const MemberFollowers = ({
	initialInput,
	subscribeHandler,
	unsubscribeHandler,
	likeMemberHandler,
	redirectToMemberPageHandler,
}: MemberFollowsProps) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const category: string = (router.query?.category as string) ?? 'products';

	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(initialInput);
	const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO QUERY **/
	const {
		loading: getMemberFollowersLoading,
		data: getMemberFollowersData,
		error: getMemberFollowersError,
		refetch: getMemberFollowersRefetch,
	} = useQuery(GET_MEMBER_FOLLOWERS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followingId,
		notifyOnNetworkStatusChange: true,
	});

	/** DERIVE STATE FROM QUERY DATA **/
	useEffect(() => {
		if (getMemberFollowersData?.getMemberFollowers) {
			setMemberFollowers(getMemberFollowersData.getMemberFollowers.list || []);
			setTotal(getMemberFollowersData.getMemberFollowers.metaCounter?.[0]?.total || 0);
		}
	}, [getMemberFollowersData]);

	/** SET FOLLOW INQUIRY BASED ON ROUTER OR USER **/
	useEffect(() => {
		setFollowInquiry((prev) => ({
			...prev,
			search: {
				followingId: (router.query.memberId as string) || user?._id || '',
			},
		}));
	}, [router.query.memberId, user?._id]);

	/** REFETCH ON PAGE CHANGE **/
	useEffect(() => {
		if (followInquiry?.search?.followingId) {
			getMemberFollowersRefetch?.({ input: followInquiry });
		}
	}, [followInquiry.page, followInquiry.limit, followInquiry.search.followingId]);

	/** PAGINATION HANDLER **/
	const paginationHandler = (_event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry((prev) => ({ ...prev, page: value }));
	};

	/** MOBILE RENDER **/
	if (device === 'mobile') {
		return <div>glowly FOLLOWS MOBILE</div>;
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

				{memberFollowers?.length === 0 && (
					<div className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No followers yet. Start connecting with the community!</p>
					</div>
				)}

				{memberFollowers.map((follower: Follower) => {
					const imagePath = follower?.followerData?.memberImage
						? `${NEXT_PUBLIC_API_URL}/${follower.followerData.memberImage}`
						: '/img/profile/user.svg';

					return (
						<Stack className="follows-card-box" key={follower._id}>
							<Stack className="info" onClick={() => redirectToMemberPageHandler?.(follower?.followerData?._id)}>
								<Stack className="image-box">
									<img src={imagePath} alt="" />
								</Stack>
								<Stack className="information-box">
									<Typography className="name">{follower?.followerData?.memberNick}</Typography>
								</Stack>
							</Stack>

							<Stack className="details-box">
								<Box className="info-box" component="div">
									<p>Followers</p>
									<span>({follower?.followerData?.memberFollowers})</span>
								</Box>
								<Box className="info-box" component="div">
									<p>Following</p>
									<span>({follower?.followerData?.memberFollowings})</span>
								</Box>
								<Box className="info-box" component="div">
									{follower?.meLiked?.[0]?.myFavorite ? (
										<FavoriteIcon
											color="primary"
											onClick={() =>
												likeMemberHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
											}
										/>
									) : (
										<FavoriteBorderIcon
											onClick={() =>
												likeMemberHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
											}
										/>
									)}
									<span>({follower?.followerData?.memberLikes})</span>
								</Box>
							</Stack>

							{user?._id !== follower?.followerId && (
								<Stack className="action-box">
									{follower?.meFollowed?.[0]?.myFollowing ? (
										<>
											<Typography>Following</Typography>
											<Button
												variant="outlined"
												sx={{ background: '#ed5858', ':hover': { background: '#ee7171' } }}
												onClick={() =>
													subscribeHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
												}
											>
												Unfollow
											</Button>
										</>
									) : (
										<Button
											variant="contained"
											sx={{ background: '#60eb60d4', ':hover': { background: '#60eb60d4' } }}
											onClick={() =>
												subscribeHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
											}
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

			{memberFollowers.length > 0 && (
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
						<Typography>{total} followers</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MemberFollowers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {
			followingId: '',
		},
	},
};

export default MemberFollowers;
