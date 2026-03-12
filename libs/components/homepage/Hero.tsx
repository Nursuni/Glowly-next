import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';

const useCountUp = (end: number, start: boolean, duration = 1800) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!start) return;

		let startTimestamp: number | null = null;

		const step = (timestamp: number) => {
			if (!startTimestamp) startTimestamp = timestamp;

			const progress = timestamp - startTimestamp;
			const value = Math.min(Math.floor((progress / duration) * end), end);

			setCount(value);

			if (progress < duration) {
				requestAnimationFrame(step);
			}
		};

		requestAnimationFrame(step);
	}, [start, end, duration]);

	return count;
};

const Hero = () => {
	const device = useDeviceDetect();

	const statsRef = useRef<HTMLDivElement | null>(null);
	const [startCount, setStartCount] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setStartCount(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.4 },
		);

		if (statsRef.current) observer.observe(statsRef.current);

		return () => observer.disconnect();
	}, []);

	const products = useCountUp(240, startCount);
	const brands = useCountUp(38, startCount);
	const rating = useCountUp(49, startCount);

	if (device === 'mobile') {
		return (
			<div id="mobile-wrap">
				<section className="hero-section">
					<Image
						src="/img/banner/home-banner.png"
						alt="Glowly Korean Beauty"
						width={400}
						height={300}
						style={{ width: '100%', height: 'auto' }}
					/>
				</section>
			</div>
		);
	}

	return (
		<section className="hero-section">
			<div className="hero-blob" />

			<div className="hero-left">
				<div className="hero-eyebrow">
					<div className="hero-eyebrow-line" />
					<span>K-Beauty · Seoul Formulas</span>
					<div className="hero-eyebrow-line" />
				</div>

				<h1 className="hero-title">
					Soft, <em>Radiant</em>
					<br />
					Korean <span className="hero-title-pink">Beauty</span>
					<br />
					Rituals.
				</h1>

				<p className="hero-desc">
					Glowly brings you the finest Korean skincare and cosmetics — from glass-skin serums to cushion foundations
					trusted by Seoul's top studios.
				</p>

				<div className="hero-actions">
					<Link href="/catalog" className="hero-btn-primary">
						Explore Collection
					</Link>

					<Link href="/brand" className="hero-btn-ghost">
						View brands ›
					</Link>
				</div>

				{/* STATS */}
				<div className="hero-stats" ref={statsRef}>
					<div className="hero-stat">
						<div className="hero-stat-num">
							{products}
							<em>+</em>
						</div>
						<div className="hero-stat-label">K-Beauty Products</div>
					</div>

					<div className="hero-stat">
						<div className="hero-stat-num">
							{brands}
							<em>+</em>
						</div>
						<div className="hero-stat-label">Korean Brands</div>
					</div>

					<div className="hero-stat">
						<div className="hero-stat-num">
							{(rating / 10).toFixed(1)}
							<em>★</em>
						</div>
						<div className="hero-stat-label">Avg. Rating</div>
					</div>
				</div>
			</div>

			{/* RIGHT */}
			<div className="hero-right">
				<div className="hero-img-wrap">
					<Image
						src="/img/banner/home-banner.png"
						alt="Glowly Korean Beauty"
						fill
						priority
						style={{ objectFit: 'cover', objectPosition: 'center top' }}
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
