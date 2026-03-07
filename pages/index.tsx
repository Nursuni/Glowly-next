import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack } from '@mui/material';

import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import Advertisement from '../libs/components/homepage/Advertisement';
import TopProducts from '../libs/components/homepage/TopProducts';
import ShopByCategories from '../libs/components/homepage/ShopByCategories';
import AIChat from '../libs/components/AIChat';
import TopBrandsCarousel from '@/libs/components/homepage/TopBrandsCarousel';

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
				<TopProducts />
				<TopBrandsCarousel brands={[]} />
				<ShopByCategories />
				<Advertisement />
				<AIChat />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
