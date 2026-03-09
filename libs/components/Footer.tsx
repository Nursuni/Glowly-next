import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

const BADGES = [
	{ icon: '🌿', title: 'Cruelty-Free', sub: 'Certified brands only' },
	{ icon: '🚚', title: 'Free Shipping', sub: 'On orders over ₩80,000' },
	{ icon: '📍', title: 'South Korea', sub: 'Worldwide delivery' },
	{ icon: '💬', title: 'Expert Support', sub: '7 days · 9 am – 9 pm' },
];

const Footer = () => {
	const device = useDeviceDetect();
	const containerRef = useRef<HTMLDivElement>(null);

	/* scroll fade-in */
	useEffect(() => {
		const root = containerRef.current;
		if (!root) return;
		const targets = root.querySelectorAll<HTMLElement>('.gf-fade');
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add('gf-visible');
						observer.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.15 },
		);
		targets.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);

	/* ─── MOBILE ─── */
	if (device === 'mobile') {
		return (
			<Stack className={'footer-container'} ref={containerRef}>
				<Stack className={'main'}>
					<Stack className={'left gf-fade'}>
						<Box className={'footer-box logo-box'}>
							<img src="/img/logo/Glowly.svg" alt="Glowly" className={'logo'} />
						</Box>
						<p className={'tagline'}>Curated beauty from the world's finest brands — crafted for the skin you're in.</p>
						<Box className={'footer-box'}>
							<span>Customer Care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box className={'footer-box'}>
							<span>Beauty Support</span>
							<p>support@glowly.com</p>
						</Box>
						<Box className={'footer-box'}>
							<span>Follow Glowly</span>
							<div className={'media-box'}>
								<a href="#">
									<FacebookOutlinedIcon />
								</a>
								<a href="#">
									<TelegramIcon />
								</a>
								<a href="#">
									<InstagramIcon />
								</a>
								<a href="#">
									<TwitterIcon />
								</a>
							</div>
						</Box>
					</Stack>

					<Stack className={'right gf-fade'}>
						<Box className={'bottom'}>
							<div>
								<strong>Shop</strong>
								<span>Skincare</span>
								<span>Makeup</span>
								<span>Best Brands</span>
								<span>New Arrivals</span>
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
								<span>Glow Tips</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<span>© Glowly Cosmetics {dayjs().year()}</span>
				</Stack>
			</Stack>
		);
	}

	/* ─── DESKTOP ─── */
	return (
		<Stack className={'footer-container'} ref={containerRef as any}>
			<Stack className={'main'}>
				{/* LEFT */}
				<Stack className={'left gf-fade'}>
					<Box className={'footer-box logo-box'}>
						<img src="/img/logo/Glowly.svg" alt="Glowly" className={'logo'} />
					</Box>
					<p className={'tagline'}>
						Curated beauty from the world's finest brands —<br />
						crafted for the skin you're in.
					</p>
					<div className={'contact-group'}>
						<Box className={'footer-box'}>
							<span>Customer Care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box className={'footer-box'}>
							<span>Beauty Support</span>
							<p>support@glowly.com</p>
						</Box>
					</div>
					<Box className={'footer-box'}>
						<span>Follow Glowly</span>
						<div className={'media-box'}>
							<a href="#">
								<FacebookOutlinedIcon />
							</a>
							<a href="#">
								<TelegramIcon />
							</a>
							<a href="#">
								<InstagramIcon />
							</a>
							<a href="#">
								<TwitterIcon />
							</a>
						</div>
					</Box>
				</Stack>

				<div className={'vdivider'} />

				{/* RIGHT */}
				<Stack className={'right gf-fade'}>
					<Box className={'top'}>
						<p className={'newsletter-label'}>Beauty Insider</p>
						<strong>
							Unlock <em>early access</em>, new arrivals & glow tips.
						</strong>
						<div className={'input-row'}>
							<input type="email" placeholder={'Your email address'} />
							<span>Subscribe</span>
						</div>
					</Box>
					<Box className={'bottom'}>
						<div>
							<strong>Shop</strong>
							<span>Skincare</span>
							<span>Makeup</span>
							<span>Best Brands</span>
							<span>New Arrivals</span>
						</div>
						<div>
							<strong>Discover</strong>
							<span>About Glowly</span>
							<span>Beauty Blog</span>
							<span>Glow Tips</span>
							<span>Ingredients</span>
						</div>
						<div>
							<strong>Help</strong>
							<span>Shipping & Returns</span>
							<span>Privacy Policy</span>
							<span>Terms of Service</span>
							<span>FAQs</span>
						</div>
					</Box>
				</Stack>
			</Stack>

			{/* TRUST BADGES — separator only between items, not after last */}
			<div className={'badges gf-fade'}>
				{BADGES.map((b, i) => (
					<>
						<div className={'badge'} key={b.title}>
							<div className={'badge-icon'}>{b.icon}</div>
							<div className={'badge-text'}>
								<strong>{b.title}</strong>
								<span>{b.sub}</span>
							</div>
						</div>
						{i < BADGES.length - 1 && <div className={'badge-sep'} key={`sep-${i}`} />}
					</>
				))}
			</div>

			{/* BOTTOM BAR */}
			<Stack className={'second gf-fade'}>
				<Box className={'links'}>
					<span>Privacy Policy</span>
					<span>Terms of Service</span>
					<span>Cookie Settings</span>
				</Box>
			</Stack>

			{/* COPYRIGHT ONLY */}
			<Box className={'tagline-bar gf-fade'}>
				<p className={'copy'}>© {dayjs().year()} Glowly Cosmetics. All Rights Reserved.</p>
			</Box>
		</Stack>
	);
};

export default Footer;
