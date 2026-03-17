import React, { useEffect, useRef } from 'react';

const features = [
	{
		title: 'Natural Formula',
		desc: 'Crafted with pure, skin-loving ingredients for ultimate care.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
				<path d="M12 2C9 2 6.5 4.5 6.5 7.5c0 2.5 1.5 4.5 3.5 5.5V15h4v-2c2-1 3.5-3 3.5-5.5C17.5 4.5 15 2 12 2z" />
				<path d="M9 15v2a3 3 0 0 0 6 0v-2" />
				<circle cx="10" cy="8" r="0.8" fill="currentColor" />
				<circle cx="14" cy="8" r="0.8" fill="currentColor" />
			</svg>
		),
	},
	{
		title: 'Cruelty-Free',
		desc: 'Our products are never tested on animals, guaranteed ethical.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
				<rect x="3" y="6" width="18" height="13" rx="2" />
				<path d="M8 6V4a4 4 0 0 1 8 0v2" />
				<path d="M9 12h6M12 10v4" />
			</svg>
		),
	},
	{
		title: 'Expert Approved',
		desc: 'Carefully tested to ensure safety and visible results.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
				<circle cx="12" cy="12" r="9" />
				<path d="M8.5 12.5l2.5 2.5 4.5-5" />
			</svg>
		),
	},
	{
		title: 'Free Shipping',
		desc: 'Delivered to your doorstep with no extra costs worldwide.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
				<rect x="2" y="8" width="20" height="10" rx="2" />
				<path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
				<circle cx="8" cy="13" r="1.2" fill="currentColor" />
				<path d="M11 13h6" />
			</svg>
		),
	},
];

const EMOJI_IMAGES = ['/img/home/image 20.png', '/img/home/image 15.png', '/img/home/image 27.png'];

const HomeFeaturesSection = () => {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						section.classList.add('in-view');
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.15 },
		);

		observer.observe(section);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="home-features-section" ref={sectionRef}>
			<div className="features-grid">
				{features.map((f, i) => (
					<div className="feature-card" key={f.title} style={{ '--card-index': i } as React.CSSProperties}>
						<div className="feature-card__icon">{f.icon}</div>
						<strong className="feature-card__title">{f.title}</strong>
						<p className="feature-card__desc">{f.desc}</p>
					</div>
				))}
			</div>

			<div className="tagline-wrap">
				<p className="tagline">
					Refresh your skin, <img src={EMOJI_IMAGES[0]} alt="" className="tagline__emoji tagline__emoji--1" /> love
					yourself, <img src={EMOJI_IMAGES[1]} alt="" className="tagline__emoji tagline__emoji--2" />
				</p>
				<p className="tagline">
					renew your glow. <img src={EMOJI_IMAGES[2]} alt="" className="tagline__emoji tagline__emoji--3" />
				</p>
			</div>
		</section>
	);
};

export default HomeFeaturesSection;
