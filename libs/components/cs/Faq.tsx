import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

type FAQItem = {
	id: string;
	subject: string;
	content: string;
};

type FAQData = Record<string, FAQItem[]>;
const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('products');
	const [expanded, setExpanded] = useState<string | false>(false);

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/

	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: FAQData = {
		products: [
			{
				id: 'c001',
				subject: 'Are your cosmetics products authentic?',
				content:
					'Yes, all products sold on our website are 100% authentic and sourced directly from official brands and certified distributors.',
			},
			{
				id: 'c002',
				subject: 'Are your products suitable for sensitive skin?',
				content:
					'Many of our products are formulated for sensitive skin. Please check the ingredient list and product description before purchasing.',
			},
			{
				id: 'c003',
				subject: 'How do I choose the right skincare product?',
				content:
					'Identify your skin type (dry, oily, combination, or sensitive) and choose products designed specifically for your needs.',
			},
			{
				id: 'c004',
				subject: 'Do you sell cruelty-free cosmetics?',
				content: 'Yes, we offer a wide selection of cruelty-free and vegan beauty products.',
			},
			{
				id: 'c005',
				subject: 'How should I store cosmetic products?',
				content: 'Store products in a cool, dry place away from direct sunlight to maintain quality and effectiveness.',
			},
		],

		orders: [
			{
				id: 'c006',
				subject: 'How can I place an order?',
				content: 'Simply add items to your cart and proceed to checkout using our secure payment system.',
			},
			{
				id: 'c007',
				subject: 'Can I cancel my order?',
				content: 'Orders can be canceled before shipment. Please contact customer support as soon as possible.',
			},
			{
				id: 'c008',
				subject: 'How long does delivery take?',
				content: 'Delivery typically takes 2–5 business days depending on your location.',
			},
			{
				id: 'c009',
				subject: 'Do you offer international shipping?',
				content: 'Yes, international shipping is available to selected countries.',
			},
		],

		payment: [
			{
				id: 'c010',
				subject: 'What payment methods do you accept?',
				content: 'We accept credit cards, debit cards, and secure online payment services.',
			},
			{
				id: 'c011',
				subject: 'Is my payment information secure?',
				content: 'Yes, we use encrypted payment gateways to ensure your information remains safe.',
			},
			{
				id: 'c012',
				subject: 'Do you offer refunds?',
				content: 'Refunds are available for damaged or incorrect items according to our refund policy.',
			},
		],

		skincare: [
			{
				id: 'c013',
				subject: 'What is the correct skincare routine order?',
				content: 'Cleanser → Toner → Serum → Moisturizer → Sunscreen (morning only).',
			},
			{
				id: 'c014',
				subject: 'How often should I exfoliate?',
				content: '2–3 times per week depending on your skin sensitivity.',
			},
			{
				id: 'c015',
				subject: 'Do I need sunscreen every day?',
				content: 'Yes, sunscreen should be applied daily to protect your skin from UV damage.',
			},
		],

		membership: [
			{
				id: 'c016',
				subject: 'Do you have a loyalty program?',
				content: 'Yes, members earn points for every purchase which can be redeemed for discounts.',
			},
			{
				id: 'c017',
				subject: 'Is membership free?',
				content: 'Yes, creating an account and joining our loyalty program is completely free.',
			},
		],

		community: [
			{
				id: 'c018',
				subject: 'Can I leave product reviews?',
				content: 'Yes, customers can share reviews and beauty experiences after purchasing products.',
			},
			{
				id: 'c019',
				subject: 'How do you manage inappropriate comments?',
				content: 'Our moderators review reports and remove content that violates community guidelines.',
			},
		],

		other: [
			{
				id: 'c020',
				subject: 'Do you collaborate with beauty influencers?',
				content: 'Yes, we occasionally collaborate with influencers and beauty creators.',
			},
			{
				id: 'c021',
				subject: 'How can I contact customer support?',
				content: 'You can contact us via email or live chat through our support page.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div className={category === 'products' ? 'active' : ''} onClick={() => changeCategoryHandler('products')}>
						Products
					</div>
					<div onClick={() => changeCategoryHandler('orders')}>Orders</div>
					<div onClick={() => changeCategoryHandler('payment')}>Payment</div>
					<div onClick={() => changeCategoryHandler('skincare')}>Skincare</div>
					<div onClick={() => changeCategoryHandler('membership')}>Membership</div>
					<div onClick={() => changeCategoryHandler('community')}>Community</div>
					<div onClick={() => changeCategoryHandler('other')}>Other</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: FAQItem) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
