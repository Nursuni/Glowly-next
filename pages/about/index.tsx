import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
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
							<img src="/img/banner/header1.svg" alt="" />
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
									<img src="/img/icons/crueltyfree.svg" alt="" />
								</div>
								<span>Cruelty-Free</span>
								<p>We never test on animals. Compassion is part of our philosophy.</p>
							</div>

							<div className={'box'}>
								<div>
									<img src="/img/icons/leaf.svg" alt="" />
								</div>
								<span>Conscious Ingredients</span>
								<p>Skin-loving ingredients selected for purity, safety, and performance.</p>
							</div>

							<div className={'box'}>
								<div>
									<img src="/img/icons/package.svg" alt="" />
								</div>
								<span>Responsible Packaging</span>
								<p>Designed with elegance while minimizing environmental impact.</p>
							</div>

							<div className={'box'}>
								<div>
									<img src="/img/icons/luxury.svg" alt="" />
								</div>
								<span>Clean Performance</span>
								<p>High-efficacy formulas without unnecessary additives.</p>
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
