import { useState } from 'react';

export default function AIChat() {
	const [messages, setMessages] = useState([{ from: 'ai', text: "Hi! I'm here to help with your beauty routine." }]);
	const [input, setInput] = useState('');

	const handleSend = async () => {
		if (!input) return;

		// Add user message
		setMessages([...messages, { from: 'user', text: input }]);

		// Call AI API here
		const res = await fetch('/api/ai-chat', {
			method: 'POST',
			body: JSON.stringify({ message: input }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();

		// Add AI response
		setMessages((prev) => [...prev, { from: 'ai', text: data.reply }]);
		setInput('');
	};

	return (
		<div className="chat-container">
			<div className="messages">
				{messages.map((m, i) => (
					<div key={i} className={m.from}>
						{m.text}
					</div>
				))}
			</div>
			<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about skincare..." />
			<button onClick={handleSend}>Send</button>
		</div>
	);
}
