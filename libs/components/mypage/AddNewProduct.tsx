import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductType, VolumeUnit, SkinType, ProductTarget, IngredientType, AgeRange } from '../../enums/product.enum';
import { NEXT_PUBLIC_API_URL } from '../../config';
import { ProductInput } from '../../types/product/product.input';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_PRODUCT } from '../../../apollo/user/query';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { toastError, toastSuccess } from '@/libs/toast';

// ─── Field visibility helpers ─────────────────────────────────────────────────
// Adjust TOOLS_TYPE to match the exact string value in your ProductType enum
const TOOLS_TYPE = ProductType.TOOLS;

const showsBioFields = (type: string) => type !== '' && type !== TOOLS_TYPE;

// ─── Component ────────────────────────────────────────────────────────────────

const AddProduct = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	const selectedType = (insertProductData.productType as string) ?? '';
	const bioVisible = showsBioFields(selectedType);
	const isTools = selectedType === TOOLS_TYPE;

	/** APOLLO REQUESTS **/
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const { loading: getProductLoading, data: getProductData } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { productId: router.query.productId },
		skip: !router.query.productId,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!getProductData?.getProduct) return;
		const p = getProductData.getProduct;
		setInsertProductData({
			...insertProductData,
			productTitle: p.productTitle ?? '',
			productPrice: p.productPrice ?? 0,
			productType: p.productType ?? '',

			volume: p.volume ?? 0,
			volumeUnit: p.volumeUnit ?? '',
			skinType: p.skinType ?? [],
			productTarget: p.productTarget ?? '',
			ingredientType: p.ingredientType ?? [],
			ageRange: p.ageRange ?? [],
			manufacturedAt: p.manufacturedAt ?? '',
			expiresAt: p.expiresAt ?? '',
			productDesc: p.productDesc ?? '',
			productImages: p.productImages ?? [],
		});
	}, [getProductLoading, getProductData]);

	/** HANDLERS **/
	const set = (field: keyof ProductInput, value: any) => setInsertProductData((prev) => ({ ...prev, [field]: value }));

	const toggleArrayField = (field: keyof ProductInput, value: string) => {
		setInsertProductData((prev) => {
			const current: string[] = (prev[field] as string[]) || [];
			const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
			return { ...prev, [field]: updated };
		});
	};

	// When switching TO Tools, wipe bio fields so they don't pollute the payload
	const handleTypeChange = (value: string) => {
		setInsertProductData((prev) => ({
			...prev,
			productType: value as any,
			...(value === TOOLS_TYPE
				? {
						volume: 0,
						volumeUnit: '',
						skinType: [],
						ingredientType: [],
						ageRange: [],
						manufacturedAt: undefined,
						expiresAt: undefined,
				  }
				: {}),
		}));
	};

	async function uploadImages() {
		try {
			const selectedFiles = inputRef.current.files;
			if (!selectedFiles || selectedFiles.length === 0) return;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			const formData = new FormData();
			const nullFiles = Array(selectedFiles.length).fill(null);

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
					}`,
					variables: { files: nullFiles, target: 'product' },
				}),
			);

			const map: Record<string, string[]> = {};
			for (let i = 0; i < selectedFiles.length; i++) map[i] = [`variables.files.${i}`];
			formData.append('map', JSON.stringify(map));
			for (let i = 0; i < selectedFiles.length; i++) formData.append(`${i}`, selectedFiles[i]);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			setInsertProductData((prev) => ({
				...prev,
				productImages: response.data.data.imagesUploader,
			}));
		} catch (err: any) {
			toastError(err.message);
		}
	}

	// Only title, price, type, description, and images are hard required
	const doDisabledCheck = () => {
		const d = insertProductData;
		return (
			!d.productTitle ||
			d.productPrice <= 0 ||
			!(d.productType as string) ||
			!d.productDesc ||
			d.productImages.length === 0
		);
	};

	const insertProductHandler = useCallback(async () => {
		try {
			await createProduct({ variables: { input: insertProductData } });
			await toastSuccess('Product created successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myProducts' } });
		} catch (err: any) {
			toastError(err);
		}
	}, [insertProductData]);

	const updateProductHandler = useCallback(async () => {
		try {
			// @ts-ignore
			insertProductData._id = getProductData?.getProduct?._id;
			await updateProduct({ variables: { input: insertProductData } });
			await toastSuccess('Product updated successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myProducts' } });
		} catch (err: any) {
			toastError(err);
		}
	}, [insertProductData]);

	if (user?.memberType !== 'BRAND') {
		router.back();
		return null;
	}

	if (device === 'mobile') return <div>ADD NEW PRODUCT MOBILE PAGE</div>;

	return (
		<div id="add-product-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Add New Product</Typography>
				<Typography className="sub-title">We are glad to see you again!</Typography>
			</Stack>

			<div>
				<Stack className="config">
					<Stack className="description-box">
						{/* ── Title (required) ── */}
						<Stack className="config-column">
							<Typography className="title">
								Title <span className="required-star">*</span>
							</Typography>
							<input
								type="text"
								className="description-input"
								placeholder="Product Title"
								value={insertProductData.productTitle}
								onChange={({ target: { value } }) => set('productTitle', value)}
							/>
						</Stack>

						{/* ── Price + Product Type (both required) ── */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">
									Price <span className="required-star">*</span>
								</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Price"
									value={insertProductData.productPrice || ''}
									onChange={({ target: { value } }) => set('productPrice', parseInt(value) || 0)}
								/>
							</Stack>
							<Stack className="price-year-after-price">
								<Typography className="title">
									Product Type <span className="required-star">*</span>
								</Typography>
								<select
									className="select-description"
									value={selectedType || 'select'}
									onChange={({ target: { value } }) => handleTypeChange(value)}
								>
									<option disabled value="select">
										Select
									</option>
									{Object.values(ProductType).map((type) => (
										<option value={type} key={type}>
											{type}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
							</Stack>
						</Stack>

						{/* ══════════════════════════════════════════
						    BIO FIELDS — hidden entirely for Tools
						    ══════════════════════════════════════════ */}
						{bioVisible && (
							<>
								{/* Volume + Volume Unit */}
								<Stack className="config-row">
									<Stack className="price-year-after-price">
										<Typography className="title">
											Volume <span className="optional-label">(optional)</span>
										</Typography>
										<input
											type="number"
											className="description-input"
											placeholder="e.g. 150"
											value={insertProductData.volume || ''}
											onChange={({ target: { value } }) => set('volume', parseFloat(value) || 0)}
										/>
									</Stack>
									<Stack className="price-year-after-price">
										<Typography className="title">
											Volume Unit <span className="optional-label">(optional)</span>
										</Typography>
										<select
											className="select-description"
											value={(insertProductData.volumeUnit as string) || 'none'}
											onChange={({ target: { value } }) => set('volumeUnit', value === 'none' ? '' : value)}
										>
											<option value="none">None</option>
											{Object.values(VolumeUnit).map((unit) => (
												<option value={unit} key={unit}>
													{unit}
												</option>
											))}
										</select>
										<div className="divider" />
										<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
									</Stack>
								</Stack>

								{/* Product Target */}
								<Stack className="config-row">
									<Stack className="price-year-after-price">
										<Typography className="title">
											Product Target <span className="optional-label">(optional)</span>
										</Typography>
										<select
											className="select-description"
											value={(insertProductData.productTarget as string) || 'none'}
											onChange={({ target: { value } }) => set('productTarget', value === 'none' ? '' : value)}
										>
											<option value="none">None</option>
											{Object.values(ProductTarget).map((target) => (
												<option value={target} key={target}>
													{target}
												</option>
											))}
										</select>
										<div className="divider" />
										<img src="/img/icons/Vector.svg" className="arrow-down" alt="" />
									</Stack>
								</Stack>

								{/* Manufactured At + Expires At */}
								<Stack className="config-row">
									<Stack className="price-year-after-price">
										<Typography className="title">
											Manufactured At <span className="optional-label">(optional)</span>
										</Typography>
										<input
											type="date"
											className="description-input"
											value={
												insertProductData.manufacturedAt
													? new Date(insertProductData.manufacturedAt).toISOString().split('T')[0]
													: ''
											}
											onChange={({ target: { value } }) => set('manufacturedAt', value ? new Date(value) : undefined)}
										/>
									</Stack>
									<Stack className="price-year-after-price">
										<Typography className="title">
											Expires At <span className="optional-label">(optional)</span>
										</Typography>
										<input
											type="date"
											className="description-input"
											value={
												insertProductData.expiresAt
													? new Date(insertProductData.expiresAt).toISOString().split('T')[0]
													: ''
											}
											onChange={({ target: { value } }) => set('expiresAt', value ? new Date(value) : undefined)}
										/>
									</Stack>
								</Stack>

								{/* Skin Type — multi-select checkboxes */}
								<Stack className="config-column">
									<Typography className="title">
										Skin Type <span className="optional-label">(optional · choose many)</span>
									</Typography>
									<Stack direction="row" flexWrap="wrap" gap={1.5} mt={0.5}>
										{Object.values(SkinType).map((skin) => (
											<label key={skin} className="checkbox-label">
												<input
													type="checkbox"
													checked={((insertProductData.skinType as string[]) || []).includes(skin)}
													onChange={() => toggleArrayField('skinType', skin)}
												/>
												<span>{skin}</span>
											</label>
										))}
									</Stack>
								</Stack>

								{/* Ingredient Type — multi-select checkboxes */}
								<Stack className="config-column">
									<Typography className="title">
										Ingredient Type <span className="optional-label">(optional · choose many)</span>
									</Typography>
									<Stack direction="row" flexWrap="wrap" gap={1.5} mt={0.5}>
										{Object.values(IngredientType).map((ingredient) => (
											<label key={ingredient} className="checkbox-label">
												<input
													type="checkbox"
													checked={((insertProductData.ingredientType as string[]) || []).includes(ingredient)}
													onChange={() => toggleArrayField('ingredientType', ingredient)}
												/>
												<span>{ingredient}</span>
											</label>
										))}
									</Stack>
								</Stack>

								{/* Age Range — multi-select checkboxes */}
								<Stack className="config-column">
									<Typography className="title">
										Age Range <span className="optional-label">(optional · choose many)</span>
									</Typography>
									<Stack direction="row" flexWrap="wrap" gap={1.5} mt={0.5}>
										{Object.values(AgeRange).map((age) => (
											<label key={age} className="checkbox-label">
												<input
													type="checkbox"
													checked={((insertProductData.ageRange as string[]) || []).includes(age)}
													onChange={() => toggleArrayField('ageRange', age)}
												/>
												<span>{age}</span>
											</label>
										))}
									</Stack>
								</Stack>
							</>
						)}

						{/* Gentle hint when Tools is selected */}
						{isTools && (
							<Stack className="config-column">
								<div className="tools-hint">
									Volume, skin type, ingredients, and age range are not applicable for Tools products.
								</div>
							</Stack>
						)}

						{/* ── Description (required) ── */}
						<Typography className="property-title">Product Description</Typography>
						<Stack className="config-column">
							<Typography className="title">
								Description <span className="required-star">*</span>
							</Typography>
							<textarea
								className="description-text"
								value={insertProductData.productDesc}
								onChange={({ target: { value } }) => set('productDesc', value)}
							/>
						</Stack>
					</Stack>

					{/* ── Image Upload (required) ── */}
					<Typography className="upload-title">
						Upload photos of your product <span className="required-star">*</span>
					</Typography>
					<Stack className="images-box">
						<Stack className="upload-box">
							<svg xmlns="http://www.w3.org/2000/svg" width="121" height="120" viewBox="0 0 121 120" fill="none">
								<g clipPath="url(#clip0_7037_5336)">
									<path
										d="M68.9453 52.0141H52.9703C52.4133 52.0681 51.8511 52.005 51.32 51.8289C50.7888 51.6528 50.3004 51.3675 49.886 50.9914C49.4716 50.6153 49.1405 50.1567 48.9139 49.645C48.6874 49.1333 48.5703 48.5799 48.5703 48.0203C48.5703 47.4607 48.6874 46.9073 48.9139 46.3956C49.1405 45.884 49.4716 45.4253 49.886 45.0492C50.3004 44.6731 50.7888 44.3878 51.32 44.2117C51.8511 44.0356 52.4133 43.9725 52.9703 44.0266H68.9828C69.5397 43.9725 70.1019 44.0356 70.633 44.2117C71.1642 44.3878 71.6527 44.6731 72.067 45.0492C72.4814 45.4253 72.8125 45.884 73.0391 46.3956C73.2657 46.9073 73.3827 47.4607 73.3827 48.0203C73.3827 48.5799 73.2657 49.1333 73.0391 49.645C72.8125 50.1567 72.4814 50.6153 72.067 50.9914C71.6527 51.3675 71.1642 51.6528 70.633 51.8289C70.1019 52.005 69.5397 52.0681 68.9828 52.0141H68.9453Z"
										fill="#DDDDDD"
									/>
									<path
										d="M72.4361 65.0288L63.6236 57.0413C62.8704 56.3994 61.9132 56.0469 60.9236 56.0469C59.934 56.0469 58.9768 56.3994 58.2236 57.0413L49.4111 65.0288C48.6807 65.7585 48.2597 66.7415 48.2355 67.7736C48.2113 68.8057 48.5859 69.8074 49.2813 70.5704C49.9767 71.3335 50.9394 71.7991 51.9693 71.8705C52.9992 71.9419 54.017 71.6136 54.8111 70.9538L56.9111 69.0413V88.0163C57.0074 89.0088 57.4697 89.9298 58.208 90.6C58.9464 91.2701 59.9077 91.6414 60.9048 91.6414C61.9019 91.6414 62.8633 91.2701 63.6016 90.6C64.34 89.9298 64.8023 89.0088 64.8986 88.0163V69.0413L66.9986 70.9538C67.3823 71.3372 67.8398 71.6387 68.3434 71.8403C68.8469 72.0418 69.3861 72.1392 69.9284 72.1265C70.4706 72.1138 71.0046 71.9913 71.4982 71.7664C71.9918 71.5415 72.4346 71.2188 72.8 70.8179C73.1653 70.417 73.4456 69.9463 73.6239 69.434C73.8022 68.9217 73.8748 68.3786 73.8373 67.8375C73.7997 67.2965 73.6529 66.7686 73.4056 66.2858C73.1584 65.8031 72.8158 65.3755 72.3986 65.0288H72.4361Z"
										fill="#DDDDDD"
									/>
									<path
										d="M100.975 120.003C100.418 120.057 99.8558 119.994 99.3247 119.818C98.7935 119.642 98.3051 119.357 97.8907 118.98C97.4763 118.604 97.1452 118.146 96.9186 117.634C96.6921 117.122 96.575 116.569 96.575 116.009C96.575 115.45 96.6921 114.896 96.9186 114.385C97.1452 113.873 97.4763 113.414 97.8907 113.038C98.3051 112.662 98.7935 112.377 99.3247 112.201C99.8558 112.025 100.418 111.962 100.975 112.016C104.158 112.016 107.21 110.751 109.46 108.501C111.711 106.25 112.975 103.198 112.975 100.016V19.9906C112.975 16.808 111.711 13.7558 109.46 11.5053C107.21 9.25491 104.158 7.99063 100.975 7.99063H36.9624C36.4055 8.04466 35.8433 7.98159 35.3122 7.80547C34.781 7.62935 34.2926 7.34408 33.8782 6.96797C33.4638 6.59186 33.1327 6.13324 32.9061 5.62156C32.6796 5.10989 32.5625 4.55648 32.5625 3.99688C32.5625 3.43728 32.6796 2.88386 32.9061 2.37219C33.1327 1.86051 33.4638 1.40189 33.8782 1.02578C34.2926 0.649674 34.781 0.364397 35.3122 0.188277C35.8433 0.0121578 36.4055 -0.05091 36.9624 0.00312538H100.975C106.273 0.0130374 111.351 2.12204 115.097 5.86828C118.844 9.61451 120.953 14.6927 120.962 19.9906V100.016C120.953 105.314 118.844 110.392 115.097 114.138C111.351 117.884 106.273 119.993 100.975 120.003Z"
										fill="#DDDDDD"
									/>
									<path
										d="M84.9609 120.003H20.9484C15.6505 119.993 10.5723 117.884 6.82609 114.138C3.07985 110.392 0.97085 105.314 0.960938 100.016L0.960938 19.9906C0.97085 14.6927 3.07985 9.61451 6.82609 5.86828C10.5723 2.12204 15.6505 0.0130374 20.9484 0.00312538C21.5054 -0.05091 22.0676 0.0121578 22.5987 0.188277C23.1299 0.364397 23.6183 0.649674 24.0327 1.02578C24.4471 1.40189 24.7782 1.86051 25.0047 2.37219C25.2313 2.88386 25.3484 3.43728 25.3484 3.99688C25.3484 4.55648 25.2313 5.10989 25.0047 5.62156C24.7782 6.13324 24.4471 6.59186 24.0327 6.96797C23.6183 7.34408 23.1299 7.62935 22.5987 7.80547C22.0676 7.98159 21.5054 8.04466 20.9484 7.99063C17.7658 7.99063 14.7136 9.25491 12.4632 11.5053C10.2127 13.7558 8.94844 16.808 8.94844 19.9906V100.016C8.94844 103.198 10.2127 106.25 12.4632 108.501C14.7136 110.751 17.7658 112.016 20.9484 112.016H84.9609C85.5179 111.962 86.08 112.025 86.6112 112.201C87.1424 112.377 87.6308 112.662 88.0452 113.038C88.4595 113.414 88.7907 113.873 89.0172 114.385C89.2438 114.896 89.3609 115.45 89.3609 116.009C89.3609 116.569 89.2438 117.122 89.0172 117.634C88.7907 118.146 88.4595 118.604 88.0452 118.98C87.6308 119.357 87.1424 119.642 86.6112 119.818C86.08 119.994 85.5179 120.057 84.9609 120.003Z"
										fill="#DDDDDD"
									/>
								</g>
								<defs>
									<clipPath id="clip0_7037_5336">
										<rect width="120" height="120" fill="white" transform="translate(0.960938)" />
									</clipPath>
								</defs>
							</svg>
							<Stack className="text-box">
								<Typography className="drag-title">Drag and drop images here</Typography>
								<Typography className="format-title">JPEG or PNG, at least 2048×768</Typography>
							</Stack>
							<Button className="browse-button" onClick={() => inputRef.current.click()}>
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
									<g clipPath="url(#clip0_7309_3249)">
										<path
											d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
											fill="#181A20"
										/>
									</g>
									<defs>
										<clipPath id="clip0_7309_3249">
											<rect width="16" height="16" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</Button>
						</Stack>

						<Stack className="gallery-box">
							{insertProductData?.productImages.map((image: string) => (
								<Stack className="image-box" key={image}>
									<img src={`${NEXT_PUBLIC_API_URL}/${image}`} alt="" />
								</Stack>
							))}
						</Stack>
					</Stack>

					<Stack className="buttons-row">
						{router.query.productId ? (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={updateProductHandler}>
								<Typography className="next-button-text">Save</Typography>
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

AddProduct.defaultProps = {
	initialValues: {
		productTitle: '',
		productPrice: 0,
		productType: '',

		volume: 0,
		volumeUnit: '',
		skinType: [],
		productTarget: '',
		ingredientType: [],
		ageRange: [],
		manufacturedAt: undefined,
		expiresAt: undefined,
		productDesc: '',
		productImages: [],
	},
};

export default AddProduct;
