import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack } from '@mui/material';

import Advertisement from '../libs/components/homepage/Advertisement';
import TopProducts from '../libs/components/homepage/TopProducts';
import ShopByCategories from '../libs/components/homepage/ShopByCategories';
import AIChat from '../libs/components/AIChat';
import TopBrandsCarousel from '@/libs/components/homepage/TopBrandsCarousel';
import TrendProductCard from '@/libs/components/homepage/TrendProducts';
import Hero from '@/libs/components/homepage/Hero';
import BoardArticles from '@/libs/components/homepage/BoardArticles';
import HomeFeaturesSection from '@/libs/components/homepage/Homefeaturessection';
import SubscribeSection from '@/libs/components/common/SubscribeSection';
import SectionDivider from '@/libs/components/common/SectionDivider';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <Stack className={'home-page'}></Stack>;
	} else {
		return (
			<Stack className={'home-page'}>
				<Hero />
				<SectionDivider variant="dark" />
				<HomeFeaturesSection />
				<ShopByCategories />
				<SectionDivider variant="dark" />
				<TrendProductCard />
				<SectionDivider variant="pink" />

				<TopBrandsCarousel initialInput={undefined} />

				<TopProducts />
				<SectionDivider variant="dark" />

				<Advertisement />

				<BoardArticles />
				<SubscribeSection />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
