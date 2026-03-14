import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { T } from '../../types/common';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { Messages } from '../../config';
import { Product } from '../../types/product/product';
import { toastError } from '../../toast';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { ProductCard } from './ProductCard';

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const [myFavorites, setMyFavorites] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { data, refetch } = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFavorites },
		notifyOnNetworkStatusChange: true,
	});

	/** UPDATE STATE WHEN DATA CHANGES **/
	useEffect(() => {
		if (data) {
			setMyFavorites(data?.getFavorites?.list ?? []);
			setTotal(data?.getFavorites?.metaCounter?.[0]?.total ?? 0);
		}
	}, [data]);

	/** HANDLERS **/
	const likeProductHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Messages.LOGIN_REQUIRED);

			await likeTargetProduct({ variables: { input: id } });
			if (refetch) await refetch({ input: searchFavorites });
		} catch (err: any) {
			console.error('ERROR, likeProductHandler:', err.message);
			toastError(err.message);
		}
	};

	const paginationHandler = (_: T, value: number) => {
		setSearchFavorites((prev) => ({ ...prev, page: value }));
	};

	if (device === 'mobile') {
		return <div>Glowly Saved Favorites MOBILE</div>;
	}

	return (
		<div id="my-favorites-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">Saved Favorites</Typography>
					<Typography className="sub-title">We are glad to see you again!</Typography>
				</Stack>
			</Stack>

			<Stack className="favorites-list-box">
				{myFavorites.length > 0 ? (
					myFavorites.map((product: Product) => (
						<ProductCard key={product._id} product={product} memberPage likeProductHandler={likeProductHandler} />
					))
				) : (
					<div className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="No favorites" />
						<p>No Favorites found!</p>
					</div>
				)}
			</Stack>

			{myFavorites.length > 0 && (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchFavorites.limit)}
							page={searchFavorites.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>
							Total {total} favorite product{total !== 1 ? 's' : ''}
						</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

export default MyFavorites;
