import React, {useState, useEffect} from 'react';
import auth from '../auth/auth-helper';
import {read} from './api-user';
import {Navigate, useParams} from 'react-router';
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
    makeStyles,
    useTheme
} from '@material-ui/core';
import {Edit, Person} from '@material-ui/icons';
import {Link} from 'react-router-dom';
import moment from 'moment';
import DeleteUser from './DeleteUser';
import theme from '../theme';


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
}));

const Profile = () => {
    const theme = useTheme();

    const classes = useStyles();
    const {userId} = useParams();
    const [values, setValues] = useState({
        user: {}
    });
    const [user, setUser] = useState({});
    const [userPicture, setUserpicture] = useState({});

    const [redirectToSignin, setRedirectToSignin] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = auth.isAuthenticated();

        read({
            userId: userId
        }, {token: jwt.token}, signal).then((data) => {
            if (data?.error) {
                setRedirectToSignin(true);
            } else {
                setUser(data);
                setValues({...values, user: data});
            }
        });

        if (redirectToSignin) {
            return <Navigate to='/signin/'/>;
        }

        return () => {
            abortController.abort();
        };
    }, [userId]);
    const photoUrl = values.user._id
        ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
        : '/api/users/defaultphoto';
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl}>

                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email}/>
                    {
                        auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id &&
                        (
                            <ListItemSecondaryAction>
                                <Link to={'/users/edit/' + user._id}>
                                    <IconButton aria-label="Edit">
                                        <Edit color="primary"/>
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id} color="secondary"/>
                            </ListItemSecondaryAction>
                        )
                    }
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemText
                        primary={user.about}
                        secondary={'Joined: ' + (moment(user.created).format('MMMM Do YYYY, h:mm:ss a'))}></ListItemText>
                </ListItem>
            </List>
        </Paper>
    );
};

export default Profile;