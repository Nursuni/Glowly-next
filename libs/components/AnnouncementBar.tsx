import React, { useEffect, useState } from 'react';

const messages = [
	{ icon: '🚚', text: 'Free shipping on orders over', highlight: '$50' },
	{ icon: '✨', text: 'Earn Glow Rewards on every purchase —', highlight: 'shop & collect points' },
	{ icon: '💄', text: 'New K-Beauty arrivals just dropped —', highlight: 'discover now' },
	{ icon: '🎁', text: 'Free gift with orders over ', highlight: '$80' },
	{ icon: '💅', text: 'Lip Butter Collection —', highlight: 'hydrate in style' },
	{ icon: '⭐', text: 'Join Glow Rewards and unlock', highlight: 'exclusive perks' },
];

const AnnouncementBar = ({ navReady }: { navReady: boolean }) => {
	const [current, setCurrent] = useState(0);
	const [animating, setAnimating] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimating(true);
			setTimeout(() => {
				setCurrent((prev) => (prev + 1) % messages.length);
				setAnimating(false);
			}, 400);
		}, 3500);
		return () => clearInterval(interval);
	}, []);

	const msg = messages[current];

	return (
		<div className={`announcement-bar${navReady ? ' nb-ready' : ''}`}>
			{/* Dot indicators */}
			<div className="ann-dots">
				{messages.map((_, i) => (
					<span key={i} className={`ann-dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} />
				))}
			</div>

			{/* Message */}
			<div className={`ann-message${animating ? ' ann-exit' : ' ann-enter'}`}>
				<span className="ann-icon">{msg.icon}</span>
				<span className="ann-text">{msg.text}</span>
				<span className="ann-highlight">{msg.highlight}</span>
			</div>

			{/* Animated shimmer line */}
			<div className="ann-shimmer" />
		</div>
	);
};

export default AnnouncementBar;
