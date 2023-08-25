import React, { useEffect, useState } from 'react'
import { Card, Divider, Typography } from '@material-ui/core'

import NewPost from './NewPost'
import PostList from './PostList'
import { listNewsFeed } from './api-post'
import auth from '../auth/auth-helper'

const Newsfeed = () => {

  const jwt = auth.isAuthenticated();
  const [posts, setPosts] = useState([])

  const addPost = (post) => {
    console.log('posts', posts);
    const updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }

  const removePost = (post) => {
    const updatedPosts = [...post]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

  useEffect(() => {
    const abortContoller = new AbortController()
    const signal = abortContoller.signal
    listNewsFeed({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, signal).then((data) => {
      if(data.error) {
        console.log(data.error)
      } else {
        setPosts(data.data)
      }
    })
    return function cleanup() {
      abortContoller.abort()
    }
  }, []);

  return (
    <Card>
      <Typography type="title">Newsfeed</Typography>
      <Divider/>
      <NewPost addUpdate={addPost}/>
      <Divider/>
      <PostList removeUpdate={removePost} posts={posts}/>
    </Card>
  )
}

export default Newsfeed
