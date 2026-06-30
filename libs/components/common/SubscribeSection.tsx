import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Box, Typography, TextField, Button } from '@mui/material';

const API_URL = process.env.REACT_APP_API_GRAPHQL_URL;

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
				headers: { 'Content-Type': 'application/json' },
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

			if (result.errors && result.errors.length > 0) {
				toast.error(result.errors[0].message);
			} else if (result.data?.subscribeNewsletter) {
				toast.success('Successfully subscribed!');
				setEmail('');
			} else {
				toast.error('Something went wrong.');
			}
		} catch (error) {
			console.error('Subscribe Error:', error);
			const message = error instanceof Error ? error.message : JSON.stringify(error);
			toast.error(message || 'Server error.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ py: 8, textAlign: 'center' }}>
			{/* Heading — Cormorant Garamond (display font) */}
			<Typography
				variant="h5"
				sx={{
					fontFamily: "'Cormorant Garamond', Georgia, serif",
					fontWeight: 500,
					fontSize: '2rem',
					letterSpacing: '0.02em',
					color: '#1e1218',
					mb: 1,
				}}
			>
				Get 10% off your first order
			</Typography>

			{/* Subtext — DM Sans (body font) */}
			<Typography
				sx={{
					fontFamily: "'DM Sans', sans-serif",
					fontWeight: 300,
					fontSize: '0.95rem',
					color: '#5c4556',
					mb: 3,
				}}
			>
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
					sx={{
						'& .MuiInputBase-input': {
							fontFamily: "'DM Sans', sans-serif",
							fontWeight: 300,
							fontSize: '0.9rem',
							color: '#1e1218',
						},
						'& .MuiInputBase-input::placeholder': {
							fontFamily: "'DM Sans', sans-serif",
							color: '#a08898',
							opacity: 1,
						},
						'& .MuiOutlinedInput-root': {
							borderRadius: '4px',
							'& fieldset': {
								borderColor: 'rgba(245, 100, 169, 0.14)',
							},
							'&:hover fieldset': {
								borderColor: '#f0e0ea',
							},
							'&.Mui-focused fieldset': {
								borderColor: '#f564a9',
							},
						},
					}}
				/>

				<Button
					type="submit"
					variant="contained"
					disabled={loading}
					sx={{
						whiteSpace: 'nowrap',
						fontFamily: "'DM Sans', sans-serif",
						fontWeight: 400,
						fontSize: '0.85rem',
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
						backgroundColor: '#1e1218',
						color: '#fff',
						borderRadius: '4px',
						px: 3,
						'&:hover': { backgroundColor: '#2a2520' },
						'&:disabled': { opacity: 0.6 },
					}}
				>
					{loading ? 'Submitting...' : 'Subscribe'}
				</Button>
			</Box>
		</Box>
	);
}