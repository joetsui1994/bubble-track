import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MuiOutlinedInput from '@material-ui/core/OutlinedInput';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const helperText = {
    minR: 'Minimum radius of non-SEQLESS nodes, must be smaller than Max-R and less than 999. (Default = 7)',
    maxR: 'Maximum radius of non-SEQLESS nodes, must be larger than Min-R and larger than 999. (Default = 100)',
    gamma: 'Gamma determines the steepness between minR and maxR, with a larger Gamma value leading to a steeper gradient. (Default = 0.1)',
    nonNodeR: 'Radius of SEQLESS nodes, must be smaller than minR. (Default = 5)',
    lambda: 'Lambda determines the scaling of branch lengths. (Default = 15000000)',
    charge: 'The larger the charge magnitude, the stronger the repulsion between non-SEQLESS nodes. (Default = 200)',
    minZoom: 'Minimum zoom ratio. (Default = 0.08)',
    maxZoom: 'Maximum zoom ratio. (Default = 6)',
    alphaDecay: 'Alpha decay determines how quickly alpha drops towards the desired target alpha, or how quickly the simulation cools, must be between 0 and 1. (Default = 0.03)',
    velocityDecay: 'Velocity decay determines the viscosity of the ambient atmosphere, with a smaller value often leading to better equilibria, must be between 0 and 1. (Default = 0.1)',
    minAlpha: 'Minimum possible value of alpha below which the simulation is stopped, must be larger than 0. (Default = 0.001)',
    heatingCharge: 'Charge magnitude during the early phase of annealing when particles are heated to a higher temperature to avoid local minima, must be larger than (static) charge. (Default = 2000)',
    heatingCutoff: 'Heating-cutoff determines the alpha value below which particles are not longer heated to a higher temperature and are allowed to cool off to a static equilibirum, must be between 0.001 (alphaMin) and 1. (Default = 0.1)',
    centreX: 'x-coordinate of centering. The x-coordinate of the geometric centre of the graph is used by default if left unspecified.',
    centreY: 'y-coordinate of centering. The y-coordinate of the geometric centre of the graph is used by default if left unspecified.',
    centreScale: 'Zoom ratio. (Default = 0.1)',
    intScale: 'Zoom ratio for tracking link-crossing. (Default = 0.5)',
    none: 'N/A',
}

const useStyles = makeStyles((theme) => ({
    actionButton: {
        color: '#484848',
        fontWeight: 700,
    },
    subTitle: {
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 10,
    },
    helperText: {
        marginTop: -5,
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 300,
        lineHeight: '15px',
    },
    inputLabel: {
        "&.Mui-focused": {
            color: '#054a5c'
        },
    }
}));

const DialogContent = withStyles((theme) => ({
    root: {
        padding: '15px 20px 0px 20px',
        maxWidth: 360,
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: 7,
    },
}))(MuiDialogActions);
  
