const create = async (user) => {
  try {
    const response = await fetch('/api/users/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    if (response.status === 409) {
      return { error: 'Email already exists' }
    }
    return await response.json()
  } catch (err) {
    console.log('Err:::', err)
  }
}

const list = async (signal) => {
  try {
    const response = await fetch('/api/users/', {
      method: 'GET',
      signal: signal
    })
    return await response.json()
  } catch (err) {
    console.log('Err::: ', err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    const response = await fetch('/api/users/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + credentials.token
      }
    })
    return await response.json()
  } catch (err) {
    console.log('Err::: ', err)
  }
}

const update = async (params, credentials, user) => {
  try {
    const response = await fetch('/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + credentials.token
      },
      body: user
    })
    return await response.json()
  } catch (err) {
    console.log('Err:::', err)
  }
}

const remove = async (params, credentials) => {
  try {
    const response = await fetch('/api/users/' + params.id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.log('Err:::', err)
  }
}

const follow = async (params, credentials, followId) => {
  try {
    console.log('userID', params.userId);
    console.log('followId', followId);
    const response = await fetch('/api/users/follow/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, followId: followId })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const unfollow = async (params, credentials, unfollowId) => {
  try {
    const response = await fetch('/api/users/unfollow/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, unfollowId })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const findPeople = async (params, credentials, signal) => {
  console.log('credentials', credentials);
  try {
    const response = await fetch('/api/users/findpeople/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.token
      }
    })
    return await response.json();
  } catch (err) {
    console.log(err)
  }
}

export {
  create,
  list,
  read,
  update,
  remove,
  follow,
  unfollow,
  findPeople
}
