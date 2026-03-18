import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Messages, NEXT_PUBLIC_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { toastError, toastSuccess } from '../../toast';

const MyProfile: NextPage = ({ initialValues }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

	/** APOLLO REQUEST **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user) return;
		setUpdateData({
			...updateData,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
		});
	}, [user]);

	/** IMAGE UPLOAD **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			const formData = new FormData();

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target)
          }`,
					variables: { file: null, target: 'member' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const uploadedImage = response.data.data.imageUploader;
			setUpdateData({ ...updateData, memberImage: uploadedImage });
			return `${NEXT_PUBLIC_API_URL}/${uploadedImage}`;
		} catch (err) {
			console.log('uploadImage error:', err);
		}
	};

	/** UPDATE PROFILE **/
	const updateProfileHandler = useCallback(async () => {
		try {
			if (!user?._id) throw new Error(Messages.LOGIN_REQUIRED);
			const result = await updateMember({
				variables: { input: { ...updateData, _id: user._id } },
			});
			const jwtToken = result?.data?.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
			toastSuccess('Information updated successfully.');
		} catch (err: any) {
			toastError(err);
		}
	}, [updateData, user]);

	/** BUTTON DISABLE CHECK **/
	const doDisabledCheck = () => {
		return (
			updateData.memberNick === '' ||
			updateData.memberPhone === '' ||
			updateData.memberAddress === '' ||
			updateData.memberImage === ''
		);
	};

	if (device === 'mobile') {
		return <>Profile Settings PAGE MOBILE</>;
	}

	return (
		<div id="my-profile-page">
			{/* ── Page title ── */}
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">Profile Settings</Typography>
					<Typography className="sub-title">Manage your personal information and account preferences.</Typography>
				</Stack>
			</Stack>

			<Stack className="top-box">
				{/* ── Profile photo ── */}
				<Stack className="photo-box">
					<Typography className="title">Profile Photo</Typography>

					<Stack className="image-big-box">
						<Stack className="image-box">
							<img
								src={
									updateData?.memberImage ? `${NEXT_PUBLIC_API_URL}/${updateData.memberImage}` : '/img/profile/user.svg'
								}
								alt="Profile"
							/>
						</Stack>

						<Stack className="upload-big-box">
							<input
								type="file"
								hidden
								id="hidden-input"
								onChange={uploadImage}
								accept="image/jpg, image/jpeg, image/png"
							/>
							<label htmlFor="hidden-input" className="labeler">
								<Typography>Upload Photo</Typography>
							</label>
							<Typography className="upload-text">Supported formats: JPG, JPEG, PNG · Max 5MB</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* ── Display name + phone ── */}
				<Stack className="small-input-box">
					<Stack className="input-box">
						<Typography className="title">Display Name</Typography>
						<input
							type="text"
							placeholder="Enter your display name"
							value={updateData.memberNick}
							onChange={(e) => setUpdateData({ ...updateData, memberNick: e.target.value })}
						/>
					</Stack>

					<Stack className="input-box">
						<Typography className="title">Phone Number</Typography>
						<input
							type="text"
							placeholder="Enter your phone number"
							value={updateData.memberPhone}
							onChange={(e) => setUpdateData({ ...updateData, memberPhone: e.target.value })}
						/>
					</Stack>
				</Stack>

				{/* ── Address ── */}
				<Stack className="address-box">
					<Typography className="title">Address</Typography>
					<input
						type="text"
						placeholder="Enter your address"
						value={updateData.memberAddress}
						onChange={(e) => setUpdateData({ ...updateData, memberAddress: e.target.value })}
					/>
				</Stack>

				{/* ── Save button ── */}
				<Stack className="about-me-box">
					<Button className="update-button" onClick={updateProfileHandler} disabled={doDisabledCheck()}>
						<Typography>Save Changes</Typography>
					</Button>
				</Stack>
			</Stack>
		</div>
	);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
	},
};

export default MyProfile;
