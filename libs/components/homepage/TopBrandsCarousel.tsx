import React from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Member } from '../../types/member/member';
import TopBrandCard from './TopBrandCard';

interface TopBrandsProps {
	brands: Member[];
}

const TopBrandsCarousel = ({ brands }: TopBrandsProps) => {
	return (
		<Stack className="top-brands" sx={{ padding: '50px 0', background: '#f6f6f6' }}>
			<Stack className="container">
				{brands.length > 0 && (
					<Swiper
						slidesPerView="auto"
						spaceBetween={29}
						modules={[Navigation, Pagination, Autoplay]}
						navigation={{
							nextEl: '.swiper-brands-next',
							prevEl: '.swiper-brands-prev',
						}}
					>
						{brands.map((brand) => (
							<SwiperSlide key={brand._id}>
								<TopBrandCard brand={brand} />
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</Stack>
		</Stack>
	);
};

export default TopBrandsCarousel;
