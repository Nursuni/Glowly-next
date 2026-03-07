import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/support/Notice';
import Faq from '../../libs/components/support/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Support: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	const changeTabHandler = (tab: string) => {
		router.push({ pathname: '/support', query: { tab } }, undefined, { scroll: false });
	};

	const tab = router.query.tab ?? 'notice';

	if (device === 'mobile') {
		return (
			<Stack className={'support-page'}>
				{/* Hero sits directly on support-page — full viewport width */}
				<Box component={'div'} className={'support-main-info'}>
					<Box component={'div'} className={'info'}>
						<span className={'support-eyebrow'}>Help Center</span>
						<h1 className={'support-heading'}>
							How can we <em>help you?</em>
						</h1>
						<p className={'support-sub'}>Browse answers to your most common questions</p>
					</Box>
					<Box component={'div'} className={'btns'}>
						<button
							className={`tab-btn ${tab === 'notice' ? 'active' : ''}`}
							onClick={() => changeTabHandler('notice')}
						>
							Notice
						</button>
						<button className={`tab-btn ${tab === 'faq' ? 'active' : ''}`} onClick={() => changeTabHandler('faq')}>
							FAQ
						</button>
					</Box>
				</Box>

				{/* Content is inside container for proper centering */}
				<Stack className={'container'}>
					<Box component={'div'} className={'support-content'}>
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
					</Box>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'support-page'}>
			{/* Hero sits directly on support-page — full viewport width */}
			<Box component={'div'} className={'support-main-info'}>
				<Box component={'div'} className={'info'}>
					<span className={'support-eyebrow'}>Help Center</span>
					<h1 className={'support-heading'}>
						How can we <em>help you?</em>
					</h1>
					<p className={'support-sub'}>Browse answers to the most common questions below</p>
				</Box>
				<Box component={'div'} className={'btns'}>
					<button className={`tab-btn ${tab === 'notice' ? 'active' : ''}`} onClick={() => changeTabHandler('notice')}>
						Notice
					</button>
					<button className={`tab-btn ${tab === 'faq' ? 'active' : ''}`} onClick={() => changeTabHandler('faq')}>
						FAQ
					</button>
				</Box>
			</Box>

			{/* Content is inside container for proper centering */}
			<Stack className={'container'}>
				<Box component={'div'} className={'support-content'}>
					{tab === 'notice' && <Notice />}
					{tab === 'faq' && <Faq />}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Support);
