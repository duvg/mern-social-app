import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { AppBar, Tab, Tabs, Typography } from '@material-ui/core';
import FollowGrid from './FollowGrid';
import PostList from '../post/PostList';

const ProfileTabs = (props) => {
  const [tab, setTab] = useState(0);
  const  {posts, removePostUpdate} = props;

  const handleTabChange = (event, value) => {
    setTab(value);
  };

  return (
    <div>
      <AppBar position='static' color='default'>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Posts' />
          <Tab label='Following' />
          <Tab label='Followers' />
        </Tabs>
      </AppBar>
      {tab === 0 && <TabContainer><PostList removeUpdate={removePostUpdate} posts={posts} /></TabContainer>}
      {tab === 1 && <TabContainer><FollowGrid people={props.user.following} /></TabContainer>}
      {tab === 2 && <TabContainer><FollowGrid people={props.user.followers} /></TabContainer>}
    </div>
  );

};

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProfileTabs;