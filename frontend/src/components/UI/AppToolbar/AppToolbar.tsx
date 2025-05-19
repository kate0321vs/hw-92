import { AppBar, styled, Toolbar, Typography} from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import UserMenu from "./UserMenu.tsx";
import AnonymousMenu from "./AnonymousMenu.tsx";
import {useAppSelector} from "../../../app/hooks.ts";
import {selectUser} from "../../../features/Users/usersSlice.ts";

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit'
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="sticky" sx={{mb: 4, backgroundColor:"black"}}>
      <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            <Link to="/">Chat</Link>
          </Typography>
          {user ? <UserMenu user={user}/> : <AnonymousMenu />}
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;