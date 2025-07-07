import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { makeStyles } from '@mui/styles';
import React from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            //marginTop: spacing(2),
        },
    },
}));

export default function MySnackBar(props) {
    const classes = useStyles();
    const [state] = React.useState({
        vertical: 'top',
        horizontal: 'right',
    });
    const { vertical, horizontal } = state;

    return (
        <div className={classes.root}>
            <Snackbar maxSnack={3} anchorOrigin={{ vertical, horizontal }} open={props.Open} autoHideDuration={3500} onClose={props.HandleClose}>
                <Alert onClose={props.HandleClose} severity={props.Type}>
                    {props.Message}
                </Alert>
            </Snackbar>
        </div>
    );
}

