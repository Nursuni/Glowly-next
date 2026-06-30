import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography } from '@mui/material';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'about-page-mobile'} sx={{ width: '100%', overflowX: 'hidden' }}>
				{/* INTRO MOBILE */}
				<Stack className={'intro-mobile'} sx={{ p: '40px 20px', backgroundColor: '#fff' }} spacing={3}>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 'bold',
							textAlign: 'center',
							lineHeight: 1.2,
							fontFamily: 'serif',
						}}
					>
						We’re on a Mission to Redefine Modern Beauty.
					</Typography>
					<Typography
						sx={{
							textAlign: 'center',
							fontSize: '15px',
							lineHeight: 1.7,
							color: '#666',
						}}
					>
						Glowly was born from a belief that beauty should feel effortless, refined, and empowering. We create premium
						cosmetic essentials designed to enhance your natural glow — not hide it.
						<br />
						<br />
						Our formulas combine innovation with care, blending high-quality ingredients and timeless elegance. Every
						product is crafted to elevate your everyday ritual into a luxurious experience.
					</Typography>

					<Stack className={'boxes-mobile'} spacing={4} sx={{ mt: 2 }}>
						<Box sx={{ textAlign: 'center' }}>
							<Box sx={{ mb: 1 }}>
								<img src="/img/icons/garden.svg" alt="" style={{ width: '45px' }} />
							</Box>
							<Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>
								Luxury Formulas
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Carefully crafted blends designed for radiant, healthy skin.
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'center' }}>
							<Box sx={{ mb: 1 }}>
								<img src="/img/icons/securePayment.svg" alt="" style={{ width: '45px' }} />
							</Box>
							<Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>
								Safe & Trusted
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Dermatologically tested and made with premium ingredients.
							</Typography>
						</Box>
					</Stack>
				</Stack>

				{/* STATISTICS MOBILE */}
				<Stack className={'statistics-mobile'}>
					<Box sx={{ width: '100%', height: '250px' }}>
						<img src="/img/banner/aboutus.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
					</Box>
					<Stack
						direction="row"
						justifyContent="space-around"
						sx={{ py: 4, px: 2, backgroundColor: '#fafafa', textAlign: 'center' }}
					>
						<Box>
							<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
								4M
							</Typography>
							<Typography variant="caption" sx={{ color: '#888' }}>
								Awards
							</Typography>
						</Box>
						<Box>
							<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
								12K
							</Typography>
							<Typography variant="caption" sx={{ color: '#888' }}>
								Products
							</Typography>
						</Box>
						<Box>
							<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
								20M
							</Typography>
							<Typography variant="caption" sx={{ color: '#888' }}>
								Customers
							</Typography>
						</Box>
					</Stack>
				</Stack>

				{/* COMMITMENTS MOBILE */}
				<Stack className={'commitments-mobile'} sx={{ p: '50px 20px' }} spacing={4}>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
							The Glowly Standard
						</Typography>
						<Typography variant="body2" sx={{ color: '#777' }}>
							We believe modern luxury should be beautiful, responsible, and intentional.
						</Typography>
					</Box>

					<Stack spacing={5}>
						{[
							{
								img: 'cruelty_free.png',
								title: 'Cruelty-Free',
								desc: 'We never test on animals. Compassion is part of our philosophy.',
							},
							{
								img: 'ingredients.png',
								title: 'Conscious Ingredients',
								desc: 'Skin-loving ingredients selected for purity, safety, and performance.',
							},
							{
								img: 'package.png',
								title: 'Responsible Packaging',
								desc: 'Designed with elegance while minimizing environmental impact.',
							},
							{
								img: 'dermo_tested.png',
								title: 'Dermatologist Tested',
								desc: 'Developed and tested to ensure safety and effectiveness for all skin types.',
							},
						].map((item, index) => (
							<Stack key={index} alignItems="center" sx={{ textAlign: 'center' }}>
								<Box sx={{ mb: 2 }}>
									<img src={`/img/fiber/${item.img}`} alt={item.title} style={{ width: '60px' }} />
								</Box>
								<Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
									{item.title}
								</Typography>
								<Typography variant="body2" sx={{ color: '#666', px: 2 }}>
									{item.desc}
								</Typography>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'about-page'}>
				{/* INTRO */}
				<Stack className={'intro'}>
					<Stack className={'container'}>
						<Stack className={'left'}>
							<strong>We’re on a Mission to Redefine Modern Beauty.</strong>
						</Stack>
						<Stack className={'right'}>
							<p>
								Glowly was born from a belief that beauty should feel effortless, refined, and empowering. We create
								premium cosmetic essentials designed to enhance your natural glow — not hide it.
								<br />
								<br />
								Our formulas combine innovation with care, blending high-quality ingredients and timeless elegance.
								Every product is crafted to elevate your everyday ritual into a luxurious experience.
							</p>
							<Stack className={'boxes'}>
								<div className={'box'}>
									<div>
										<img src="/img/icons/garden.svg" alt="" />
									</div>
									<span>Luxury Formulas</span>
									<p>Carefully crafted blends designed for radiant, healthy skin.</p>
								</div>
								<div className={'box'}>
									<div>
										<img src="/img/icons/securePayment.svg" alt="" />
									</div>
									<span>Safe & Trusted</span>
									<p>Dermatologically tested and made with premium ingredients.</p>
								</div>
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				{/* STATISTICS */}
				<Stack className={'statistics'}>
					<Stack className={'container'}>
						<Stack className={'banner'}>
							<img src="/img/banner/aboutus.webp" alt="" />
						</Stack>
						<Stack className={'info'}>
							<Box component={'div'}>
								<strong>4M</strong>
								<p>Beauty Awards</p>
							</Box>
							<Box component={'div'}>
								<strong>12K</strong>
								<p>Products Launched</p>
							</Box>
							<Box component={'div'}>
								<strong>20M</strong>
								<p>Happy Customers</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* NEW: GLOWLY COMMITMENTS */}
				<Stack className={'commitments'}>
					<Stack className={'container'}>
						<span className={'title'}>The Glowly Standard</span>
						<p className={'desc'}>We believe modern luxury should be beautiful, responsible, and intentional.</p>

						<Stack className={'boxes'}>
							<div className={'box'}>
								<div>
									<img src="/img/fiber/cruelty_free.png" alt="" />
								</div>
								<span>Cruelty-Free</span>
								<p>We never test on animals. Compassion is part of our philosophy.</p>
							</div>

							<div className={'box'}>
								<div>
									<img src="/img/fiber/ingredients.png" alt="" />
								</div>
								<span>Conscious Ingredients</span>
								<p>Skin-loving ingredients selected for purity, safety, and performance.</p>
							</div>

							<div className={'box'}>
								<div>
									<img src="/img/fiber/package.png" alt="" />
								</div>
								<span>Responsible Packaging</span>
								<p>Designed with elegance while minimizing environmental impact.</p>
							</div>

							<div className={'box'}>
								<div>
									<img src="/img/fiber/dermo_tested.png" alt="Dermatologist tested" />
								</div>
								<span>Dermatologist Tested</span>
								<p>Developed and tested to ensure safety and effectiveness for all skin types.</p>
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
