import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';

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
		<Box sx={{ py: 8, textAlign: 'center' }}>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
				Get 10% off your first order
			</Typography>

			<Typography sx={{ mb: 3, color: 'text.secondary' }}>
				Join our email list for exclusive offers and the latest news.
			</Typography>

			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					gap: 2,
					maxWidth: 420,
					mx: 'auto',
				}}
			>
				<TextField
					type="email"
					placeholder="Email"
					value={email}
					onChange={handleChange}
					required
					fullWidth
					size="small"
				/>

				<Button
					type="submit"
					variant="contained"
					disabled={loading}
					sx={{
						whiteSpace: 'nowrap',
						backgroundColor: '#000',
						'&:hover': { backgroundColor: '#333' },
					}}
				>
					{loading ? 'Submitting...' : 'Subscribe'}
				</Button>
			</Box>
		</Box>
	);
}
