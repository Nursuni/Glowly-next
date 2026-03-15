import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

interface HeadCell {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{ id: 'category', numeric: true, disablePadding: false, label: 'CATEGORY' },
	{ id: 'title', numeric: true, disablePadding: false, label: 'TITLE' },
	{ id: 'writer', numeric: true, disablePadding: false, label: 'WRITER' },
	{ id: 'date', numeric: true, disablePadding: false, label: 'DATE' },
	{ id: 'status', numeric: false, disablePadding: false, label: 'STATUS' },
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface FaqArticlesPanelListType {
	dense?: boolean;
	membersData?: any[];
	anchorEl?: any;
	handleMenuIconClick?: any;
	handleMenuIconClose?: any;
	generateMentorTypeHandle?: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { dense, membersData, anchorEl, handleMenuIconClick, handleMenuIconClose, generateMentorTypeHandle } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					<EnhancedTableHead />

					<TableBody>
						{membersData?.map((member: any, index: number) => {
							const member_image = '/img/profile/user.svg';

							return (
								<TableRow hover key={member._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{member._id}</TableCell>

									<TableCell align="left">{member.mb_full_name}</TableCell>

									<TableCell align="left" className={'name'}>
										<Stack direction={'row'}>
											<Link href={`/_admin/users/detail?mb_id=${member._id}`}>
												<Avatar alt="User" src={member_image} sx={{ ml: '2px', mr: '10px' }} />
											</Link>

											<Link href={`/_admin/users/detail?mb_id=${member._id}`}>
												<div>{member.mb_nick}</div>
											</Link>
										</Stack>
									</TableCell>

									<TableCell align="left">{member.mb_phone}</TableCell>

									<TableCell align="center">
										<Button onClick={(e: any) => handleMenuIconClick(e, index)} className={'badge success'}>
											{member.mb_type}
										</Button>

										<Menu
											className={'menu-modal'}
											MenuListProps={{ 'aria-labelledby': 'fade-button' }}
											anchorEl={anchorEl?.[index]}
											open={Boolean(anchorEl?.[index])}
											onClose={handleMenuIconClose}
											TransitionComponent={Fade}
											sx={{ p: 1 }}
										>
											<MenuItem onClick={() => generateMentorTypeHandle(member._id, 'mentor', 'originate')}>
												<Typography variant={'subtitle1'} component={'span'}>
													MENTOR
												</Typography>
											</MenuItem>

											<MenuItem onClick={() => generateMentorTypeHandle(member._id, 'user', 'remove')}>
												<Typography variant={'subtitle1'} component={'span'}>
													USER
												</Typography>
											</MenuItem>
										</Menu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
