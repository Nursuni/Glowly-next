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
				<Stack className={'agents'}>
					<Stack className={'container'}>
						<span className={'title'}>Meet Our Beauty Experts</span>
						<p className={'desc'}>Passionate professionals behind Glowly’s innovation.</p>
						<Stack className={'wrap'}>
							{/*{[1, 2, 3, 4, 5].map(() => {*/}
							{/*	return <AgentCard />;*/}
							{/*})}*/}
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'options'}>
					<img src="/img/banner/aboutBanner.svg" alt="" className={'about-banner'} />
					<Stack className={'container'}>
						<strong>Discover the Perfect Beauty Routine for You</strong>
						<Stack>
							<div className={'icon-box'}>
								<img src="/img/icons/security.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Skincare Essentials</span>
								<p>Daily formulas designed to nourish, protect, and illuminate your skin.</p>
							</div>
						</Stack>
						<Stack>
							<div className={'icon-box'}>
								<img src="/img/icons/keywording.svg" alt="" />
							</div>
							<div className={'text_-box'}>
								<span>Makeup Collection</span>
								<p>Refined tones and textures for effortless, everyday elegance.</p>
							</div>
						</Stack>
						<Stack>
							<div className={'icon-box'}>
								<img src="/img/icons/investment.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Beauty Innovation</span>
								<p>Advanced research meets modern luxury in every Glowly product.</p>
							</div>
						</Stack>
						<Stack className={'btn'}>
							Explore Glowly
							<img src="/img/icons/rightup.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'partners'}>
					<Stack className={'container'}>
						<span>Trusted by beauty lovers worldwide</span>
						<Stack className={'wrap'}>
							<img src="/img/icons/brands/amazon.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'help'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'left'}>
							<strong>Need beauty advice? Our Glowly experts are here.</strong>
							<p>Discover personalized recommendations tailored to your skin.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'white'}>
								Contact Us
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
							<div className={'black'}>
								<img src="/img/icons/call.svg" alt="" />
								937971971741
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