const DialogTitle = withStyles((theme) => ({
    root: {
        backgroundColor: '#e6e6e6',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
}))(MuiDialogTitle);

const OutlinedInput = withStyles((theme) => ({
    root: {
        borderRadius: 2,
        fontSize: 11,
        width: 80,
        marginRight: 10,
        marginBottom: 10,
        "&:hover $notchedOutline": {
            borderColor: "#054a5c",
        },
        "&$focused $notchedOutline": {
            borderColor: "#054a5c"
        },
    },
    focused: {},
    notchedOutline: {},
}))(MuiOutlinedInput);

export default function FormDialog(props) {
    const classes = useStyles();

    const { open, params } = props;
    const { handleClose, handleParamsApply } = props;
    
    const [currentParams, setParams] = React.useState(JSON.parse(JSON.stringify(params)));
    const handleParamsChange = (event, paramName, allowNeg=false) => {
        var paramsCopy = JSON.parse(JSON.stringify(currentParams)),
            newValue = event.target.value,
            valid = !isNaN(newValue) || newValue === '-';

        if (valid) {
            if (allowNeg || newValue === '') {
                paramsCopy[paramName] = newValue;
                setParams(paramsCopy);
            } else if (parseFloat(newValue) >= 0) {
                paramsCopy[paramName] = newValue;
                setParams(paramsCopy);
            }
        }
    }

    const [paramInFocus, setFocus] = React.useState('none');
    const handleParamFocus = (event, paramName) => {
        event.preventDefault();
        event.stopPropagation();

        handleWarningCreate(null);
        setFocus(paramName);
    }
    const handleParamBlur = (event, paramName) => {
        event.preventDefault();
        event.stopPropagation();

        handleWarningCreate(null);
        setFocus('none');

        if (!String(currentParams[paramName]).replace(/\s/g, '').length) {
            var paramsCopy = JSON.parse(JSON.stringify(params));
            paramsCopy[paramName] = params[paramName];
            setParams(paramsCopy);
        }
    }

    const [warningText, setWarningText] = React.useState(null);
    const handleWarningCreate = (newWarningText) => {
        setWarningText(newWarningText);
    };

    const handleApply = (event) => {
        // validation
        if (parseFloat(currentParams.minR) > 999 || parseFloat(currentParams.minR) > parseFloat(currentParams.maxR)) {
            handleWarningCreate('Min-R must be less than 999 and less than Max-R.');
        } else if (parseFloat(currentParams.maxR) > 999) {
            handleWarningCreate('Max-R must be less than 999 and greater than Min-R.');
        } else if (parseFloat(currentParams.nonNodeR) > parseFloat(currentParams.minR)) {
            handleWarningCreate('SEQLESS nodes must have radius smaller than Min-R.');
        } else if (parseFloat(currentParams.minZoom) > parseFloat(currentParams.maxZoom)) {
            handleWarningCreate('Minimum zoom ratio must be smaller than maximum zoom ratio.');
        } else if (parseFloat(currentParams.alphaDecay) === 0 || parseFloat(currentParams.alphaDecay) >= 1) {
            handleWarningCreate('alphaDecay must be between 0 and 1.');
        } else if (parseFloat(currentParams.velocityDecay) === 0 || parseFloat(currentParams.velocityDecay) >= 1) {
            handleWarningCreate('velocityDecay must be between 0 and 1.');
        } else if (parseFloat(currentParams.heatingCutoff) <= parseFloat(currentParams.minAlpha) || parseFloat(currentParams.heatingCutoff) >= 1) {
            handleWarningCreate('Heating-cutoff must be between minAlpha and 1.');
        } else if (!Object.values(currentParams).every(value => String(value).replace(/\s/g, '').length)) {
            handleWarningCreate('There are unspecified parameters.');
        } else {
            handleWarningCreate(null);
            handleClose();
            handleParamsApply(currentParams);
        }
    };

    React.useEffect(() => {
        setParams(JSON.parse(JSON.stringify(params)));
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Graph Parameters</DialogTitle>
            <DialogContent>
                <Typography className={classes.subTitle}>
                    STATIC PARAMETERS
                </Typography>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Min-R</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.minR}
                        onChange={(event) => handleParamsChange(event, 'minR')}
                        onFocus={(event) => handleParamFocus(event, 'minR')}
                        onBlur={(event) => handleParamBlur(event, 'minR')}
                        labelWidth={44}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Max-R</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.maxR}
                        onChange={(event) => handleParamsChange(event, 'maxR')}
                        onFocus={(event) => handleParamFocus(event, 'maxR')}
                        onBlur={(event) => handleParamBlur(event, 'maxR')}
                        labelWidth={47}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Gamma</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.gamma}
                        onChange={(event) => handleParamsChange(event, 'gamma')}
                        onFocus={(event) => handleParamFocus(event, 'gamma')}
                        onBlur={(event) => handleParamBlur(event, 'gamma')}
                        labelWidth={58}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>0Node-R</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.nonNodeR}
                        onChange={(event) => handleParamsChange(event, 'nonNodeR')}
                        onFocus={(event) => handleParamFocus(event, 'nonNodeR')}
                        onBlur={(event) => handleParamBlur(event, 'nonNodeR')}
                        labelWidth={70}
                        style={{ marginRight: 0 }}
                    />
                </FormControl>
                <br />
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Lambda</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.lambda}
                        onChange={(event) => handleParamsChange(event, 'lambda')}
                        onFocus={(event) => handleParamFocus(event, 'lambda')}
                        onBlur={(event) => handleParamBlur(event, 'lambda')}
                        labelWidth={59}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Charge</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.charge}
                        onChange={(event) => handleParamsChange(event, 'charge')}
                        onFocus={(event) => handleParamFocus(event, 'charge')}
                        onBlur={(event) => handleParamBlur(event, 'charge')}
                        labelWidth={54}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Min-Z</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.minZoom}
                        onChange={(event) => handleParamsChange(event, 'minZoom')}
                        onFocus={(event) => handleParamFocus(event, 'minZoom')}
                        onBlur={(event) => handleParamBlur(event, 'minZoom')}
                        labelWidth={44}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Max-Z</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.maxZoom}
                        onChange={(event) => handleParamsChange(event, 'maxZoom')}
                        onFocus={(event) => handleParamFocus(event, 'maxZoom')}
                        onBlur={(event) => handleParamBlur(event, 'maxZoom')}
                        labelWidth={46}
                        style={{ marginRight: 0 }}
                    />
                </FormControl>
                <br />
                <Typography className={classes.subTitle} style={{ marginTop: 5 }}>
                    ANNEALING PARAMETERS
                </Typography>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>A-Decay</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.alphaDecay}
                        onChange={(event) => handleParamsChange(event, 'alphaDecay')}
                        onFocus={(event) => handleParamFocus(event, 'alphaDecay')}
                        onBlur={(event) => handleParamBlur(event, 'alphaDecay')}
                        labelWidth={63}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>V-Decay</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.velocityDecay}
                        onChange={(event) => handleParamsChange(event, 'velocityDecay')}
                        onFocus={(event) => handleParamFocus(event, 'velocityDecay')}
                        onBlur={(event) => handleParamBlur(event, 'velocityDecay')}
                        labelWidth={63}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Min-A</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.minAlpha}
                        onChange={(event) => handleParamsChange(event, 'minAlpha')}
                        onFocus={(event) => handleParamFocus(event, 'minAlpha')}
                        onBlur={(event) => handleParamBlur(event, 'minAlpha')}
                        labelWidth={47}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>H-Temp</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.heatingCharge}
                        onChange={(event) => handleParamsChange(event, 'heatingCharge')}
                        onFocus={(event) => handleParamFocus(event, 'heatingCharge')}
                        onBlur={(event) => handleParamBlur(event, 'heatingCharge')}
                        labelWidth={58}
                    />
                </FormControl>
                <br />
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>H-Cutoff</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.heatingCutoff}
                        onChange={(event) => handleParamsChange(event, 'heatingCutoff')}
                        onFocus={(event) => handleParamFocus(event, 'heatingCutoff')}
                        onBlur={(event) => handleParamBlur(event, 'heatingCutoff')}
                        labelWidth={67}
                        style={{ marginRight: 0 }}   
                    />
                </FormControl>
                <Typography className={classes.subTitle} style={{ marginTop: 5 }}>
                    CENTERING
                </Typography>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>x</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.centreX}
                        onChange={(event) => handleParamsChange(event, 'centreX', true)}
                        onFocus={(event) => handleParamFocus(event, 'centreX')}
                        onBlur={(event) => handleParamBlur(event, 'centreX')}
                        labelWidth={9}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>y</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.centreY}
                        onChange={(event) => handleParamsChange(event, 'centreY', true)}
                        onFocus={(event) => handleParamFocus(event, 'centreY')}
                        onBlur={(event) => handleParamBlur(event, 'centreY')}
                        labelWidth={9}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Z-Scale</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.centreScale}
                        onChange={(event) => handleParamsChange(event, 'centreScale')}
                        onFocus={(event) => handleParamFocus(event, 'centreScale')}
                        onBlur={(event) => handleParamBlur(event, 'centreScale')}
                        labelWidth={56}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel className={classes.inputLabel}>Int-Scale</InputLabel>
                    <OutlinedInput
                        margin='dense'
                        value={currentParams.intScale}
                        onChange={(event) => handleParamsChange(event, 'intScale')}
                        onFocus={(event) => handleParamFocus(event, 'intScale')}
                        onBlur={(event) => handleParamBlur(event, 'intScale')}
                        labelWidth={66}
                    />
                </FormControl>
                <br />
                <Typography className={classes.subTitle} style={{ marginTop: 5 }}>
                    HELPER TEXT
                </Typography>
                <Typography className={classes.helperText}>
                    {warningText ?? helperText[paramInFocus]}
                </Typography>
                <Divider fullWidth />
            </DialogContent>
            <DialogActions>
                <Button className={classes.actionButton} onClick={handleClose}>
                    Cancel
                </Button>
                <Button className={classes.actionButton} onClick={handleApply}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}
  