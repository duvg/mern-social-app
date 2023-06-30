import React, {useState} from 'react';
import {create} from './api-user';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core';
import {Link} from 'react-router-dom';

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

const Signup = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    error: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    };

    create(user).then((data) => {
      if(data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '', open: true });
      }
    });
  };

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h6' className={classes.title}>
            Sign Up
          </Typography>

          <TextField
            id='name'
            label='Name'
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin='normal'
          />
          <TextField
            id='email'
            type='text'
            label='Email'
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
          />
          <br/>
          <TextField
            id='password'
            label='password'
            type='password'
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            margin='normal'
          />
          <br/>
          {
            values.error && (<Typography component="p" color="error">
              <Icon color='error' className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color='primary' variant='contained' onClick={clickSubmit}>Sign up</Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={(reason) => {
        if(reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          setOpen(false);
        }
      }}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          New account successfully created.
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color='primary' autoFocus='autoFocus' variant='contained'>
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Signup;