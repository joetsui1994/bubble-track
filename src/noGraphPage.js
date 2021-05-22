import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 50,
    fontWeight: 500,
    color: '#fff',
    opacity: 0.6,
    marginLeft: '25%',
    marginTop: '45vh'
  },
}));

function NoGraphDisplay(props) {
    const classes = useStyles();
    const { drawerOpen } = props;

    return (
        <Typography className={classes.root} style={{ marginLeft: drawerOpen ? '25%' : '30%' }}>
            Select graph for analysis.
        </Typography> 
    );
}

export default NoGraphDisplay;
