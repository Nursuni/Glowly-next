import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Comment } from '../../types/comment/comment';
import { NEXT_PUBLIC_API_URL } from '../../config';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface ReviewProps {
	comment: Comment;
}

const Review: React.FC<ReviewProps> = ({ comment }) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const imagePath: string = comment?.memberData?.memberImage
		? `${NEXT_PUBLIC_API_URL}/${comment?.memberData?.memberImage}`
		: '/img/profile/user.svg';

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	// MOBILE LAYOUT
	if (device === 'mobile') {
		return (
			<div className="mobile-comment-card">
				<div className="mobile-comment-header">
					<img
						src={imagePath}
						alt=""
						className="mobile-member-img"
						onClick={() => goMemberPage(comment?.memberData?._id as string)}
					/>
					<div className="mobile-comment-meta">
						<span className="mobile-comment-name" onClick={() => goMemberPage(comment?.memberData?._id as string)}>
							{comment.memberData?.memberNick}
						</span>
						<span className="mobile-comment-date">{dayjs(comment.createdAt).format('DD MMM · HH:mm')}</span>
					</div>
				</div>
				<div className="mobile-comment-body">{comment.commentContent}</div>
			</div>
		);
	}

	// DESKTOP LAYOUT
	return (
		<Stack className="review-config">
			<Stack className="review-mb-info">
				<Stack className="img-name-box">
					<img src={imagePath} alt="" className="img-box" />
					<Stack>
						<Typography className="name" onClick={() => goMemberPage(comment?.memberData?._id as string)}>
							{comment.memberData?.memberNick}
						</Typography>
						<Typography className="date">{dayjs(comment.createdAt).format('DD MMMM, YYYY')}</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack className="desc-box">
				<Typography className="description">{comment.commentContent}</Typography>
			</Stack>
		</Stack>
	);
};

export default Review;
