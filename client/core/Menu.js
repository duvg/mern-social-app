import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import auth from '../auth/auth-helper';

const isActive = (location, path) => {
  return location.pathname == path ? {color: '#ff4081'} : {color: '#ffffff'};
};

const Menu = () => {
  const location = useLocation();
  const history = useNavigate();
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MERN Skeleton
        </Typography>
        <Link to='/'>
          <IconButton aria-label='Home' style={isActive(location, '/')}>
            <HomeIcon/>
          </IconButton>
        </Link>
        <Link to='/users'>
          <Button style={isActive(location, '/users')}>Users</Button>
        </Link>
        {
          !auth.isAuthenticated() && (<span>
            <Link to='/signup'>
              <Button style={isActive(location, 'signup')}>Sign up</Button>
            </Link>
            <Link to='/signin' style={isActive(location, 'signin')}>Sign in</Link>
          </span>)
        }
        {
          auth.isAuthenticated() && (<span>
            <Link to={'/users/' + auth.isAuthenticated().user._id}>
              <Button style={isActive(location, '/users/' + auth.isAuthenticated().user._id)}>
                My Profile
              </Button>
            </Link>
            <Button color='inherit' onClick={() => { auth.clearJWT(() => history('/'))}}>Sign out</Button>
          </span>)
        }
      </Toolbar>
    </AppBar>
  );
};

export default Menu;