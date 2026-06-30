import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Stack,
	Radio,
	RadioGroup,
	FormLabel,
	Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toastError } from '../../libs/toast';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const extractMessage = (err: any): string => {
	return (
		err?.graphQLErrors?.[0]?.message ||
		err?.networkError?.result?.errors?.[0]?.message ||
		err?.message ||
		'Something went wrong'
	);
};

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();

	const [input, setInput] = useState({
		nick: '',
		password: '',
		phone: '',
		type: 'USER',
		gender: '',
	});

	const [loginView, setLoginView] = useState<boolean>(true);
	const [animating, setAnimating] = useState<boolean>(false);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		if (animating) return;
		setAnimating(true);
		setTimeout(() => {
			setLoginView(state);
			setAnimating(false);
		}, 300);
	};

	const handleInput = useCallback((name: string, value: string) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			toastError(extractMessage(err));
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type, input.gender);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			toastError(extractMessage(err));
		}
	}, [input, router]);

	if (device === 'mobile') {
		return (
			<Stack className="join-page-mobile" sx={{ p: '40px 20px', minHeight: '80vh' }} alignItems="center">
				{/* LOGO */}
				<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
					<img src="/img/logo/glowly.svg" alt="Glowly" style={{ width: '40px' }} />
					<Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'lowercase' }}>
						glowly
					</Typography>
				</Stack>

				{/* INFO */}
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
						{loginView ? 'Welcome back' : 'Create account'}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						{loginView ? 'Login to your account' : 'Sign up to access Glowly features'}
					</Typography>
				</Box>

				{/* FORM */}
				<Stack spacing={2.5} sx={{ width: '100%', maxWidth: '400px' }}>
					<Box className="input-box-mobile">
						<Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', ml: 0.5 }}>
							Nickname
						</Typography>
						<input
							className="mobile-input"
							type="text"
							placeholder="Enter Nickname"
							value={input.nick}
							onChange={(e) => handleInput('nick', e.target.value)}
							style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e0e0e0' }}
						/>
					</Box>

					<Box className="input-box-mobile">
						<Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', ml: 0.5 }}>
							Password
						</Typography>
						<input
							className="mobile-input"
							type="password"
							placeholder="Enter Password"
							value={input.password}
							onChange={(e) => handleInput('password', e.target.value)}
							style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e0e0e0' }}
						/>
					</Box>

					{!loginView && (
						<Stack spacing={2.5}>
							<Box className="input-box-mobile">
								<Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', ml: 0.5 }}>
									Phone
								</Typography>
								<input
									className="mobile-input"
									type="text"
									placeholder="Enter Phone"
									value={input.phone}
									onChange={(e) => handleInput('phone', e.target.value)}
									style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e0e0e0' }}
								/>
							</Box>

							<Box>
								<FormLabel sx={{ fontSize: '12px', fontWeight: 'bold', color: '#1a1a1a' }}>Gender</FormLabel>
								<RadioGroup row value={input.gender} onChange={(e) => handleInput('gender', e.target.value)}>
									<FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
									<FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
								</RadioGroup>
							</Box>

							<Box>
								<FormLabel sx={{ fontSize: '12px', fontWeight: 'bold', color: '#1a1a1a' }}>Register as:</FormLabel>
								<FormGroup row>
									<FormControlLabel
										control={
											<Checkbox
												size="small"
												checked={input.type === 'USER'}
												onChange={() => handleInput('type', 'USER')}
											/>
										}
										label="User"
									/>
									<FormControlLabel
										control={
											<Checkbox
												size="small"
												checked={input.type === 'BRAND'}
												onChange={() => handleInput('type', 'BRAND')}
											/>
										}
										label="Brand"
									/>
								</FormGroup>
							</Box>
						</Stack>
					)}

					<Button
						variant="contained"
						fullWidth
						size="large"
						onClick={loginView ? doLogin : doSignUp}
						sx={{
							mt: 2,
							height: '55px',
							borderRadius: '12px',
							backgroundColor: '#1a1a1a',
							fontWeight: 'bold',
							'&:disabled': { backgroundColor: '#cccccc' },
						}}
						disabled={loginView ? !input.nick || !input.password : !input.nick || !input.password || !input.phone}
					>
						{loginView ? 'LOGIN' : 'SIGN UP'}
					</Button>

					<Box sx={{ textAlign: 'center', mt: 2 }}>
						<Typography variant="body2" color="textSecondary">
							{loginView ? "Don't have an account?" : 'Already have an account?'}{' '}
							<span
								style={{ color: '#f564a9', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
								onClick={() => setLoginView(!loginView)}
							>
								{loginView ? 'Sign Up' : 'Login'}
							</span>
						</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}

	const FormFields = (
		<Box className="input-wrap">
			<div className="input-box">
				<span>Nickname</span>
				<input
					type="text"
					placeholder="Enter Nickname"
					value={input.nick}
					onChange={(e) => handleInput('nick', e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && (loginView ? doLogin() : doSignUp())}
					required
				/>
			</div>
			<div className="input-box">
				<span>Password</span>
				<input
					type="password"
					placeholder="Enter Password"
					value={input.password}
					onChange={(e) => handleInput('password', e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && (loginView ? doLogin() : doSignUp())}
					required
				/>
			</div>
			{!loginView && (
				<>
					<div className="input-box">
						<span>Phone</span>
						<input
							type="text"
							placeholder="Enter Phone"
							value={input.phone}
							onChange={(e) => handleInput('phone', e.target.value)}
							required
						/>
					</div>

					<Box className="gender-select">
						<FormLabel>Gender</FormLabel>
						<RadioGroup row value={input.gender} onChange={(e) => handleInput('gender', e.target.value)}>
							<FormControlLabel value="male" control={<Radio />} label="Male" />
							<FormControlLabel value="female" control={<Radio />} label="Female" />
							<FormControlLabel value="other" control={<Radio />} label="Other" />
						</RadioGroup>
					</Box>

					<Box className="type-option">
						<span>I want to register as:</span>
						<FormGroup row>
							<FormControlLabel
								control={<Checkbox checked={input.type === 'USER'} onChange={() => handleInput('type', 'USER')} />}
								label="User"
							/>
							<FormControlLabel
								control={<Checkbox checked={input.type === 'BRAND'} onChange={() => handleInput('type', 'BRAND')} />}
								label="Brand"
							/>
						</FormGroup>
					</Box>
				</>
			)}
		</Box>
	);

	return (
		<Stack className="join-page">
			<Stack className="container">
				<Stack className="main">
					{/* ── LOGIN FORM ── */}
					<Stack className={`left${!loginView ? ' hidden' : ''}`}>
						<Box className="logo">
							<img src="/img/logo/glowly.svg" alt="Glowly" />
							<span>glowly</span>
						</Box>
						<Box className="info">
							<span>Welcome back</span>
							<p>Login to your account</p>
						</Box>
						{FormFields}
						<Box className="register">
							<Button
								variant="contained"
								onClick={doLogin}
								disabled={!input.nick || !input.password}
								endIcon={<img src="/img/icons/rightup.svg" alt="" />}
							>
								LOGIN
							</Button>
						</Box>
					</Stack>

					{/* ── SIGN UP FORM ── */}
					<Stack className={`left right-form${loginView ? ' hidden' : ''}`}>
						<Box className="logo">
							<img src="/img/logo/glowly.svg" alt="Glowly" />
							<span>glowly</span>
						</Box>
						<Box className="info">
							<span>Create account</span>
							<p>Sign up to access Glowly features</p>
						</Box>
						{FormFields}
						<Box className="register">
							<Button
								variant="contained"
								onClick={doSignUp}
								disabled={!input.nick || !input.password || !input.phone || !input.gender || !input.type}
								endIcon={<img src="/img/icons/rightup.svg" alt="" />}
							>
								SIGN UP
							</Button>
						</Box>
					</Stack>

					{/* ── SLIDING OVERLAY PANEL ── */}
					<Box className={`overlay-panel${!loginView ? ' slide-left' : ''}${animating ? ' animating' : ''}`}>
						<Box className="overlay-content">
							{loginView ? (
								<>
									<span className="overlay-title">Hello, friend!</span>
									<p className="overlay-sub">New here? Join Glowly and discover a world of beauty.</p>
									<button className="overlay-btn" onClick={() => viewChangeHandler(false)}>
										Sign Up
									</button>
								</>
							) : (
								<>
									<span className="overlay-title">Welcome back!</span>
									<p className="overlay-sub">Already have an account? Sign in to continue your journey.</p>
									<button className="overlay-btn" onClick={() => viewChangeHandler(true)}>
										Login
									</button>
								</>
							)}
						</Box>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);
