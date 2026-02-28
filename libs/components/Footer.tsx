import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box className={'footer-box'}>
							<img src="/img/logo/glowlyWhite.svg" alt="Glowly" className={'logo'} />
						</Box>

						<Box className={'footer-box'}>
							<span>Customer Care</span>
							<p>+82 10 4867 2909</p>
						</Box>

						<Box className={'footer-box'}>
							<span>Beauty Support Line</span>
							<p>support@glowly.com</p>
							<span>We’re here for your glow ✨</span>
						</Box>

						<Box className={'footer-box'}>
							<p>Follow Glowly</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>

					<Stack className={'right'}>
						<Box className={'bottom'}>
							<div>
								<strong>Shop</strong>
								<span>Skincare</span>
								<span>Makeup</span>
								<span>Best Sellers</span>
							</div>

							<div>
								<strong>Help</strong>
								<span>Shipping & Returns</span>
								<span>Privacy Policy</span>
								<span>Terms of Service</span>
								<span>FAQs</span>
							</div>

							<div>
								<strong>Discover</strong>
								<span>About Glowly</span>
								<span>Beauty Blog</span>
								<span>New Arrivals</span>
								<span>Glow Tips</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<span>© Glowly Cosmetics {moment().year()} — All rights reserved.</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box className={'footer-box'}>
							<img src="/img/logo/glowlyWhite.svg" alt="Glowly" className={'logo'} />
						</Box>

						<Box className={'footer-box'}>
							<span>Customer Care</span>
							<p>+82 10 4867 2909</p>
						</Box>

						<Box className={'footer-box'}>
							<span>Beauty Support Line</span>
							<p>support@glowly.com</p>
							<span>Glow with confidence ✨</span>
						</Box>

						<Box className={'footer-box'}>
							<p>Follow Glowly</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>

					<Stack className={'right'}>
						<Box className={'top'}>
							<strong>Join Our Beauty Newsletter</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>

						<Box className={'bottom'}>
							<div>
								<strong>Shop</strong>
								<span>Skincare</span>
								<span>Makeup</span>
								<span>Best Sellers</span>
							</div>

							<div>
								<strong>Help</strong>
								<span>Shipping & Returns</span>
								<span>Privacy Policy</span>
								<span>Terms of Service</span>
								<span>FAQs</span>
							</div>

							<div>
								<strong>Discover</strong>
								<span>About Glowly</span>
								<span>Beauty Blog</span>
								<span>New Arrivals</span>
								<span>Glow Tips</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<span>© Glowly Cosmetics {moment().year()} — All rights reserved.</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
