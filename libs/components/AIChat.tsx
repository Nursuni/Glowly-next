import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AIChat() {
	const [messages, setMessages] = useState([{ from: 'ai', text: "Hi! I'm here to help with your beauty routine." }]);
	const [input, setInput] = useState('');

	const { register, handleSubmit, reset } = useForm();

	const onSubmit = async (data: any) => {
		const input = data.message;
		if (!input) return;

		// add user message
		setMessages((prev) => [...prev, { from: 'user', text: input }]);

		const res = await fetch('/api/ai-chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: input }),
		});

		const result = await res.json();

		// add AI response
		setMessages((prev) => [...prev, { from: 'ai', text: result.reply }]);

		reset();
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

			<form onSubmit={handleSubmit(onSubmit)}>
				<input {...register('message')} placeholder="Ask about skincare..." />

				<button type="submit">Send</button>
			</form>
		</div>
	);
}
