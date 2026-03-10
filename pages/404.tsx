import { NextPage } from 'next';
import { Stack, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';

import withLayoutBasic from '@/libs/components/layout/LayoutBasic';

const imgs = {
	eyeshadow: '/img/cosmetics/eyeshadow.png',
	rumyana: '/img/cosmetics/rumyana.png',
	lipp: '/img/cosmetics/lipp.png',
	skinn: '/img/cosmetics/skinn.png',
	skin: '/img/cosmetics/skin.png',
	serum1: '/img/cosmetics/serum1.png',
	pudra: '/img/cosmetics/pudra.png',
};

// Placement mirrors the reference: dense cluster around the 404,
// items coming in from all 8 directions, some overlapping the text
const productItems = [
	// ── far top-left (small palette) ──
	{ src: imgs.eyeshadow, top: '20%', left: '28%', w: 100, rotate: '-8deg' },
	// ── top-left (mascara/lipp) ──
	{ src: imgs.lipp, top: '60%', left: '70%', w: 95, rotate: '-5deg' },

	// ── top center (blush/rumyana) ──
	{ src: imgs.rumyana, top: '18%', left: '46%', w: 90, rotate: '6deg' },
	// ── top-right (large palette) ──
	{ src: imgs.serum1, top: '20%', left: '60%', w: 110, rotate: '10deg' },
	// ── far top-right (mascara) ──
	{ src: imgs.lipp, top: '60%', left: '70%', w: 95, rotate: '-5deg' },

	// ── left (overlapping first "4") ──
	{ src: imgs.skinn, top: '38%', left: '18%', w: 115, rotate: '-7deg' },
	// ── center-left (on the "4") ──

	// ── center-right (on the "4") ──
	{ src: imgs.skin, top: '40%', left: '60%', w: 108, rotate: '8deg' },
	// ── right (overlapping last "4") ──
	{ src: imgs.eyeshadow, top: '36%', left: '72%', w: 115, rotate: '-10deg' },

	// ── bottom-left ──
	{ src: imgs.rumyana, top: '62%', left: '22%', w: 95, rotate: '5deg' },
	// ── bottom center-left ──
	{ src: imgs.serum1, top: '64%', left: '36%', w: 105, rotate: '-6deg' },
	// ── bottom center (small lipp) ──
	{ src: imgs.lipp, top: '60%', left: '70%', w: 95, rotate: '-5deg' },

	// ── bottom center-right ──
	{ src: imgs.skinn, top: '62%', left: '56%', w: 100, rotate: '7deg' },
	// ── bottom-right ──
	{ src: imgs.pudra, top: '60%', left: '70%', w: 95, rotate: '-5deg' },
];

const Custom404: NextPage = () => {
	return (
		<>
			<Head>
				<title>Glowly — Page Not Found</title>
			</Head>

			<Stack
				height="100vh"
				width="100%"
				sx={{ bgcolor: '#ffffff', overflow: 'hidden', position: 'relative', flexDirection: 'column' }}
			>
				{/* ── Nav ── */}
				<Box sx={{ position: 'relative', zIndex: 20 }}></Box>

				{/* ── 404 text + subtitle + button ── */}
				<Stack
					flex={1}
					justifyContent="center"
					alignItems="center"
					sx={{ position: 'relative', zIndex: 5, textAlign: 'center' }}
				>
					<Typography
						sx={{
							fontSize: { xs: '120px', md: '190px' },
							fontWeight: 900,
							lineHeight: 1,
							color: '#111',
							fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
							letterSpacing: '-0.03em',
							mb: 1.5,
						}}
					>
						404
					</Typography>

					<Box sx={{ position: 'relative', zIndex: 15 }}>
						<Typography
							sx={{
								fontSize: '13px',
								color: '#999',
								fontFamily: "'Helvetica Neue', sans-serif",
								lineHeight: 1.8,
								mb: 3,
							}}
						>
							Sorry, this page doesn't exist,
							<br />
							but you can return to the home page.
						</Typography>

						<Link href="/" passHref>
							<Button
								variant="contained"
								disableElevation
								sx={{
									bgcolor: '#111',
									color: '#fff',
									fontFamily: "'Helvetica Neue', sans-serif",
									fontSize: '11px',
									letterSpacing: '0.1em',
									px: 4,
									py: 1.3,
									borderRadius: '2px',
									textTransform: 'uppercase',
									'&:hover': { bgcolor: '#e8a0b8' },
								}}
							>
								Go to Home
							</Button>
						</Link>
					</Box>
				</Stack>

				{/* ── Product images ── */}
				{productItems.map((item, i) => (
					<Box
						key={i}
						component="img"
						src={item.src}
						alt="cosmetic product"
						sx={{
							position: 'absolute',
							top: item.top,
							left: item.left,
							width: `${item.w}px`,
							transform: `rotate(${item.rotate})`,
							filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.10))',
							zIndex: 8,
							pointerEvents: 'none',
						}}
					/>
				))}
			</Stack>
		</>
	);
};

export default withLayoutBasic(Custom404);
