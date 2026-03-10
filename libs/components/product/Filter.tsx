import React, { useCallback, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	OutlinedInput,
	IconButton,
	Button,
	Drawer,
	Collapse,
	Slider,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { ProductsInquiry } from '../../types/product/product.input';
import { ProductType, SkinType } from '../../enums/product.enum';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const accent = '#c0392b'; // muted red/coral like the reference

const SectionHeader = ({
	label,
	open,
	onToggle,
	icon,
}: {
	label: string;
	open: boolean;
	onToggle: () => void;
	icon?: React.ReactNode;
}) => (
	<Stack
		direction="row"
		alignItems="center"
		justifyContent="space-between"
		onClick={onToggle}
		sx={{ cursor: 'pointer', py: 0.5 }}
	>
		<Stack direction="row" alignItems="center" gap={0.8}>
			<Typography
				sx={{
					fontSize: '11px',
					fontWeight: 700,
					letterSpacing: '0.12em',
					textTransform: 'uppercase',
					color: accent,
					fontFamily: "'Helvetica Neue', sans-serif",
				}}
			>
				{label}
			</Typography>
			{icon}
		</Stack>
		{open ? (
			<KeyboardArrowUpIcon sx={{ fontSize: 18, color: accent }} />
		) : (
			<KeyboardArrowDownIcon sx={{ fontSize: 18, color: accent }} />
		)}
	</Stack>
);

const StyledCheckboxRow = ({
	label,
	checked,
	value,
	onChange,
}: {
	label: string;
	checked: boolean;
	value: string;
	onChange: (e: any) => void;
}) => (
	<Stack direction="row" alignItems="center" gap={1} sx={{ py: 0.2 }}>
		<Checkbox
			value={value}
			checked={checked}
			onChange={onChange}
			size="small"
			sx={{
				p: 0,
				color: '#ccc',
				'&.Mui-checked': { color: accent },
				'& .MuiSvgIcon-root': { fontSize: 16 },
			}}
		/>
		<Typography
			sx={{
				fontSize: '12.5px',
				color: checked ? '#111' : '#666',
				fontFamily: "'Helvetica Neue', sans-serif",
				fontWeight: checked ? 500 : 400,
				letterSpacing: '0.01em',
			}}
		>
			{label}
		</Typography>
	</Stack>
);

const Divider = () => <Stack sx={{ height: '1px', bgcolor: '#f0f0f0', my: 1.5 }} />;

const Filter = ({ searchFilter, setSearchFilter, initialInput }: FilterType) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchText, setSearchText] = useState<string>('');
	const [mobileOpen, setMobileOpen] = useState(false);
	const [typeOpen, setTypeOpen] = useState(true);
	const [skinOpen, setSkinOpen] = useState(true);
	const [priceOpen, setPriceOpen] = useState(true);
	const [showAllTypes, setShowAllTypes] = useState(false);

	const productTypes = Object.values(ProductType);
	const skinTypes = ['ALL', ...Object.values(SkinType)];
	const visibleTypes = showAllTypes ? productTypes : productTypes.slice(0, 8);

	const pushFilter = async (updatedFilter: ProductsInquiry) => {
		await router.push({ pathname: '/catalog', query: { input: JSON.stringify(updatedFilter) } }, undefined, {
			scroll: false,
		});
	};

	const handleSearch = async () => {
		const updated = { ...searchFilter, page: 1, search: { ...searchFilter.search, text: searchText } };
		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const productTypeSelectHandler = useCallback(
		async (e: any) => {
			const value = e.target.value;
			const checked = e.target.checked;
			let updatedTypes = searchFilter?.search?.typeList || [];
			if (checked) updatedTypes = [...updatedTypes, value];
			else updatedTypes = updatedTypes.filter((item: string) => item !== value);
			const updated = { ...searchFilter, page: 1, search: { ...searchFilter.search, typeList: updatedTypes } };
			setSearchFilter(updated);
			await pushFilter(updated);
		},
		[searchFilter],
	);

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
		const updated = { ...searchFilter, page: 1, search: { ...searchFilter.search, skinTypeList: updatedSkinTypes } };
		setSearchFilter(updated);
		await pushFilter(updated);
	};

	const productPriceHandler = async (value: number, type: 'start' | 'end') => {
		const updated = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, pricesRange: { ...searchFilter.search.pricesRange, [type]: value } },
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
		<Stack spacing={0} sx={{ width: '100%' }}>
			{/* PRODUCT TYPE */}
			<SectionHeader label="Product Type" open={typeOpen} onToggle={() => setTypeOpen(!typeOpen)} />
			<Collapse in={typeOpen}>
				<Stack spacing={0} sx={{ pt: 1, pb: 1.5, pl: 0.5 }}>
					{visibleTypes.map((type) => (
						<StyledCheckboxRow
							key={type}
							label={type}
							value={type}
							checked={(searchFilter?.search?.typeList || []).includes(type)}
							onChange={productTypeSelectHandler}
						/>
					))}
					{productTypes.length > 8 && (
						<Typography
							onClick={() => setShowAllTypes(!showAllTypes)}
							sx={{
								fontSize: '11px',
								color: accent,
								cursor: 'pointer',
								mt: 0.5,
								fontFamily: "'Helvetica Neue', sans-serif",
								'&:hover': { textDecoration: 'underline' },
							}}
						>
							{showAllTypes ? 'show less' : 'show all'}
						</Typography>
					)}
				</Stack>
			</Collapse>

			<Divider />

			{/* SKIN TYPE */}
			<SectionHeader
				label="Skin Type"
				open={skinOpen}
				onToggle={() => setSkinOpen(!skinOpen)}
				icon={<FavoriteBorderIcon sx={{ fontSize: 14, color: accent }} />}
			/>
			<Collapse in={skinOpen}>
				<Stack spacing={0} sx={{ pt: 1, pb: 1.5, pl: 0.5 }}>
					{skinTypes.map((type) => (
						<StyledCheckboxRow
							key={type}
							label={type}
							value={type}
							checked={
								type === 'ALL'
									? (searchFilter?.search?.typeList || []).length === 0
									: (searchFilter?.search?.typeList || []).includes(type as SkinType)
							}
							onChange={skinTypeHandler}
						/>
					))}
				</Stack>
			</Collapse>

			<Divider />

			{/* PRICE */}
			<SectionHeader label="Price" open={priceOpen} onToggle={() => setPriceOpen(!priceOpen)} />
			<Collapse in={priceOpen}>
				<Stack spacing={1.5} sx={{ pt: 1, pb: 1.5 }}>
					{/* Price display */}
					<Stack direction="row" justifyContent="space-between">
						<Typography
							sx={{
								fontSize: '12px',
								color: '#888',
								fontFamily: "'Helvetica Neue', sans-serif",
								border: '1px solid #eee',
								px: 1.5,
								py: 0.5,
								borderRadius: '4px',
								minWidth: 70,
								textAlign: 'center',
							}}
						>
							{searchFilter?.search?.pricesRange?.start ?? 0}.00$
						</Typography>
						<Typography
							sx={{
								fontSize: '12px',
								color: '#888',
								fontFamily: "'Helvetica Neue', sans-serif",
								border: '1px solid #eee',
								px: 1.5,
								py: 0.5,
								borderRadius: '4px',
								minWidth: 70,
								textAlign: 'center',
							}}
						>
							{searchFilter?.search?.pricesRange?.end ?? 50}.00$
						</Typography>
					</Stack>
					{/* Slider */}
					<Slider
						value={[searchFilter?.search?.pricesRange?.start ?? 0, searchFilter?.search?.pricesRange?.end ?? 50]}
						min={0}
						max={200}
						onChange={(_e, val) => {
							const [start, end] = val as number[];
							const updated = {
								...searchFilter,
								page: 1,
								search: { ...searchFilter.search, pricesRange: { start, end } },
							};
							setSearchFilter(updated);
						}}
						onChangeCommitted={(_e, val) => {
							const [start, end] = val as number[];
							productPriceHandler(start, 'start');
							productPriceHandler(end, 'end');
						}}
						sx={{
							color: accent,
							'& .MuiSlider-thumb': {
								width: 14,
								height: 14,
								'&:hover': { boxShadow: `0 0 0 6px ${accent}22` },
							},
							'& .MuiSlider-track': { height: 3 },
							'& .MuiSlider-rail': { height: 3, color: '#e0e0e0' },
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
				sx={{ cursor: 'pointer', pt: 0.5, '&:hover': { opacity: 0.6 } }}
			>
				<RefreshIcon sx={{ fontSize: 14, color: '#aaa' }} />
				<Typography
					sx={{
						fontSize: '11px',
						color: '#aaa',
						letterSpacing: '0.08em',
						fontFamily: "'Helvetica Neue', sans-serif",
						textTransform: 'uppercase',
					}}
				>
					Reset Filters
				</Typography>
			</Stack>
		</Stack>
	);

	if (device === 'mobile') {
		return (
			<>
				<Button
					startIcon={<FilterAltIcon />}
					onClick={() => setMobileOpen(true)}
					variant="outlined"
					fullWidth
					sx={{
						borderColor: accent,
						color: accent,
						fontSize: '11px',
						letterSpacing: '0.1em',
						fontFamily: "'Helvetica Neue', sans-serif",
						'&:hover': { borderColor: accent, bgcolor: `${accent}08` },
					}}
				>
					Filter Products
				</Button>

				<Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
					<Stack spacing={3} p={3} width={280}>
						<Typography
							sx={{
								fontSize: '13px',
								fontWeight: 700,
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
								color: accent,
								fontFamily: "'Helvetica Neue', sans-serif",
							}}
						>
							Filters
						</Typography>
						<FilterContent />
					</Stack>
				</Drawer>
			</>
		);
	}

	return <FilterContent />;
};

export default Filter;
