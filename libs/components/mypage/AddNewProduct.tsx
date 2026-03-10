import React, { useState } from 'react';
import { Stack, Typography, Button } from '@mui/material';

type ProductInputWithImages = {
	productTitle: string;
	productPrice: number;
	productType: string;
	productDesc: string;
	productImages: string[];

	volume?: number;
	volumeUnit?: string;
	skinType?: string[];
	productTarget?: string;
	ageRange?: string[];
};

const AddProductPage = () => {
	const [insertProductData, setInsertProductData] = useState<ProductInputWithImages>({
		productTitle: '',
		productPrice: 0,
		productType: '',
		productDesc: '',
		productImages: [],
		volume: 0,
		volumeUnit: 'ML',
		skinType: [],
		productTarget: '',
		ageRange: [],
	});

	const handleSubmit = () => {
		console.log('Product Data:', insertProductData);
		// call your mutation here
	};

	return (
		<div id="add-product-page">
			<Stack spacing={3} sx={{ maxWidth: 600 }}>
				{/* PRODUCT TITLE */}
				<Stack>
					<Typography>Product Title</Typography>
					<input
						type="text"
						value={insertProductData.productTitle}
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								productTitle: e.target.value,
							})
						}
					/>
				</Stack>

				{/* PRODUCT TYPE */}
				<Stack>
					<Typography>Product Type</Typography>
					<select
						value={insertProductData.productType}
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								productType: e.target.value,
							})
						}
					>
						<option value="">Select type</option>
						<option value="cleanser">Cleanser</option>
						<option value="toner">Toner</option>
						<option value="serum">Serum</option>
						<option value="cream">Cream</option>
						<option value="sunscreen">Sunscreen</option>
					</select>
				</Stack>

				{/* PRICE */}
				<Stack>
					<Typography>Price</Typography>
					<input
						type="number"
						value={insertProductData.productPrice}
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								productPrice: Number(e.target.value),
							})
						}
					/>
				</Stack>

				{/* VOLUME */}
				<Stack>
					<Typography>Volume</Typography>

					<Stack direction="row" spacing={2}>
						<input
							type="number"
							placeholder="Amount"
							value={insertProductData.volume}
							onChange={(e) =>
								setInsertProductData({
									...insertProductData,
									volume: Number(e.target.value),
								})
							}
						/>

						<select
							value={insertProductData.volumeUnit}
							onChange={(e) =>
								setInsertProductData({
									...insertProductData,
									volumeUnit: e.target.value,
								})
							}
						>
							<option value="ML">ML</option>
							<option value="G">G</option>
							<option value="OZ">OZ</option>
						</select>
					</Stack>
				</Stack>

				{/* SKIN TYPE */}
				<Stack>
					<Typography>Skin Type</Typography>

					<select
						multiple
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								skinType: Array.from(e.target.selectedOptions, (option) => option.value),
							})
						}
					>
						<option value="oily">Oily</option>
						<option value="dry">Dry</option>
						<option value="combination">Combination</option>
						<option value="sensitive">Sensitive</option>
						<option value="normal">Normal</option>
					</select>
				</Stack>

				{/* TARGET AREA */}
				<Stack>
					<Typography>Target Area</Typography>

					<select
						value={insertProductData.productTarget}
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								productTarget: e.target.value,
							})
						}
					>
						<option value="">Select</option>
						<option value="face">Face</option>
						<option value="body">Body</option>
						<option value="hair">Hair</option>
					</select>
				</Stack>

				{/* AGE RANGE */}
				<Stack>
					<Typography>Age Range</Typography>

					<select
						multiple
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								ageRange: Array.from(e.target.selectedOptions, (option) => option.value),
							})
						}
					>
						<option value="teens">Teens</option>
						<option value="20s">20s</option>
						<option value="30s">30s</option>
						<option value="40s">40+</option>
					</select>
				</Stack>

				{/* DESCRIPTION */}
				<Stack>
					<Typography>Description</Typography>

					<textarea
						rows={4}
						value={insertProductData.productDesc}
						onChange={(e) =>
							setInsertProductData({
								...insertProductData,
								productDesc: e.target.value,
							})
						}
					/>
				</Stack>

				{/* SUBMIT */}
				<Button variant="contained" onClick={handleSubmit}>
					Add Product
				</Button>
			</Stack>
		</div>
	);
};

export default AddProductPage;
