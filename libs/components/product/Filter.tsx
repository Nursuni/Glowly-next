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
import { AgeRange, ProductType, SkinType } from '../../enums/product.enum';
import Collapse from '@mui/material/Collapse';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const accent = '#e91e63'; // pink accent
const textSize = '10px';

const Divider = () => <Stack sx={{ height: '1px', bgcolor: '#f5f5f5', my: 1 }} />;

const SectionHeader = ({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) => (
	<Stack
		direction="row"
		justifyContent="space-between"
		alignItems="center"
		onClick={onToggle}
		sx={{ cursor: 'pointer', py: 0.3 }}
	>
		<Typography
			sx={{
				fontSize: textSize,
				fontWeight: 600,
				letterSpacing: '0.08em',
				textTransform: 'uppercase',
				color: accent,
			}}
		>
			{label}
		</Typography>

		{open ? (
			<KeyboardArrowUpIcon sx={{ fontSize: 16, color: accent }} />
		) : (
			<KeyboardArrowDownIcon sx={{ fontSize: 16, color: accent }} />
		)}
	</Stack>
);

const Filter = ({ searchFilter, setSearchFilter, initialInput }: FilterType) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [searchText, setSearchText] = useState(searchFilter?.search?.text || '');

	const [typeOpen, setTypeOpen] = useState(true);
	const [skinOpen, setSkinOpen] = useState(true);
	const [ageOpen, setAgeOpen] = useState(true);
	const [targetOpen, setTargetOpen] = useState(true);
	const [priceOpen, setPriceOpen] = useState(true);

	const productTypes = Object.values(ProductType) as ProductType[];
	const skinTypes: (SkinType | 'ALL')[] = ['ALL', ...(Object.values(SkinType) as SkinType[])];
	const ageRanges = Object.values(AgeRange) as AgeRange[];
	const targets = ['ALL', 'MALE', 'FEMALE', 'UNISEX'];

	const isSkincareSelected = (searchFilter?.search?.productTypeList || []).includes(ProductType.SKINCARE);

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
		const value = e.target.value as ProductType;
		const checked = e.target.checked;

		let updatedTypes = searchFilter?.search?.productTypeList || [];
		if (checked) updatedTypes = [...updatedTypes, value];
		else updatedTypes = updatedTypes.filter((item) => item !== value);

		let updatedSkinTypes = searchFilter?.search?.skinType || [];
		if (!updatedTypes.includes(ProductType.SKINCARE)) updatedSkinTypes = [];

		const updated = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				productTypeList: updatedTypes,
				skinType: updatedSkinTypes,
			},
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const skinTypeHandler = async (e: any) => {
		const value = e.target.value as SkinType | 'ALL';
		const checked = e.target.checked;

		let updatedSkinTypes = searchFilter?.search?.skinType || [];
		if (value === 'ALL') updatedSkinTypes = [];
		else if (checked) updatedSkinTypes = [...updatedSkinTypes, value];
		else updatedSkinTypes = updatedSkinTypes.filter((item) => item !== value);

		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, skinType: updatedSkinTypes },
		};

		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const ageHandler = async (e: any) => {
		const value = e.target.value as AgeRange;
		const checked = e.target.checked;

		let updatedAges = searchFilter?.search?.ageRange || [];
		if (checked) updatedAges = [...updatedAges, value];
		else updatedAges = updatedAges.filter((item) => item !== value);

		const updated = { ...searchFilter, page: 1, search: { ...searchFilter.search, ageRange: updatedAges } };
		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const targetHandler = async (e: any) => {
		const value = e.target.value;
		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, productTarget: value === 'ALL' ? undefined : value },
		};
		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const priceHandler = async (range: number[]) => {
		const [start, end] = range;
		const updated = { ...searchFilter, page: 1, search: { ...searchFilter.search, pricesRange: { start, end } } };
		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const refreshHandler = async () => {
		setSearchText('');
		const reset = {
			...initialInput,
			search: {
				...initialInput.search,
				text: '',
				skinType: [],
				productTypeList: [],
				ageRange: [],
				productTarget: undefined,
				pricesRange: { start: 0, end: 200 },
			},
		};
		setSearchFilter(reset);
		await pushFilter(reset);
	};

	const FilterContent = () => (
		<Stack>
			{/* SEARCH */}
			<Stack mb={1.5}>
				<OutlinedInput
					size="small"
					value={searchText}
					placeholder="Search..."
					onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					sx={{ fontSize: textSize, height: 30, '& input': { p: '4px 8px' } }}
					endAdornment={
						<IconButton
							size="small"
							onClick={() => {
								setSearchText('');
								setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, text: '' } });
							}}
						>
							<CancelRoundedIcon sx={{ fontSize: 16 }} />
						</IconButton>
					}
				/>
			</Stack>

			{/* PRODUCT TYPE */}
			<SectionHeader label="Product Type" open={typeOpen} onToggle={() => setTypeOpen(!typeOpen)} />
			<Collapse in={typeOpen}>
				<Stack pl={0.5}>
					{productTypes.map((type) => (
						<Stack key={type} direction="row" alignItems="center" sx={{ py: 0.2 }}>
							<Checkbox
								size="small"
								sx={{ p: 0.5, '& svg': { fontSize: 16 } }}
								value={type}
								checked={(searchFilter?.search?.productTypeList || []).includes(type)}
								onChange={productTypeSelectHandler}
							/>
							<Typography sx={{ fontSize: textSize }}>{type}</Typography>
						</Stack>
					))}
				</Stack>
			</Collapse>

			{/* SKIN TYPE */}
			{isSkincareSelected && (
				<>
					<Divider />
					<SectionHeader label="Skin Type" open={skinOpen} onToggle={() => setSkinOpen(!skinOpen)} />
					<Collapse in={skinOpen}>
						<Stack pl={0.5}>
							{skinTypes.map((type) => (
								<Stack key={type} direction="row" alignItems="center" sx={{ py: 0.2 }}>
									<Checkbox
										size="small"
										sx={{ p: 0.5, '& svg': { fontSize: 16 } }}
										value={type}
										checked={
											type === 'ALL'
												? (searchFilter?.search?.skinType || []).length === 0
												: (searchFilter?.search?.skinType || []).includes(type as SkinType)
										}
										onChange={skinTypeHandler}
									/>
									<Typography sx={{ fontSize: textSize }}>{type}</Typography>
								</Stack>
							))}
						</Stack>
					</Collapse>
				</>
			)}

			<Divider />

			{/* AGE */}
			<SectionHeader label="Age" open={ageOpen} onToggle={() => setAgeOpen(!ageOpen)} />
			<Collapse in={ageOpen}>
				<Stack pl={0.5}>
					{ageRanges.map((age) => (
						<Stack key={age} direction="row" alignItems="center" sx={{ py: 0.2 }}>
							<Checkbox
								size="small"
								sx={{ p: 0.5, '& svg': { fontSize: 16 } }}
								value={age}
								checked={(searchFilter?.search?.ageRange || []).includes(age)}
								onChange={ageHandler}
							/>
							<Typography sx={{ fontSize: textSize }}>{age}</Typography>
						</Stack>
					))}
				</Stack>
			</Collapse>

			<Divider />

			{/* TARGET */}
			<SectionHeader label="Target" open={targetOpen} onToggle={() => setTargetOpen(!targetOpen)} />
			<Collapse in={targetOpen}>
				<Stack pl={0.5}>
					{targets.map((target) => (
						<Stack key={target} direction="row" alignItems="center" sx={{ py: 0.2 }}>
							<Checkbox
								size="small"
								sx={{ p: 0.5, '& svg': { fontSize: 16 } }}
								value={target}
								checked={
									target === 'ALL'
										? !searchFilter?.search?.productTarget
										: searchFilter?.search?.productTarget === target
								}
								onChange={targetHandler}
							/>
							<Typography sx={{ fontSize: textSize }}>{target}</Typography>
						</Stack>
					))}
				</Stack>
			</Collapse>

			<Divider />

			{/* PRICE */}

			<SectionHeader label="Price" open={priceOpen} onToggle={() => setPriceOpen(!priceOpen)} />
			<Collapse in={priceOpen}>
				<Stack spacing={1} pt={1}>
					{/* Display current price range */}
					<Stack direction="row" justifyContent="space-between" px={1}>
						<Typography sx={{ fontSize: textSize }}>₩{searchFilter?.search?.pricesRange?.start ?? 0}</Typography>
						<Typography sx={{ fontSize: textSize }}>₩{searchFilter?.search?.pricesRange?.end ?? 200}</Typography>
					</Stack>

					<Slider
						size="small"
						value={[searchFilter?.search?.pricesRange?.start ?? 0, searchFilter?.search?.pricesRange?.end ?? 200]}
						min={0}
						max={200000} // example max price in ₩
						step={1000} // step for finer control
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
							'& .MuiSlider-thumb': { width: 12, height: 12 },
							'& .MuiSlider-track': { height: 4 },
							'& .MuiSlider-rail': { height: 4 },
						}}
					/>
				</Stack>
			</Collapse>
			<Divider />

			{/* RESET */}
			<Stack
				direction="row"
				alignItems="center"
				gap={0.5}
				onClick={refreshHandler}
				sx={{ cursor: 'pointer', opacity: 0.8 }}
			>
				<RefreshIcon sx={{ fontSize: 16 }} />
				<Typography sx={{ fontSize: textSize }}>Reset</Typography>
			</Stack>
		</Stack>
	);

	if (device === 'mobile') {
		return (
			<>
				<Button size="small" startIcon={<FilterAltIcon />} onClick={() => setMobileOpen(true)}>
					Filters
				</Button>
				<Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
					<Stack p={2} width={260}>
						<FilterContent />
					</Stack>
				</Drawer>
			</>
		);
	}

	return <FilterContent />;
};

export default Filter;
