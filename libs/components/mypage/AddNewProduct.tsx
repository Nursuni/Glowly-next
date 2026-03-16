import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import axios from 'axios';

import { CREATE_PRODUCT, UPDATE_PRODUCT } from '@/apollo/user/mutation';
import { GET_PRODUCT } from '@/apollo/user/query';
import { getJwtToken } from '@/libs/auth';
import { toastError, toastSuccess } from '@/libs/toast';
import { REACT_APP_API_URL } from '@/libs/config';

// ── import real enums from your schema ───────────────────────────────────────
import {
	ProductType,
	VolumeUnit,
	DiscountType,
	SkinType,
	ProductTarget,
	IngredientType,
	AgeRange,
} from '@/libs/enums/product.enum';

// ── derive option arrays directly from enums ─────────────────────────────────
const PRODUCT_TYPES = Object.values(ProductType);
const VOLUME_UNITS = Object.values(VolumeUnit);
const DISCOUNT_TYPES = Object.values(DiscountType);
const SKIN_TYPES = Object.values(SkinType);
const PRODUCT_TARGETS = Object.values(ProductTarget);
const INGREDIENT_TYPES = Object.values(IngredientType);
const AGE_RANGES = Object.values(AgeRange);

/* ---------- types — match schema exactly ---------- */
type Variant = {
	name: string;
	hexCode: string;
	images: string[]; // ✅ present in VariantSchema
	price: number;
	sku: string;
	isActive: boolean;
};

type ProductInput = {
	productTitle: string;
	productPrice: number;
	productType: string;
	productDesc: string;
	productImages: string[];
	volume: number;
	volumeUnit: string;
	skinType: string[];
	productTarget: string;
	ageRange: string[];
	discountType: string;
	discountValue: number;
	ingredientType: string[];
	variants: Variant[];
};

const DEFAULT_VALUES: ProductInput = {
	productTitle: '',
	productPrice: 0,
	productType: '',
	productDesc: '',
	productImages: [],
	volume: 0,
	volumeUnit: VolumeUnit.ML, // ✅ enum default
	skinType: [],
	productTarget: '',
	ageRange: [],
	discountType: '',
	discountValue: 0,
	ingredientType: [],
	variants: [],
};

const EMPTY_VARIANT: Variant = {
	name: '',
	hexCode: '#ffffff',
	images: [], // ✅ schema field
	price: 0,
	sku: '',
	isActive: true,
};

