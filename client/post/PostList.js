import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'
import { size } from 'lodash';

const PostList = (props) => {
  const { posts } = props;
  return (
    <div style={{ marginTop: '24px' }}>
        <div>
        {posts.map((item, i) => {
          return <Post post={item} key={i} onRemove={props.removeUpdate} />
        })}
      </div>
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired
}

export default PostList
