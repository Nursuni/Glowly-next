import { useState, ChangeEvent, FormEvent } from 'react';

export default function SubscribeSection() {
	const [email, setEmail] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const res = await fetch('http://localhost:4001/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: `
          mutation SubscribeNewsletter($email: String!) {
            subscribeNewsletter(email: $email) {
              _id
              email
              createdAt
            }
          }
        `,
					variables: { email },
				}),
			});

			const result = await res.json();

			if (result.data) {
				setMessage('Successfully subscribed!');
				setEmail('');
			} else {
				setMessage(result.errors?.[0]?.message || 'Something went wrong.');
			}
		} catch (error) {
			setMessage('Server error.');
		}
	};

	return (
		<section className="py-10 text-center">
			<h2 className="text-2xl font-semibold mb-2">Get 10% off your first order</h2>
			<p className="mb-4 text-gray-600">Join our email list for exclusive offers and the latest news.</p>

			<form onSubmit={handleSubmit} className="flex justify-center gap-2 max-w-md mx-auto">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={handleChange}
					required
					className="border px-3 py-2 w-full rounded"
				/>
				<button type="submit" className="bg-black text-white px-4 py-2 rounded">
					Subscribe
				</button>
			</form>

			{message && <p className="mt-3 text-sm text-green-600">{message}</p>}
		</section>
	);
}
