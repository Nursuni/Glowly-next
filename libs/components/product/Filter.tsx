import React, { useCallback, useState } from 'react';
import { Stack, Typography, Checkbox, OutlinedInput, IconButton, Button, Drawer } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tooltip from '@mui/material/Tooltip';

import { ProductsInquiry } from '../../types/product/product.input';
import { ProductType, SkinType } from '../../enums/product.enum';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = ({ searchFilter, setSearchFilter, initialInput }: FilterType) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchText, setSearchText] = useState<string>('');
	const [mobileOpen, setMobileOpen] = useState(false);

	const productTypes = Object.values(ProductType);
	const skinTypes = ['ALL', ...Object.values(SkinType)];

	/* ROUTER PUSH */
	const pushFilter = async (updatedFilter: ProductsInquiry) => {
		await router.push(
			{
				pathname: '/catalog',
				query: { input: JSON.stringify(updatedFilter) },
			},
			undefined,
			{ scroll: false },
		);
	};

	/* SEARCH */
	const handleSearch = async () => {
		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	/* PRODUCT TYPE */
	const productTypeSelectHandler = useCallback(
		async (e: any) => {
			const value = e.target.value;
			const checked = e.target.checked;

			let updatedTypes = searchFilter?.search?.typeList || [];

			if (checked) updatedTypes = [...updatedTypes, value];
			else updatedTypes = updatedTypes.filter((item: string) => item !== value);

			const updated = {
				...searchFilter,
				page: 1,
				search: { ...searchFilter.search, typeList: updatedTypes },
			};

			setSearchFilter(updated);
			await pushFilter(updated);
		},
		[searchFilter],
	);

	/* SKIN TYPE */
	const skinTypeHandler = async (e: any) => {
		const value = e.target.value;
		const checked = e.target.checked;

		let updatedSkinTypes = searchFilter?.search?.skinTypeList || [];

		if (value === 'ALL') {
			updatedSkinTypes = checked ? [] : [];
		} else {
			if (checked) updatedSkinTypes = [...updatedSkinTypes, value];
			else updatedSkinTypes = updatedSkinTypes.filter((item: string) => item !== value);
		}

		const updated = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				skinTypeList: updatedSkinTypes,
			},
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	/* PRICE */
	const productPriceHandler = async (value: number, type: 'start' | 'end') => {
		const updated = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				pricesRange: {
					...searchFilter.search.pricesRange,
					[type]: value,
				},
			},
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	/* RESET */
	const refreshHandler = async () => {
		setSearchText('');
		setSearchFilter(initialInput);
		await pushFilter(initialInput);
	};

	/* MOBILE */
	if (device === 'mobile') {
		return (
			<>
				<Button startIcon={<FilterAltIcon />} onClick={() => setMobileOpen(true)} variant="outlined" fullWidth>
					Filter Beauty Products
				</Button>

				<Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
					<Stack spacing={3} p={3} width={280}>
						<Typography variant="h6">Beauty Filters</Typography>

						<OutlinedInput
							value={searchText}
							placeholder="Search skincare, makeup..."
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						/>
						{/* PRODUCT TYPE */}
						<Stack spacing={2}>
							<Typography variant="h6">Product Type</Typography>

							{productTypes.map((type) => (
								<Stack direction="row" alignItems="center" key={type}>
									<Checkbox
										value={type}
										onChange={productTypeSelectHandler}
										checked={(searchFilter?.search?.typeList || []).includes(type)}
									/>

									<Typography>{type}</Typography>
								</Stack>
							))}
						</Stack>
						{/* SKIN TYPE */}
						<Typography variant="subtitle2">Skin Type</Typography>

						{skinTypes.map((type) => (
							<Stack direction="row" alignItems="center" key={type}>
								<Checkbox
									value={type}
									onChange={skinTypeHandler}
									checked={
										type === 'ALL'
											? (searchFilter?.search?.skinTypeList || []).length === 0
											: (searchFilter?.search?.skinTypeList || []).includes(type as SkinType)
									}
								/>
								<Typography>{type}</Typography>
							</Stack>
						))}

						{/* PRICE */}
						<Typography variant="subtitle2">Price Range</Typography>

						<input
							type="number"
							placeholder="Min"
							onChange={(e) => productPriceHandler(Number(e.target.value), 'start')}
						/>

						<input
							type="number"
							placeholder="Max"
							onChange={(e) => productPriceHandler(Number(e.target.value), 'end')}
						/>

						<Button onClick={refreshHandler} startIcon={<RefreshIcon />}>
							Reset Filters
						</Button>
					</Stack>
				</Drawer>
			</>
		);
	}

	/* DESKTOP */
	return (
		<Stack spacing={4}>
			{/* SEARCH */}
			<Stack spacing={2}>
				<Typography variant="h6">Search Beauty Products</Typography>

				<OutlinedInput
					value={searchText}
					placeholder="What are you looking for?"
					onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					endAdornment={<CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => setSearchText('')} />}
				/>

				<IconButton onClick={refreshHandler}>
					<RefreshIcon />
				</IconButton>
			</Stack>
			{/* PRODUCT TYPE */}
			<Stack spacing={2}>
				<Typography variant="h6">Product Type</Typography>

				{productTypes.map((type) => (
					<Stack direction="row" alignItems="center" key={type}>
						<Checkbox
							value={type}
							onChange={productTypeSelectHandler}
							checked={(searchFilter?.search?.typeList || []).includes(type)}
						/>

						<Typography>{type}</Typography>
					</Stack>
				))}
			</Stack>
			{/* SKIN TYPE */}
			<Stack spacing={2}>
				<Typography variant="h6">Skin Type</Typography>

				{skinTypes.map((type) => (
					<Stack direction="row" alignItems="center" key={type}>
						<Checkbox
							value={type}
							onChange={skinTypeHandler}
							checked={
								type === 'ALL'
									? (searchFilter?.search?.skinTypeList || []).length === 0
									: (searchFilter?.search?.skinTypeList || []).includes(type as SkinType)
							}
						/>

						<Typography>{type}</Typography>
					</Stack>
				))}
			</Stack>

			{/* PRICE */}
			<Stack spacing={2}>
				<Typography variant="h6">Price Range</Typography>

				<input
					type="number"
					placeholder="Minimum Price"
					onChange={(e) => productPriceHandler(Number(e.target.value), 'start')}
				/>

				<input
					type="number"
					placeholder="Maximum Price"
					onChange={(e) => productPriceHandler(Number(e.target.value), 'end')}
				/>
			</Stack>
		</Stack>
	);
};

export default Filter;
