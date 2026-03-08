'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Message {
	from: 'ai' | 'user';
	text: string;
}

interface FormData {
	message: string;
}

export default function AIChat() {
	const [messages, setMessages] = useState<Message[]>([
		{
			from: 'ai',
			text: "Hello! I'm your personal skincare advisor. Tell me your concerns and I'll suggest the perfect routine for you. ✨",
		},
	]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);

	const sectionRef = useRef<HTMLElement>(null);
	const chatEndRef = useRef<HTMLDivElement>(null);

	const { register, handleSubmit, reset } = useForm<FormData>();

	// Scroll-in observer
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

	// Auto-scroll to latest message
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	const onSubmit = async (data: FormData) => {
		if (!data.message?.trim()) return;

		setMessages((prev) => [...prev, { from: 'user', text: data.message }]);
		setLoading(true);
		reset();

		try {
			const res = await fetch('/api/ai-chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: data.message }),
			});
			const result = await res.json();
			setMessages((prev) => [...prev, { from: 'ai', text: result.reply }]);
		} catch {
			setMessages((prev) => [...prev, { from: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSubmit(onSubmit)();
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
						Not sure what your skin needs? Chat with our AI — share your concerns and get a curated routine in seconds.
					</p>

					{/* Illustration — place your image at /img/ai-illustration.png */}
					<div className={'ai-illustration'}>
						<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="100" cy="100" r="98" stroke="#f5dde3" strokeWidth="2" fill="#fdf5f7" />
							<circle cx="100" cy="82" r="30" fill="#fce8ec" />
							<ellipse cx="89" cy="79" rx="3.5" ry="4" fill="#c47a8a" />
							<ellipse cx="111" cy="79" rx="3.5" ry="4" fill="#c47a8a" />
							<path d="M90 91c3.5 4 16 4 20 0" stroke="#c47a8a" strokeWidth="2" strokeLinecap="round" />
							<path
								d="M44 158c0-30.93 25.07-56 56-56s56 25.07 56 56"
								stroke="#e8b4bf"
								strokeWidth="2.5"
								strokeLinecap="round"
							/>
							{/* sparkles */}
							<circle cx="100" cy="20" r="5" fill="#c47a8a" opacity="0.35" />
							<circle cx="22" cy="100" r="4" fill="#c47a8a" opacity="0.2" />
							<circle cx="178" cy="100" r="4" fill="#c47a8a" opacity="0.2" />
							<path d="M152 36l4-9 4 9-9 0z" fill="#c47a8a" opacity="0.3" />
							<path d="M44 40l3-7 3 7-6 0z" fill="#9b8ea0" opacity="0.3" />
						</svg>
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
						{messages.map((m, i) => (
							<div key={i} className={`chat-bubble-wrap ${m.from}`}>
								{m.from === 'ai' && <div className={'bubble-avatar'}>✦</div>}
								<div className={'chat-bubble'}>
									<p>{m.text}</p>
								</div>
							</div>
						))}

						{/* Typing indicator */}
						{loading && (
							<div className={'chat-bubble-wrap ai'}>
								<div className={'bubble-avatar'}>✦</div>
								<div className={'chat-bubble typing'}>
									<span />
									<span />
									<span />
								</div>
							</div>
						)}

						<div ref={chatEndRef} />
					</div>

					{/* Input — real form with react-hook-form */}
					<form className={'chat-input-area'} onSubmit={handleSubmit(onSubmit)}>
						<input
							{...register('message')}
							onKeyDown={handleKeyDown}
							placeholder="Ask about your skin concerns..."
							className={'chat-input'}
							autoComplete="off"
						/>
						<button type="submit" className={'chat-send-btn'} disabled={loading}>
							{loading ? '...' : 'Send'}
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}