/* ================================================================== */
const AddProductPage = ({ initialValues }: { initialValues?: ProductInput }) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const token = getJwtToken();

	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues ?? DEFAULT_VALUES);

	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const { loading: getProductLoading, data: getProductData } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: router.query.productId },
		skip: !router.query.productId,
	});

	/* ── populate form when editing ── */
	useEffect(() => {
		const p = getProductData?.getProduct;
		if (!p) return;
		setInsertProductData({
			productTitle: p.productTitle ?? '',
			productPrice: p.productPrice ?? 0,
			productType: p.productType ?? '',
			productDesc: p.productDesc ?? '',
			productImages: p.productImages ?? [],
			volume: p.volume ?? 0,
			volumeUnit: p.volumeUnit ?? VolumeUnit.ML,
			skinType: p.skinType ?? [],
			productTarget: p.productTarget ?? '',
			ageRange: p.ageRange ?? [],
			discountType: p.discountType ?? '',
			discountValue: p.discountValue ?? 0,
			ingredientType: p.ingredientType ?? [],
			variants: p.variants ?? [],
		});
	}, [getProductLoading, getProductData]);

	/* ── helpers ── */
	const set = (field: keyof ProductInput, value: unknown) =>
		setInsertProductData((prev) => ({ ...prev, [field]: value }));

	const doDisabledCheck = (): boolean =>
		!insertProductData.productTitle ||
		insertProductData.productPrice === 0 ||
		!insertProductData.productType ||
		!insertProductData.productDesc ||
		insertProductData.productImages.length === 0;

	const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof ProductInput) =>
		set(
			field,
			Array.from(e.target.selectedOptions, (o) => o.value),
		);

	/* ── image upload ── */
	const uploadImages = async () => {
		try {
			if (!inputRef.current?.files) return;
			const selectedFiles = Array.from(inputRef.current.files);
			if (selectedFiles.length === 0) return;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			const count = selectedFiles.length;

			// ✅ dynamic nulls — only as many as files selected
			const nullFiles = Array(count).fill(null);

			// ✅ dynamic map — only map the slots that exist
			const map: Record<string, string[]> = {};
			selectedFiles.forEach((_, i) => {
				map[String(i)] = [`variables.files.${i}`];
			});

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
					imagesUploader(files: $files, target: $target)
				}`,
					variables: { files: nullFiles, target: 'product' },
				}),
			);
			formData.append('map', JSON.stringify(map));

			// ✅ append only the actual files
			selectedFiles.forEach((file, i) => formData.append(String(i), file));

			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': 'true',
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages: string[] = response.data.data.imagesUploader;
			set('productImages', responseImages);
			toastSuccess('Images uploaded successfully.');
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Upload failed';
			await toastError(message);
		}
	};

	/* ── variant helpers ── */
	const addVariant = () =>
		setInsertProductData((prev) => ({
			...prev,
			variants: [...prev.variants, { ...EMPTY_VARIANT }],
		}));

	const removeVariant = (idx: number) =>
		setInsertProductData((prev) => ({
			...prev,
			variants: prev.variants.filter((_, i) => i !== idx),
		}));

	const updateVariant = (idx: number, field: keyof Variant, value: string | number | boolean | string[]) =>
		setInsertProductData((prev) => {
			const updated = [...prev.variants];
			updated[idx] = { ...updated[idx], [field]: value };
			return { ...prev, variants: updated };
		});

	/* ── submit ── */
	const insertProductHandler = useCallback(async () => {
		try {
			await createProduct({ variables: { input: insertProductData } });
			await toastSuccess('Product has been created successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myProducts' } });
		} catch (err) {
			toastError(err);
		}
	}, [insertProductData]);

	const updateProductHandler = useCallback(async () => {
		try {
			const id = getProductData?.getProduct?._id;
			await updateProduct({
				variables: { input: { ...insertProductData, _id: id } },
			});
			await toastSuccess('Product has been updated successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myProducts' } });
		} catch (err) {
			toastError(err);
		}
	}, [insertProductData, getProductData]);

	const isEditMode = !!router.query.productId;

	/* ================================================================ */
	return (
		<div id="add-product-page">
			<Stack className="main-title-box">
				<Typography className="main-title">{isEditMode ? 'Edit Product' : 'Add New Product'}</Typography>
				<Typography className="sub-title">We are glad to see you again!</Typography>
			</Stack>

			<div>
				<Stack className="config">
					<Stack className="description-box">
						{/* ── TITLE ── */}
						<Stack className="config-column">
							<Typography className="title">Title *</Typography>
							<input
								type="text"
								className="description-input"
								placeholder="Product Title"
								value={insertProductData.productTitle}
								onChange={(e) => set('productTitle', e.target.value)}
							/>
						</Stack>

						{/* ── PRICE + TYPE ── */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Price *</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Price"
									value={insertProductData.productPrice}
									onChange={(e) => set('productPrice', Number(e.target.value))}
								/>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Product Type *</Typography>
								<select
									className="select-description"
									value={insertProductData.productType || 'select'}
									onChange={(e) => set('productType', e.target.value)}
								>
									<option value="select" disabled>
										Select
									</option>
									{PRODUCT_TYPES.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
							</Stack>
						</Stack>

						{/* ── VOLUME + UNIT ── */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Volume</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Amount"
									value={insertProductData.volume}
									onChange={(e) => set('volume', Number(e.target.value))}
								/>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Unit</Typography>
								<select
									className="select-description"
									value={insertProductData.volumeUnit}
									onChange={(e) => set('volumeUnit', e.target.value)}
								>
									{VOLUME_UNITS.map((u) => (
										<option key={u} value={u}>
											{u}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
							</Stack>
						</Stack>

						{/* ── DISCOUNT TYPE + VALUE ── */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Discount Type</Typography>
								<select
									className="select-description"
									value={insertProductData.discountType || 'none'}
									onChange={(e) => set('discountType', e.target.value === 'none' ? '' : e.target.value)}
								>
									<option value="none">None</option>
									{DISCOUNT_TYPES.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
							</Stack>

							{insertProductData.discountType && (
								<Stack className="price-year-after-price">
									<Typography className="title">Discount Value</Typography>
									<input
										type="number"
										className="description-input"
										placeholder="Value"
										value={insertProductData.discountValue}
										onChange={(e) => set('discountValue', Number(e.target.value))}
									/>
								</Stack>
							)}
						</Stack>

						{/* ── SKIN TYPE + TARGET ── */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Skin Type (hold Ctrl to multi-select)</Typography>
								<select
									className="select-description"
									multiple
									value={insertProductData.skinType}
									onChange={(e) => handleMultiSelect(e, 'skinType')}
								>
									{SKIN_TYPES.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Target Area</Typography>
								<select
									className="select-description"
									value={insertProductData.productTarget || 'select'}
									onChange={(e) => set('productTarget', e.target.value)}
								>
									<option value="select" disabled>
										Select
									</option>
									{PRODUCT_TARGETS.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
							</Stack>
						</Stack>

						{/* ── INGREDIENT TYPE + AGE RANGE ── */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Ingredient Type (hold Ctrl to multi-select)</Typography>
								<select
									className="select-description"
									multiple
									value={insertProductData.ingredientType}
									onChange={(e) => handleMultiSelect(e, 'ingredientType')}
								>
									{INGREDIENT_TYPES.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Age Range (hold Ctrl to multi-select)</Typography>
								<select
									className="select-description"
									multiple
									value={insertProductData.ageRange}
									onChange={(e) => handleMultiSelect(e, 'ageRange')}
								>
									{AGE_RANGES.map((a) => (
										<option key={a} value={a}>
											{a}
										</option>
									))}
								</select>
							</Stack>
						</Stack>

						{/* ── DESCRIPTION ── */}
						<Stack className="config-column">
							<Typography className="title">Description *</Typography>
							<textarea
								className="description-text"
								rows={4}
								value={insertProductData.productDesc}
								onChange={(e) => set('productDesc', e.target.value)}
							/>
						</Stack>
					</Stack>

					{/* ── IMAGE UPLOAD ── */}
					<Typography className="upload-title">Upload photos of your product</Typography>
					<Stack className="images-box">
						<Stack className="upload-box">
							<svg xmlns="http://www.w3.org/2000/svg" width="121" height="120" viewBox="0 0 121 120" fill="none">
								<g clipPath="url(#clip_product_upload)">
									<path
										d="M68.9453 52.0141H52.9703C52.4133 52.0681 51.8511 52.005 51.32 51.8289C50.7888 51.6528 50.3004 51.3675 49.886 50.9914C49.4716 50.6153 49.1405 50.1567 48.9139 49.645C48.6874 49.1333 48.5703 48.5799 48.5703 48.0203C48.5703 47.4607 48.6874 46.9073 48.9139 46.3956C49.1405 45.884 49.4716 45.4253 49.886 45.0492C50.3004 44.6731 50.7888 44.3878 51.32 44.2117C51.8511 44.0356 52.4133 43.9725 52.9703 44.0266H68.9828C69.5397 43.9725 70.1019 44.0356 70.633 44.2117C71.1642 44.3878 71.6527 44.6731 72.067 45.0492C72.4814 45.4253 72.8125 45.884 73.0391 46.3956C73.2657 46.9073 73.3827 47.4607 73.3827 48.0203C73.3827 48.5799 73.2657 49.1333 73.0391 49.645C72.8125 50.1567 72.4814 50.6153 72.067 50.9914C71.6527 51.3675 71.1642 51.6528 70.633 51.8289C70.1019 52.005 69.5397 52.0681 68.9828 52.0141H68.9453Z"
										fill="#DDDDDD"
									/>
									<path
										d="M72.4361 65.0288L63.6236 57.0413C62.8704 56.3994 61.9132 56.0469 60.9236 56.0469C59.934 56.0469 58.9768 56.3994 58.2236 57.0413L49.4111 65.0288C48.6807 65.7585 48.2597 66.7415 48.2355 67.7736C48.2113 68.8057 48.5859 69.8074 49.2813 70.5704C49.9767 71.3335 50.9394 71.7991 51.9693 71.8705C52.9992 71.9419 54.017 71.6136 54.8111 70.9538L56.9111 69.0413V88.0163C57.0074 89.0088 57.4697 89.9298 58.208 90.6C58.9464 91.2701 59.9077 91.6414 60.9048 91.6414C61.9019 91.6414 62.8633 91.2701 63.6016 90.6C64.34 89.9298 64.8023 89.0088 64.8986 88.0163V69.0413L66.9986 70.9538C67.3823 71.3372 67.8398 71.6387 68.3434 71.8403C68.8469 72.0418 69.3861 72.1392 69.9284 72.1265C70.4706 72.1138 71.0046 71.9913 71.4982 71.7664C71.9918 71.5415 72.4346 71.2188 72.8 70.8179C73.1653 70.417 73.4456 69.9463 73.6239 69.434C73.8022 68.9217 73.8748 68.3786 73.8373 67.8375C73.7997 67.2965 73.6529 66.7686 73.4056 66.2858C73.1584 65.8031 72.8158 65.3755 72.3986 65.0288H72.4361Z"
										fill="#DDDDDD"
									/>
								</g>
								<defs>
									<clipPath id="clip_product_upload">
										<rect width="120" height="120" fill="white" transform="translate(0.960938)" />
									</clipPath>
								</defs>
							</svg>

							<Stack className="text-box">
								<Typography className="drag-title">Drag and drop images here</Typography>
								<Typography className="format-title">
									Photos must be JPEG or PNG format and at least 2048x768
								</Typography>
							</Stack>

							<Button className="browse-button" onClick={() => inputRef.current?.click()}>
								<Typography className="browse-button-text">Browse Files</Typography>
								<input
									ref={inputRef}
									type="file"
									hidden
									onChange={uploadImages}
									multiple
									accept="image/jpg, image/jpeg, image/png"
								/>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<g clipPath="url(#clip_browse_arrow)">
										<path
											d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
											fill="#181A20"
										/>
									</g>
									<defs>
										<clipPath id="clip_browse_arrow">
											<rect width="16" height="16" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</Button>
						</Stack>

						{/* ── gallery ── */}
						<Stack className="gallery-box">
							{insertProductData.productImages.map((image: string, idx: number) => (
								<Stack key={idx} className="image-box">
									<img src={`${REACT_APP_API_URL}/${image}`} alt={`product-img-${idx}`} />
								</Stack>
							))}
						</Stack>
					</Stack>

					{/* ── submit ── */}
					<Stack className="buttons-row">
						{isEditMode ? (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={updateProductHandler}>
								<Typography className="next-button-text">Save Changes</Typography>
							</Button>
						) : (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={insertProductHandler}>
								<Typography className="next-button-text">Save</Typography>
							</Button>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default AddProductPage;
