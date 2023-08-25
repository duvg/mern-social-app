import { result } from "lodash";

const listByUser = async (params, credentials) => {
  console.log(params);
  console.log(credentials);
  try {
    let response = await fetch(`/api/posts/by/${params.userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.t}`
      }
    })
    return await response.json();
  } catch (err) {
    console.log(err)
  }
}

const listNewsFeed = async (params, credentials, signal) => {
  try {
    const response = await fetch(`/api/posts/feed/${params.userId}`, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.t}`
      }
    })

    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const create = async (params, credentials, post) => {
  try {
    console.log('credentials', credentials.t);
    let response = await fetch(`/api/posts/new/${params.userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: post
    })
    return await response.json()
  } catch (err) {
    console.log(err);
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch(`/api/posts/${params.postId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      }
    })

    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const like = async (params, credentials, postId) => {
  try {
    let response = await fetch('(api/post/like/', {
      method: 'PUT',
      headers: {
        'Accept': 'appliction/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({userId: params.userId, postId: postId})
    })

    return await response.jsong()
  } catch (err) {
    console.log(err)
  }
}

const unlike = async (params, credentials, postId) => {
  try {
    let response = await fetch('/api/posts/unlike/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${creadentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, postId: postId})
    })

    return await response.json()
  } catch (err) {
    console.log(err)
  }
}


const comment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch('/api/posts/comment', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`,
        body: JSON.stringify({userId: params.userId, postId: postId, comment: comment })
      }
    })

    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const uncomment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch('/api/post/uncomment/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${credentials.t}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: params.userId, postId: postId, comment: comment})
    })
  } catch (err) {
    console.log(err);
  }
}

export {
  create,
  comment,
  like,
  listByUser,
  listNewsFeed,
  remove,
  uncomment,
  unlike
}
