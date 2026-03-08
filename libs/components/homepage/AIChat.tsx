'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface Product {
	name: string;
	type: string;
	image: string;
	addable?: boolean;
}

interface ChatMessage {
	sender: 'AI' | 'User';
	message: string;
	products?: Product[];
}

const chatData: ChatMessage[] = [
	{
		sender: 'AI',
		message:
			"Hello! I'm your personal skincare buddy. Tell me about your skin and I'll find the perfect routine for you. ✨",
	},
	{
		sender: 'User',
		message: "Hi! I'm 45, concerned about dry skin and fine lines 🤔",
	},
	{
		sender: 'AI',
		message: 'A hydration-first routine will make a big difference for you! Here are a few products I recommend:',
		products: [
			{ name: 'COSRX Snail Mucin Essence', type: 'Hydration', image: '/img/products/product1.png', addable: true },
			{ name: 'COSRX Peptide Cream', type: 'Firming', image: '/img/products/product2.png', addable: true },
		],
	},
];

const AIChat = () => {
	const [messages, setMessages] = useState<ChatMessage[]>(chatData);
	const [input, setInput] = useState('');
	const [visible, setVisible] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);
	const chatEndRef = useRef<HTMLDivElement>(null);

	// Scroll-in animation observer
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Auto-scroll chat to bottom
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = () => {
		if (!input.trim()) return;
		setMessages((prev) => [...prev, { sender: 'User', message: input }]);
		setInput('');
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					sender: 'AI',
					message: "Great! Based on what you've shared, here's a recommendation tailored just for you:",
					products: [
						{ name: 'COSRX Advanced Snail 96', type: 'Repair', image: '/img/products/product3.png', addable: true },
					],
				},
			]);
		}, 1000);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<section ref={sectionRef} className={`ai-chat-section ${visible ? 'is-visible' : ''}`}>
			<div className={'container'}>
				{/* ── Left: intro ── */}
				<div className={'ai-chat-intro'}>
					<span className={'ai-eyebrow'}>Powered by AI</span>
					<h2 className={'ai-title'}>
						Your personal
						<br />
						<em>skincare advisor</em>
					</h2>
					<p className={'ai-desc'}>
						Not sure what your skin needs? Chat with our AI buddy — share your concerns and get a curated routine in
						seconds.
					</p>

					{/* Illustration — put your image at /img/ai-skin-illustration.png */}
					<div className={'ai-illustration'}>
						<Image
							src={'/img/ai-skin-illustration.png'}
							alt={'AI Skincare Illustration'}
							fill
							style={{ objectFit: 'contain' }}
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = 'none';
							}}
						/>
						{/* SVG fallback shown when image is missing */}
						<div className={'ai-illustration-fallback'}>
							<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="60" cy="60" r="58" stroke="#f5dde3" strokeWidth="2" fill="#fdf5f7" />
								<circle cx="60" cy="48" r="18" fill="#fce8ec" />
								<ellipse cx="53" cy="46" rx="2" ry="2.5" fill="#c47a8a" />
								<ellipse cx="67" cy="46" rx="2" ry="2.5" fill="#c47a8a" />
								<path d="M54 53c2 2.5 6 2.5 8 0" stroke="#c47a8a" strokeWidth="1.5" strokeLinecap="round" />
								<path
									d="M28 94c0-17.67 14.33-32 32-32s32 14.33 32 32"
									stroke="#e8b4bf"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								<circle cx="60" cy="14" r="4" fill="#c47a8a" opacity="0.4" />
								<circle cx="14" cy="60" r="3" fill="#c47a8a" opacity="0.25" />
								<circle cx="106" cy="60" r="3" fill="#c47a8a" opacity="0.25" />
								<path d="M72 22l3-6 3 6-6 0z" fill="#c47a8a" opacity="0.3" />
							</svg>
						</div>
					</div>
				</div>

				{/* ── Right: chat widget ── */}
				<div className={'ai-chat-widget'}>
					{/* Header */}
					<div className={'chat-header'}>
						<div className={'chat-avatar'}>✦</div>
						<div className={'chat-header-text'}>
							<strong>Skin AI Buddy</strong>
							<span>Online · Ready to help</span>
						</div>
						<div className={'online-dot'} />
					</div>

					{/* Messages */}
					<div className={'chat-messages'}>
						{messages.map((item, idx) => (
							<div key={idx} className={`chat-bubble-wrap ${item.sender === 'User' ? 'user' : 'ai'}`}>
								{item.sender === 'AI' && <div className={'bubble-avatar'}>✦</div>}
								<div className={'chat-bubble'}>
									<p>{item.message}</p>
									{item.products && (
										<div className={'product-chips'}>
											{item.products.map((p) => (
												<div key={p.name} className={'product-chip'}>
													<div className={'chip-img-wrap'}>
														<Image src={p.image} alt={p.name} width={44} height={44} />
													</div>
													<div className={'chip-info'}>
														<strong>{p.name}</strong>
														<span>{p.type}</span>
														{p.addable && <button className={'chip-add'}>+ Add to Cart</button>}
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						))}
						<div ref={chatEndRef} />
					</div>

					{/* Input */}
					<div className={'chat-input-area'}>
						<textarea
							rows={2}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Tell me about your skin concerns..."
							className={'chat-input'}
						/>
						<button onClick={handleSend} className={'chat-send-btn'}>
							Send
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AIChat;
