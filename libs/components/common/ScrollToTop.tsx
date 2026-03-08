import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
	const [visible, setVisible] = useState(false);
	const [scrollPercent, setScrollPercent] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
			setScrollPercent(pct);
			setVisible(scrollTop > 300);
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// SVG circle progress params
	const radius = 22;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

	return (
		<>
			<button className={`scroll-top-btn ${visible ? 'visible' : ''}`} onClick={handleClick} aria-label="Scroll to top">
				{/* Progress ring */}
				<svg className="progress-ring" width="56" height="56" viewBox="0 0 56 56">
					{/* Track */}
					<circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(245,100,169,0.15)" strokeWidth="1.5" />
					{/* Progress */}
					<circle
						cx="28"
						cy="28"
						r={radius}
						fill="none"
						stroke="#f564a9"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						transform="rotate(-90 28 28)"
						className="progress-arc"
					/>
				</svg>

				{/* Inner circle + arrow */}
				<span className="inner">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="arrow-icon">
						<path
							d="M7 11.5V2.5M7 2.5L2.5 7M7 2.5L11.5 7"
							stroke="currentColor"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</button>

			<style>{`
				.scroll-top-btn {
					position: fixed;
					bottom: 32px;
					right: 32px;
					z-index: 9999;
					width: 56px;
					height: 56px;
					border: none;
					background: transparent;
					padding: 0;
					cursor: pointer;
					display: grid;
					place-items: center;

					/* hidden by default */
					opacity: 0;
					transform: translateY(12px) scale(0.9);
					pointer-events: none;
					transition: opacity 0.32s ease, transform 0.32s cubic-bezier(0.22,1,0.36,1);
				}

				.scroll-top-btn.visible {
					opacity: 1;
					transform: translateY(0) scale(1);
					pointer-events: all;
				}

				/* SVG ring sits behind the inner circle */
				.progress-ring {
					position: absolute;
					inset: 0;
					transition: stroke-dashoffset 0.15s ease;
				}

				.progress-arc {
					transition: stroke-dashoffset 0.15s ease;
				}

				/* White inner circle */
				.inner {
					position: absolute;
					inset: 6px;
					border-radius: 50%;
					background: #ffffff;
					box-shadow:
						0 2px 12px rgba(42,42,42,0.10),
						0 0 0 1px rgba(240,235,228,0.9);
					display: grid;
					place-items: center;
					color: #7a7067;
					transition: background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
				}

				.arrow-icon {
					transition: transform 0.22s ease;
				}

				/* Hover */
				.scroll-top-btn:hover .inner {
					background: #f564a9;
					color: #fff;
					box-shadow: 0 4px 18px rgba(245,100,169,0.32);
					transform: scale(1.06);
				}

				.scroll-top-btn:hover .arrow-icon {
					transform: translateY(-1px);
				}

				/* Active press */
				.scroll-top-btn:active .inner {
					transform: scale(0.94);
				}

				/* Mobile */
				@media (max-width: 768px) {
					.scroll-top-btn {
						bottom: 24px;
						right: 20px;
					}
				}
			`}</style>
		</>
	);
};

export default ScrollToTop;
