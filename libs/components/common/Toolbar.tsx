import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface ToolbarProps {
	searchText: string;
	setSearchText: (value: string) => void;
	onSearchSubmit: () => void;
	onSearchKeyDown: (e: React.KeyboardEvent) => void;
	sortingClickHandler: (e: React.MouseEvent<HTMLElement>) => void;
	sortingHandler: (e: React.MouseEvent<HTMLLIElement>) => void;
	sortingCloseHandler: () => void;
	anchorEl: HTMLElement | null;
	sortingOpen: boolean;
	sortOptions: { id: string; label: string }[];
	filterSortName: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
	searchText,
	setSearchText,
	onSearchSubmit,
	onSearchKeyDown,
	sortingClickHandler,
	sortingHandler,
	sortingCloseHandler,
	anchorEl,
	sortingOpen,
	sortOptions,
	filterSortName,
}) => {
	return (
		<div className="toolbar">
			<div className="toolbar-right">
				<div className="search-input">
					<input
						type="text"
						placeholder="Search"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={onSearchKeyDown}
					/>
					<SearchRoundedIcon onClick={onSearchSubmit} />
				</div>
			</div>

			<div className="toolbar-left">
				<span className="sort-label">Sort by</span>

				<Button onClick={sortingClickHandler} disableRipple className="sort-btn">
					<FavoriteBorderRoundedIcon />
				</Button>

				<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
					{sortOptions.map((item) => (
						<MenuItem
							key={item.id}
							id={item.id}
							onClick={sortingHandler}
							sx={{
								fontSize: '13px',
								color: filterSortName === item.label ? '#d4789a' : '#555',
								fontWeight: filterSortName === item.label ? 600 : 400,
							}}
						>
							{item.label}
						</MenuItem>
					))}
				</Menu>
			</div>
		</div>
	);
};

export default Toolbar;
