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
	logo?: string;
	products?: Product[];
}

const chatData: ChatMessage[] = [
	{ sender: 'AI', message: "Hello! I'm your COSRX Skincare Buddy. How can I help you today?", logo: '/ai-avatar.png' },
	{ sender: 'User', message: "Hi! I'm 45, concerned about my dry skin and wrinkles 🤔" },
	{
		sender: 'AI',
		message: 'Based on your age and concerns, a robust routine is key! What are your current habits?',
		products: [
			{ name: 'COSRX Snail Mucin Essence', type: 'Hydration', image: '/product1.png', addable: true },
			{ name: 'COSRX Peptide Cream', type: 'Firming', image: '/product2.png', addable: true },
		],
	},
];

const AIChat = () => {
	const [messages, setMessages] = useState(chatData);
	const [input, setInput] = useState('');
	const chatEndRef = useRef<HTMLDivElement>(null);

	// Auto scroll to bottom on new message
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = () => {
		if (!input.trim()) return;
		setMessages([...messages, { sender: 'User', message: input }]);
		setInput('');
		// Placeholder: simulate AI reply after 1s
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					sender: 'AI',
					message: "Thanks for sharing! Here's a product suggestion for you.",
					products: [{ name: 'COSRX Advanced Snail 96', type: 'Repair', image: '/product3.png', addable: true }],
				},
			]);
		}, 1000);
	};

	return (
		<div className="w-full max-w-md bg-gray-50 rounded-lg p-5 shadow-lg flex flex-col h-[500px]">
			<h3 className="text-sm font-semibold text-gray-600 mb-3 tracking-wider">AI ASSISTANT INTERACTION</h3>

			<div className="flex-1 overflow-y-auto space-y-4">
				{messages.map((item, idx) => (
					<div key={idx} className={`flex items-start gap-3 ${item.sender === 'User' ? 'justify-end' : ''}`}>
						{item.sender === 'AI' && (
							<div className="flex-shrink-0">
								<Image
									src={item.logo || '/ai-avatar-small.png'}
									alt="AI Avatar"
									width={36}
									height={36}
									className="rounded-full"
								/>
							</div>
						)}
						<div
							className={`p-3 rounded-xl max-w-[75%] shadow-sm ${
								item.sender === 'AI' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-pink-100 text-purple-900'
							}`}
						>
							<p className="text-sm">{item.message}</p>
							{item.products && (
								<div className="mt-2 flex gap-2 flex-wrap">
									{item.products.map((p) => (
										<div
											key={p.name}
											className="flex flex-col items-center p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
										>
											<Image src={p.image} alt={p.name} width={50} height={50} className="mb-1" />
											<span className="text-[11px] font-bold text-center">{p.name}</span>
											{p.addable && (
												<button className="mt-1 text-[10px] text-purple-700 font-semibold hover:underline">
													+ Add to Cart
												</button>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				))}
				<div ref={chatEndRef} />
			</div>

			{/* Input Area */}
			<div className="mt-3 pt-3 border-t border-gray-200">
				<textarea
					rows={2}
					className="w-full border rounded-md p-2 text-xs focus:ring-1 focus:ring-pink-400 outline-none resize-none"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your concern..."
				/>
				<button
					onClick={handleSend}
					className="mt-2 w-full bg-purple-600 text-white py-2 rounded text-xs font-bold hover:bg-purple-700 transition"
				>
					Send to AI Buddy
				</button>
			</div>
		</div>
	);
};

export default AIChat;
