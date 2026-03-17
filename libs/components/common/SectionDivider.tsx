import React from 'react';

type DividerVariant = 'dark' | 'light' | 'pink';

interface SectionDividerProps {
	variant?: DividerVariant;
	items?: string[];
}

const DEFAULT_ITEMS = [
	'free shipping over $80',
	'★',
	'new arrivals weekly',
	'★',
	'curated beauty',
	'★',
	'clean ingredients',
	'★',
	'loved by community',
	'★',
];

const SectionDivider = ({ variant = 'dark', items = DEFAULT_ITEMS }: SectionDividerProps) => {
	// duplicate 4× so the marquee loops with no gap
	const doubled = [...items, ...items, ...items, ...items];

	return (
		<div className={`section-divider section-divider--${variant}`}>
			<div className="marquee-track">
				{doubled.map((item, i) =>
					item === '★' ? (
						<span key={i} className="marquee-item">
							<span className="marquee-dot" />
						</span>
					) : (
						<span key={i} className="marquee-item">
							{item}
						</span>
					),
				)}
			</div>
		</div>
	);
};

export default SectionDivider;
