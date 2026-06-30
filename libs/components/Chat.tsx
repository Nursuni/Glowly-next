import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, NEXT_PUBLIC_API_URL } from '../config';
import { toastError } from '../toast';
import { RippleBadge } from '@/scss/MaterialTheme/styled';

// Interfeyslerdi anıqlastıramız
interface MessagePayload {
	event: string;
	text: string;
	memberData: Member | null;
}

const Chat = () => {
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [showButton, setShowButton] = useState(false);

	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** WS LOGIKASI **/
	useEffect(() => {
		if (!socket) return;

		const handleMessage = (msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data);
				if (data.event === 'message') {
					setMessagesList((prev) => [...prev, data]);
				} else if (data.event === 'info') {
					setOnlineUsers(data.totalClients || 0);
				}
			} catch (e) {
				console.error('WS parse error:', e);
			}
		};

		socket.addEventListener('message', handleMessage);
		return () => socket.removeEventListener('message', handleMessage);
	}, [socket]);

	/** UI LOGIKASI **/
	useEffect(() => {
		const timeoutId = setTimeout(() => setShowButton(true), 500);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		// Sahifa almashganda chatni yopish (optional)
		setOpen(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const toggleChat = () => setOpen(!open);

	const handleSendMessage = () => {
		
		const trimmedMsg = messageInput.trim();
		if (!trimmedMsg) {
			toastError(Messages.EMPTY_MESSAGE);
			return;
		}

		if (!socket || socket.readyState !== WebSocket.OPEN) {
			toastError('Connection lost. Please refresh.');
			return;
		}

		socket.send(
			JSON.stringify({
				event: 'message',
				data: {
					text: trimmedMsg,
					memberData: user,
				},
			}),
		);
		setMessageInput('');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<Stack className="chatting">
			{showButton && (
				<IconButton
					className="chat-button"
					onClick={toggleChat}
					sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
				>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</IconButton>
			)}

			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'}>
					<Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
						Live Chat
					</Typography>
					<RippleBadge badgeContent={onlineUsers} color="secondary" />
				</Box>

				<Box className={'chat-content'}>
					<Box sx={{ height: '100%', overflowY: 'auto' }}>
						<Stack className={'chat-main'} spacing={2} sx={{ p: 2 }}>
							<Typography className="welcome-msg" align="center" sx={{ fontSize: '12px', opacity: 0.7 }}>
								Welcome to Live chat!
							</Typography>

							{messagesList.map((msg, index) => {
								const isMine = msg.memberData?._id === user?._id;
								const imgPath = msg.memberData?.memberImage
									? `${NEXT_PUBLIC_API_URL}/${msg.memberData.memberImage}`
									: '/img/profile/user.svg';

								return (
									<Box
										key={index}
										display="flex"
										flexDirection={isMine ? 'row-reverse' : 'row'}
										alignItems="flex-start"
										gap={1}
									>
										{!isMine && <Avatar src={imgPath} sx={{ width: 32, height: 32 }} />}
										<Box
											className={isMine ? 'msg-right' : 'msg-left'}
											sx={{
												p: '8px 12px',
												borderRadius: '12px',
												maxWidth: '70%',
												bgcolor: isMine ? '#1976d2' : '#f1f1f1',
												color: isMine ? '#fff' : '#000',
												boxShadow: 1,
											}}
										>
											<Typography variant="body2">{msg.text}</Typography>
										</Box>
									</Box>
								);
							})}
						</Stack>
					</Box>
				</Box>

				<Box className={'chat-bott'} sx={{ display: 'flex', p: 1, borderTop: '1px solid #ddd' }}>
					<input
						type="text"
						value={messageInput}
						className={'msg-input'}
						placeholder={'Type message...'}
						onChange={(e) => setMessageInput(e.target.value)}
						onKeyDown={handleKeyDown}
						style={{ flexGrow: 1, border: 'none', outline: 'none', padding: '10px' }}
					/>
					<IconButton onClick={handleSendMessage} disabled={!messageInput.trim()} color="primary">
						<SendIcon />
					</IconButton>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
