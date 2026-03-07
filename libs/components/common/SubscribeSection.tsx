import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL;

export default function SubscribeSection() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email.includes('@')) {
			toast.error('Please enter a valid email.');
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(API_URL!, {
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
				toast.success('Successfully subscribed!');
				setEmail('');
			} else {
				toast.error(result.errors?.[0]?.message || 'Something went wrong.');
			}
		} catch (error: any) {
			toast.error(error.message || 'Server error.');
		} finally {
			setLoading(false);
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

				<button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
					{loading ? 'Submitting...' : 'Subscribe'}
				</button>
			</form>
		</section>
	);
}
