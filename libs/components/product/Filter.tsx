import React, { useCallback, useState } from 'react';
import { Stack, Typography, Checkbox, OutlinedInput, IconButton, Button, Drawer, Slider } from '@mui/material';

import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';

import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { ProductsInquiry } from '../../types/product/product.input';
import { ProductType, SkinType } from '../../enums/product.enum';
import Collapse from '@mui/material/Collapse';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const accent = '#c0392b';

const Divider = () => <Stack sx={{ height: '1px', bgcolor: '#f0f0f0', my: 1.5 }} />;

const SectionHeader = ({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) => (
	<Stack
		direction="row"
		justifyContent="space-between"
		alignItems="center"
		onClick={onToggle}
		sx={{ cursor: 'pointer', py: 0.5 }}
	>
		<Typography
			sx={{
				fontSize: '11px',
				fontWeight: 700,
				letterSpacing: '0.12em',
				textTransform: 'uppercase',
				color: accent,
			}}
		>
			{label}
		</Typography>

		{open ? (
			<KeyboardArrowUpIcon sx={{ fontSize: 18, color: accent }} />
		) : (
			<KeyboardArrowDownIcon sx={{ fontSize: 18, color: accent }} />
		)}
	</Stack>
);

const Filter = ({ searchFilter, setSearchFilter, initialInput }: FilterType) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [searchText, setSearchText] = useState('');

	const [typeOpen, setTypeOpen] = useState(true);
	const [skinOpen, setSkinOpen] = useState(true);
	const [priceOpen, setPriceOpen] = useState(true);

	const productTypes = Object.values(ProductType);
	const skinTypes = ['ALL', ...Object.values(SkinType)];

	const pushFilter = useCallback(
		async (updated: ProductsInquiry) => {
			await router.push(
				{
					pathname: '/catalog',
					query: { input: JSON.stringify(updated) },
				},
				undefined,
				{ scroll: false },
			);
		},
		[router],
	);

	const handleSearch = async () => {
		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const productTypeSelectHandler = async (e: any) => {
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
	};

	const skinTypeHandler = async (e: any) => {
		const value = e.target.value;
		const checked = e.target.checked;

		let updatedSkinTypes = searchFilter?.search?.typeList || [];

		if (value === 'ALL') {
			updatedSkinTypes = [];
		} else {
			if (checked) updatedSkinTypes = [...updatedSkinTypes, value];
			else updatedSkinTypes = updatedSkinTypes.filter((item: string) => item !== value);
		}

		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, typeList: updatedSkinTypes },
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const priceHandler = async (range: number[]) => {
		const [start, end] = range;

		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, pricesRange: { start, end } },
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const refreshHandler = async () => {
		setSearchText('');
		setSearchFilter(initialInput);
		await pushFilter(initialInput);
	};

	const FilterContent = () => (
		<Stack>
			{/* SEARCH */}
			<Stack mb={2}>
				<OutlinedInput
					value={searchText}
					placeholder="Search cosmetics..."
					onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSearch();
					}}
					endAdornment={
						<IconButton
							onClick={() => {
								setSearchText('');
								setSearchFilter({
									...searchFilter,
									search: { ...searchFilter.search, text: '' },
								});
							}}
						>
							<CancelRoundedIcon fontSize="small" />
						</IconButton>
					}
				/>
			</Stack>

			{/* PRODUCT TYPE */}
			<SectionHeader label="Product Type" open={typeOpen} onToggle={() => setTypeOpen(!typeOpen)} />

			<Collapse in={typeOpen}>
				<Stack pl={1}>
					{productTypes.map((type) => (
						<Stack key={type} direction="row" alignItems="center">
							<Checkbox
								value={type}
								checked={(searchFilter?.search?.typeList || []).includes(type)}
								onChange={productTypeSelectHandler}
							/>
							<Typography>{type}</Typography>
						</Stack>
					))}
				</Stack>
			</Collapse>

			<Divider />

			{/* SKIN TYPE */}
			<SectionHeader label="Skin Type" open={skinOpen} onToggle={() => setSkinOpen(!skinOpen)} />

			<Collapse in={skinOpen}>
				<Stack pl={1}>
					{skinTypes.map((type) => (
						<Stack key={type} direction="row" alignItems="center">
							<Checkbox
								value={type}
								checked={
									type === 'ALL'
										? (searchFilter?.search?.typeList || []).length === 0
										: (searchFilter?.search?.typeList || []).includes(type as SkinType)
								}
								onChange={skinTypeHandler}
							/>
							<Typography>{type}</Typography>
						</Stack>
					))}
				</Stack>
			</Collapse>

			<Divider />

			{/* PRICE */}
			<SectionHeader label="Price" open={priceOpen} onToggle={() => setPriceOpen(!priceOpen)} />

			<Collapse in={priceOpen}>
				<Stack spacing={2} pt={1}>
					<Slider
						value={[searchFilter?.search?.pricesRange?.start ?? 0, searchFilter?.search?.pricesRange?.end ?? 50]}
						min={0}
						max={200}
						onChange={(_, val) => {
							const [start, end] = val as number[];
							setSearchFilter({
								...searchFilter,
								search: { ...searchFilter.search, pricesRange: { start, end } },
							});
						}}
						onChangeCommitted={(_, val) => priceHandler(val as number[])}
						sx={{
							color: accent,
							'& .MuiSlider-thumb': { width: 14, height: 14 },
						}}
					/>
				</Stack>
			</Collapse>

			<Divider />

			{/* RESET */}
			<Stack direction="row" alignItems="center" gap={1} onClick={refreshHandler} sx={{ cursor: 'pointer' }}>
				<RefreshIcon fontSize="small" />
				<Typography fontSize="11px">Reset Filters</Typography>
			</Stack>
		</Stack>
	);

	if (device === 'mobile') {
		return (
			<>
				<Button startIcon={<FilterAltIcon />} onClick={() => setMobileOpen(true)}>
					Filters
				</Button>

				<Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
					<Stack p={3} width={280}>
						<FilterContent />
					</Stack>
				</Drawer>
			</>
		);
	}

	return <FilterContent />;
};

export default Filter;
