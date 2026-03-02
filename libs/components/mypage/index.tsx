import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../../apollo/user/mutation';
import { Messages } from '../../config';
import { toastError, toastInfo, toastSuccess } from '../../toast';
import MemberFollowings from '../member/MemberFollowings';
import MemberFollowers from '../member/MemberFollowers';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE); //
	const [unsubscribe] = useMutation(UNSUBSCRIBE); //
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER); //

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id: ', id);
			if (!id) throw new Error(Messages.UNKNOWN_ERROR);
			if (!user._id) throw new Error(Messages.LOGIN_REQUIRED);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await toastInfo('Subscribed!');
			await refetch({ input: query });
		} catch (err: any) {
			toastError(err);
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.UNKNOWN_ERROR);
			if (!user._id) throw new Error(Messages.LOGIN_REQUIRED);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await toastInfo('Unsubscribed!');
			await refetch({ input: query });
		} catch (err: any) {
			toastError(err);
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.LOGIN_REQUIRED);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});

			await toastSuccess('Success!');
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			toastError(err.message);
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await toastError(error);
		}
	};

	if (device === 'mobile') {
		return <div>MY PAGE</div>;
	} else {
		return (
			<div id="my-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{category === 'addProperty' && <AddProduct />}
									{category === 'myProperties' && <MyProducts />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
											likeMemberHandler={likeMemberHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
											likeMemberHandler={likeMemberHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);
