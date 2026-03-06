//You Deserve to Look This Good
import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';

const Advertisement = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'ad-frame'}>
				<img src="/img/banner/adv.jpg" />
			</Stack>
		);
	} else {
		return (
			<Stack className={'ad-frame'}>
				<img src="/img/banner/adv.jpg" />
			</Stack>
		);
	}
};

export default Advertisement;
