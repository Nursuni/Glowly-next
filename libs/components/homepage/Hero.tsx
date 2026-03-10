import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
	return (
		<section className={'hero-section'}>
			<div className={'hero-blob'} />

			{/* ── LEFT ── */}
			<div className={'hero-left'}>
				<div className={'hero-eyebrow'}>
					<div className={'hero-eyebrow-line'} />
					<span>K-Beauty · Seoul Formulas</span>
					<div className={'hero-eyebrow-line'} />
				</div>

				<h1 className={'hero-title'}>
					Soft, <em>Radiant</em>
					<br />
					Korean <span className={'hero-title-pink'}>Beauty</span>
					<br />
					Rituals.
				</h1>

				<p className={'hero-desc'}>
					Glowly brings you the finest Korean skincare and cosmetics — from glass-skin serums to cushion foundations
					trusted by Seoul&apos;s top studios.
				</p>

				<div className={'hero-actions'}>
					<Link href="/catalog" className={'hero-btn-primary'}>
						Explore Collection
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</Link>
					<Link href="/brand" className={'hero-btn-ghost'}>
						View brands ›
					</Link>
				</div>

				<div className={'hero-stats'}>
					<div className={'hero-stat'}>
						<div className={'hero-stat-num'}>
							240<em>+</em>
						</div>
						<div className={'hero-stat-label'}>K-Beauty Products</div>
					</div>
					<div className={'hero-stat'}>
						<div className={'hero-stat-num'}>
							38<em>+</em>
						</div>
						<div className={'hero-stat-label'}>Korean Brands</div>
					</div>
					<div className={'hero-stat'}>
						<div className={'hero-stat-num'}>
							4.9<em>★</em>
						</div>
						<div className={'hero-stat-label'}>Avg. Rating</div>
					</div>
				</div>
			</div>

			{/* ── RIGHT ── */}
			<div className={'hero-right'}>
				<div className={'hero-img-wrap'}>
					{/* Replace src with your actual hero image path e.g. /img/hero/hero-main.jpg */}
					<Image
						src="/img/banner/home-banner.png"
						alt="Glowly Korean Beauty"
						fill
						priority
						style={{ objectFit: 'cover', objectPosition: 'center top' }}
					/>
				</div>

				<Link href="/catalog?category=skincare" className={'hero-chip hero-chip--dark hero-chip-1'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
					</svg>
					Skincare ›
				</Link>

				<Link href="/catalog?category=makeup" className={'hero-chip hero-chip--light hero-chip-2'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<circle cx="12" cy="12" r="3" />
						<path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2" />
					</svg>
					Makeup ›
				</Link>

				<Link href="/catalog?category=serums" className={'hero-chip hero-chip--light hero-chip-3'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1 3-4 5-4 8a4 4 0 008 0c0-3-3-5-4-8z" />
					</svg>
					Serums ›
				</Link>

				<Link href="/catalog?category=suncare" className={'hero-chip hero-chip--pink hero-chip-4'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
					Suncare ›
				</Link>
			</div>
		</section>
	);
};

export default Hero;
