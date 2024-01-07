import React, { useContext } from 'react';
import  MuiAppBar from '@mui/material/AppBar'
import { Drawer, CssBaseline, List, Divider } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, ChevronLeft, ChevronRight, Scale } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import CreateIcon from '@mui/icons-material/Create';
import { Link ,useNavigate } from "react-router-dom"
import { AuthContext } from '../../context/authContext';


const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const MainAppBar = () => { 
  const theme = useTheme()
  const navigate = useNavigate()  
  const { logout, username, isAuthenticated, userRole } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const navList = [
    {name: "Create User", Icon: CreateIcon, path:"/admin/create-user"},
    {name: "Create Article", Icon: CreateIcon, path:"/admin/create-paragraph"},
    {name: "User Summery View", Icon: ViewAgendaIcon, path:"/admin/summery-view" }
  ]

  const handleLogout = (event) => {
      logout()   
      navigate("/signin")
  };

  const drawerOpen = () => {
      setOpen(true);
  }

  const drawerClose = () => {
      setOpen(false);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline/>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {userRole === "admin" && <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={drawerOpen}
            aria-label="menu"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Article Summery
          </Typography>
          {isAuthenticated && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle /><span style={{marginTop: "-5px"}}>{username}</span>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                
                { userRole === "admin" && <MenuItem onClick={handleClose}>Profile</MenuItem> }
                { isAuthenticated && <MenuItem onClick={handleLogout}>Logout</MenuItem> }
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {
        userRole === "app-user" && <Main>
          <DrawerHeader/>
        </Main>
      }
      {
        userRole === "admin" && <>
           <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
      >
            <DrawerHeader>
            <IconButton onClick={drawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
            {navList.map(l => (
                <ListItem key={l.name} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <l.Icon/>
                    </ListItemIcon>
                    <Link style={{textDecoration: "none"}} to={`${l.path}`}>
                        <ListItemText sx={{ color:"green", fontSize: "18px" }} primary={`${l.name}`} />
                    </Link>
                </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Drawer>
        <Main open={open}>
            <DrawerHeader/>
        </Main>
        </>
      }
    </Box>
  );
}

export default MainAppBar;