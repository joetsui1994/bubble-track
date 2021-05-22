import Dialog from '@material-ui/core/Dialog';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
    text: {
        fontSize: 14,
        fontWeight: 300,
    },
    failureIcon: {
        verticalAlign: 'bottom',
        marginRight: 10,
    },
    progressBar: {
        marginTop: 10,
        marginBottom: 5,
    }
}));

const DialogContent = withStyles((theme) => ({
    root: {
        padding: '15px 20px 15px 20px',
        maxWidth: 280,
    },
}))(MuiDialogContent);
  
const DialogTitle = withStyles((theme) => ({
    root: {
        backgroundColor: '#e6e6e6',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
}))(MuiDialogTitle);

export default function GraphLoadingDialog(props) {
    const classes = useStyles();
    const { graphLoading, graphRenderError } = props;

    return (
        <Dialog
            open={graphLoading || graphRenderError}
            onClose={null}
        >
            <DialogTitle>Loading Graph</DialogTitle>
            <DialogContent>
                {
                    graphLoading ?
                    <Fragment>
                        <Typography className={classes.text}>
                            Please wait, it should only take a few seconds...
                        </Typography>
                        <LinearProgress className={classes.progressBar} />
                    </Fragment>
                    :
                    <Typography className={classes.text}>
                        <ErrorOutlineIcon className={classes.failureIcon} size='medium' /> Failed to load graph. Please try again.
                    </Typography>
                }
            </DialogContent>
        </Dialog>
    );
}