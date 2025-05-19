import React, {useState} from 'react';
import {IconButton, Menu, MenuItem} from '@mui/material';
import {IUser} from '../../../types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {logout} from "../../../features/Users/usersThunk.ts";
import {useAppDispatch} from "../../../app/hooks.ts";
import {useWebSocket} from "../../../features/WebSocketContext/WebSocketContext.tsx";

interface Props {
    user: IUser;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const ws = useWebSocket();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        if (!ws || !user) return;
        ws.send(JSON.stringify({
            type: "LOGOUT",
            payload: {
                username: user.username,
                token: user.token,
            },
        }));
    }

    return (
        <>
            <IconButton onClick={handleClick}>
                <AccountCircleIcon style={{color: 'white', fontSize: '2rem'}}/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem disabled={true}>Hello, {user.username}!</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;