import React, { useCallback, useState } from 'react';
import { Stack, Typography, Checkbox, OutlinedInput, Tooltip, IconButton, Button, Drawer } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ProductsInquiry } from '../../types/product/product.input';
import { ProductType } from '../../enums/product.enum';

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

	/* ---------- ROUTER PUSH HELPER ---------- */
	const pushFilter = async (updatedFilter: ProductsInquiry) => {
		await router.push(
			{
				pathname: '/product',
				query: { input: JSON.stringify(updatedFilter) },
			},
			undefined,
			{ scroll: false },
		);
	};

	/* ---------- SEARCH ---------- */
	const handleSearch = async () => {
		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		};
		setSearchFilter(updated);
		await pushFilter(updated);
	};

	/* ---------- CATEGORY SELECT ---------- */
	const productTypeSelectHandler = useCallback(
		async (e: any) => {
			const value = e.target.value;
			const checked = e.target.checked;

			let updatedTypes = searchFilter?.search?.typeList || [];

			if (checked) {
				updatedTypes = [...updatedTypes, value];
			} else {
				updatedTypes = updatedTypes.filter((item: string) => item !== value);
			}

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

	/* ---------- PRICE ---------- */
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

	/* ---------- RESET ---------- */
	const refreshHandler = async () => {
		setSearchText('');
		setSearchFilter(initialInput);
		await pushFilter(initialInput);
	};

	/* ================= MOBILE ================= */
	if (device === 'mobile') {
		return (
			<>
				<Button startIcon={<FilterAltIcon />} onClick={() => setMobileOpen(true)} variant="outlined" fullWidth>
					Filter Beauty Products
				</Button>

				<Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
					<Stack spacing={3} p={3} width={280}>
						<Typography variant="h6">Beauty Filters</Typography>

						{/* Search */}
						<OutlinedInput
							value={searchText}
							placeholder="Search skincare, makeup..."
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						/>

						{/* Categories */}
						<Typography variant="subtitle2">Categories</Typography>
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

						{/* Price */}
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

	/* ================= DESKTOP ================= */
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
				<Tooltip title="Reset All">
					<IconButton onClick={refreshHandler}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
			</Stack>

			{/* CATEGORY */}
			<Stack spacing={2}>
				<Typography variant="h6">Categories</Typography>
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
