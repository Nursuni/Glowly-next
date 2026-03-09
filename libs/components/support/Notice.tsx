import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 80);
		return () => clearTimeout(t);
	}, []);

	const data = [
		{ no: 1, event: true, title: 'Register now and enjoy exclusive welcome discounts', date: 'Mar 01, 2024' },
		{
			no: 2,
			event: false,
			title: 'Listing and trading products on our platform is completely free',
			date: 'Mar 31, 2024',
		},
		{ no: 3, event: true, title: 'Spring Beauty Edit — new arrivals added weekly', date: 'Apr 05, 2024' },
		{ no: 4, event: false, title: 'Updated return and refund policy — effective immediately', date: 'Apr 10, 2024' },
	];

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	}

	return (
		<Stack className={`notice-content ${visible ? 'notice-visible' : ''}`} sx={{ pt: 3 }}>
			<Box className={'notice-header'}>
				<Typography className={'notice-title-text'}>Announcements</Typography>
				<Typography className={'notice-subtitle'}>Stay informed with the latest updates</Typography>
			</Box>
			<Stack className={'notice-table'}>
				<Box className={'notice-table-head'}>
					<span className={'col-type'}>Type</span>
					<span className={'col-num'}>#</span>
					<span className={'col-title'}>Title</span>
					<span className={'col-date'}>Date</span>
				</Box>
				<Stack className={'notice-table-body'}>
					{data.map((ele, index) => (
						<Box
							className={`notice-row ${ele?.event ? 'notice-row--event' : ''}`}
							key={ele.title}
							style={{ animationDelay: `${index * 80}ms` }}
						>
							<span className={'col-type'}>
								{ele.event ? (
									<span className={'badge-event'}>Event</span>
								) : (
									<span className={'badge-notice'}>Notice</span>
								)}
							</span>
							<span className={'col-num notice-num'}>{ele.no}</span>
							<span className={'col-title notice-row-title'}>{ele.title}</span>
							<span className={'col-date notice-date'}>{ele.date}</span>
						</Box>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notice;
