import React, { SyntheticEvent, useState, useEffect } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

type FAQItem = {
	id: string;
	subject: string;
	content: string;
};

type FAQData = Record<string, FAQItem[]>;

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	() => ({
		background: 'transparent',
		borderBottom: '1px solid rgba(212, 175, 95, 0.15)',
		'&:before': { display: 'none' },
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<AddRoundedIcon className="expand-icon-add" sx={{ fontSize: '1.2rem', color: '#d4af5f' }} />}
		{...props}
	/>
))(() => ({
	backgroundColor: 'transparent',
	padding: '0 8px',
	minHeight: '70px',
	'& .MuiAccordionSummary-expandIconWrapper': {
		transition: 'all 0.3s ease',
	},
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(0deg)',
		'& .expand-icon-add': { display: 'none' },
	},
	'& .MuiAccordionSummary-content': {
		margin: '16px 0',
	},
}));

const categories = [
	{ key: 'products', label: 'Products', icon: '✦' },
	{ key: 'orders', label: 'Orders', icon: '✦' },
	{ key: 'payment', label: 'Payment', icon: '✦' },
	{ key: 'skincare', label: 'Skincare', icon: '✦' },
	{ key: 'membership', label: 'Membership', icon: '✦' },
	{ key: 'community', label: 'Community', icon: '✦' },
	{ key: 'other', label: 'Other', icon: '✦' },
];

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('products');
	const [expanded, setExpanded] = useState<string | false>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [transitioning, setTransitioning] = useState<boolean>(false);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const changeCategoryHandler = (newCategory: string) => {
		if (newCategory === category) return;
		setTransitioning(true);
		setExpanded(false);
		setTimeout(() => {
			setCategory(newCategory);
			setTransitioning(false);
		}, 250);
	};

	const handleChange = (panel: string) => (_event: SyntheticEvent, newExpanded: boolean) => {
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
	}

	return (
		<Stack className={`faq-content ${visible ? 'faq-visible' : ''}`} sx={{ pt: 3 }}>
			<Box className={'faq-categories'} component={'div'}>
				{categories.map(({ key, label }) => (
					<button
						key={key}
						className={`faq-cat-btn ${category === key ? 'active' : ''}`}
						onClick={() => changeCategoryHandler(key)}
					>
						{label}
					</button>
				))}
			</Box>

			<Box className={`faq-wrap ${transitioning ? 'faq-transitioning' : 'faq-entered'}`} component={'div'}>
				{data[category]?.map((ele: FAQItem, index: number) => (
					<Accordion
						expanded={expanded === ele?.id}
						onChange={handleChange(ele?.id)}
						key={ele?.id}
						className={'faq-accordion'}
						style={{ animationDelay: `${index * 60}ms` }}
					>
						<AccordionSummary className="faq-question" aria-controls={`${ele.id}-content`} id={`${ele.id}-header`}>
							<Typography className="faq-q-text">{ele?.subject}</Typography>
						</AccordionSummary>
						<AccordionDetails className="faq-answer-details">
							<Typography className="faq-a-text">{ele?.content}</Typography>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Stack>
	);
};

export default Faq;
