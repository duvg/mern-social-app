import React, { useEffect, useState } from 'react';
import {read, update} from './api-user';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import auth from '../auth/auth-helper';

import FileUpload from '@material-ui/icons/AddPhotoAlternate';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}));

const EditProfile = () => {
  const location = useLocation();
  const {userId} = useParams();
  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    email: '',
    about: '',
    password: '',
    open: false,
    error: '',
    redirectToProfile: false
  });
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = auth.isAuthenticated();

    read({
      userId: userId
    }, {token: jwt.token}, signal).then((data) => {
      if(data?.error) {
        setRedirectToSignin(true);
      } else {
        setValues(data);
      }
    });

    if (redirectToSignin) {
      return <Navigate to='/signin/'/>;
    }
  }, []);

  const handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    let userData = new FormData();
    const jwt = auth.isAuthenticated();

    values.name && userData.append('name', values.name);
    values.email && userData.append('email', values.email);
    values.password && userData.append('password',values.password);
    values.about && userData.append('about', values.about);
    values.photo && userData.append('photo', values.photo);

    update({
      userId
    }, {
      token: jwt.token
    }, userData).then((data) => {
      if (data?.error) {
        setValues({...values, error: data.error});
      } else {
        setValues({...values, userId: data._id, redirectToProfile: true});
      }
    });
  };

  const {from} = location.state || {
    from: {
      pathname: '/users/' + userId
    }
  };

  const { redirectToProfile } = values;
  if(redirectToProfile) {
    return <Navigate to={from} />;
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Edit profile
          </Typography>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br/>
          <TextField
            id="multiline-flexible"
            label="about"
            className={classes.textField}
            multiline
            rows="2"
            value={values.about}
            onChange={handleChange('about')}
          />
          <br/>
          <TextField
            id="email"
            type="email"
            label="Email"
            value={values.email}
            onChange={handleChange('email')}
            className={classes.textField}
            margin="normal"
          />
          <br/>
          <TextField
            id="password"
            name="password"
            label="password"
            type="password"
            value={values.password}
            className={classes.textField}
            onChange={handleChange('password')}
            margin="normal"
          />
          <br/>
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="default" component="span">
              Upload <FileUpload/>
            </Button>
          </label>
          <input
            accept="image/*"
            type="file"
            onChange={handleChange('photo')}
            style={{display: 'none'}}
            id="icon-button-file"
          />
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ''}
          </span>
          <br/>
          {
            values.error && (<Typography variant="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button
            color="secondary"
            variant="contained"
            className={classes.submit}
            onClick={handleSubmit}
          >Save changes</Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={(reason) => {
        setOpen(false);
      }}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          Account has been updated!
        </DialogContent>
        <DialogActions>
          <Link to={'/profile/' + 1}>
            <Button color="secondary" autoFocus="autoFocus" variant="contained">
              Go to Profile
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EditProfile;
