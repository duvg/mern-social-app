import React, { useState, useEffect } from 'react'
import auth from '../auth/auth-helper'
import { read } from './api-user'
import { Navigate, useParams } from 'react-router'
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTab'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle
  }
}))

const Profile = () => {

  const classes = useStyles()
  const { userId } = useParams()
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    following: false
  })
  const [user, setUser] = useState({})

  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id === jwt.user._id
    })
    return match
  }

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId
    }, { token: jwt.token }, signal).then((data) => {
      if (data?.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
        const following = checkFollow(data)
        setValues({ ...values, user: data, following })
      }
    })

    if (redirectToSignin) {
      return <Navigate to='/signin/' />
    }

    return () => {
      abortController.abort()
    }
  }, [userId])

  const photoUrl = values.user._id
    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
    : '/api/users/defaultphoto'

  const clickFollowButton = (callApi) => {
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, values.user._id).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, user: data, following: !values.following })
      }
    })
  }

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant='h6' className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {
            auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id
              ? (
                <ListItemSecondaryAction>
                  <Link to={'/users/edit/' + user._id}>
                    <IconButton aria-label='Edit'>
                      <Edit color='primary' />
                    </IconButton>
                  </Link>
                  <DeleteUser userId={user._id} color='secondary' />
                </ListItemSecondaryAction>
                )
              : (<FollowProfileButton following={values.following} onButtonClick={clickFollowButton} />)
          }

        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={user.about}
            secondary={'Joined: ' + (moment(user.created).format('MMMM Do YYYY, h:mm:ss a'))}
          />
        </ListItem>
      </List>
      <ProfileTabs user={values.user} />
    </Paper>
  )
}

export default Profile
