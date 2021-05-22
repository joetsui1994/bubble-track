import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { validateFile, fileSizeDisplay } from './fileValidation';

const defaultParams =  {
    minR: 7,
    maxR: 200,
    gamma: 0.1,
    nonNodeR: 5,
    lambda: 15000000,
    charge: 200,
    minZoom: 0.05,
    maxZoom: 6,
    alphaDecay: 0.03,
    velocityDecay: 0.1,
    minAlpha: 0.001,
    heatingCharge: 5000,
    heatingCutoff: 0.1,
    centreX: -167.2703,
    centreY: -1547.4755,
    centreScale: 0.1,
    intScale: 0.5,
};

const CustomTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#054a5c',
        },
        '& .MuiFilledInput-underline:after': {
            borderBottomColor: '#054a5c',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#054a5c',
        },
    },
})(TextField);

const useStyles = makeStyles((theme) => ({
    actionButton: {
        color: '#484848',
        fontWeight: 700,
    },
    subTitle: {
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 10,
        // display: 'inline-block',
    },
    helperText: {
        marginTop: -5,
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 300,
        lineHeight: '15px',
    },
    fileInput: {
        display: 'none',
    },
    uploadButton: {
        backgroundColor: '#054a5c',
        color: '#fff',
        padding: 10,
        width: 100,
        marginRight: 20,
        boxShadow: 1,
        marginBottom: 10,
        marginTop: -5,
        '&:hover': {
            backgroundColor: '#054a5c',
            opacity: 0.8,
        }
    },
    fileInfo: {
        fontSize: 11,
        fontWeight: 300,
        maxWidth: 220,
        display: 'inline-block',
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    checkboxText: {
        display: 'inline-block',
        fontSize: 13,
        fontWeight: 500,
    },
    checkbox: {
        padding: 0,
        marginLeft: 15,
        color: '#054a5c',
        '&$checked': {
            color: '#054a5c',
        },
        '&$disabled': {
            color: '#bfbfbf',
        }
    },
    checked: {},
    disabled: {},
    urlInput: {
        width: 300,
        margin: 0,
        marginBottom: 15
    },
    graphIdInput: {
        marginTop: -5,
        marginBottom: 15
    },
    loadGraphButton: {
        width: 15,
        height: 15,
        margin: 10,
        marginLeft: 15,
        '&:hover': {
            backgroundColor: 'transparent'
        }
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
        width: 350,
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

export default function FormDialog(props) {
    const classes = useStyles();

    const { open, graphs } = props;
    const { handleClose, handleAddGraph } = props;

    const [newGraphID, setNewGraphID] = React.useState('');
    const [nodesFixed, setNodesFixed] = React.useState(false);
    const [calculateQ, setCalculateQ] = React.useState(true);
    const [waitingForFileUpload, setWaitingForFileUpload] = React.useState(false);
    const [helperMessage, setHelperMessage] = React.useState('N/A');
    const [helperMessageTimeout, setHelperMessageTimeout] = React.useState(null);
    const [nodesLinksUpload, setNodesLinksUpload] = React.useState({
        fileName: 'N/A',
        fileSize: 'N/A',
        content: null,
    });
    const [graphParamsUpload, setGraphParamsUpload] = React.useState({
        fileName: 'N/A',
        fileSize: 'N/A',
        content: null,
    });

    const _generateNewGraphID = () => {
        const currIDs = graphs.map(graph => graph.id);
        var currNum = currIDs.length + 1,
            newID = `Untitled-Graph-${currNum}`;

        while (currIDs.includes(newID)) {
            currNum = currNum + 1;
            newID = `Untitled-Graph-${currNum}`
        }

        return newID;
    }

    const handleDialogClose = () => {
        handleClose();
        setNodesLinksUpload({
            fileName: 'N/A',
            fileSize: 'N/A',
            content: null,
        });
        setGraphParamsUpload({
            fileName: 'N/A',
            fileSize: 'N/A',
            content: null,
        });
        setWaitingForFileUpload(false);
        setNodesFixed(false);
        setCalculateQ(true);
    }

    const handleGraphIDChange = (event) => {
        setNewGraphID(event.target.value);
    }

    const handleNodesFixedChange = () => {
        setNodesFixed(!nodesFixed);
    }

    const handleCalculateQChange = () => {
        setCalculateQ(!calculateQ);
    }

    const handleAdd = () => {
        const currIDs = graphs.map(graph => graph.id);
        if (currIDs.includes(newGraphID)) {
            handleHelperMessageChange('Graph ID already exists.');
        } else {
            const today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate(),
            time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
            const dateTime = `${date}_${time}`;
            const graphInfo = `${nodesLinksUpload.fileName}, ${dateTime}`;
            handleAddGraph(newGraphID, nodesLinksUpload.content, graphInfo, _mergeUploadedParams(graphParamsUpload.content) ?? defaultParams, nodesFixed, nodesFixed && calculateQ);
            handleDialogClose();
        }
    };

    const handleHelperMessageChange = (message) => {
        setHelperMessage(message);
        var newTimeout = setTimeout(function() {
            setHelperMessage('N/A');
        }, 2000);

        // reset old timeout if exists
        if (helperMessageTimeout !== null) {
            clearTimeout(helperMessageTimeout);
            setHelperMessageTimeout(newTimeout);
        } else {
            setHelperMessageTimeout(newTimeout);
        }
    };

    const _mergeUploadedParams = (params) => {
        if (params === null) {
            return null;
        } else {
            var paramsCopy = JSON.parse(JSON.stringify(params));
            Object.entries(defaultParams).forEach(([key, value]) => {
                if (!(key in paramsCopy)) {
                    paramsCopy[key] = value;
                }
            });
    
            return paramsCopy;
        }
    };

    const _readUploadedFileAsText = (inputFile) => {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
                handleHelperMessageChange('File successfully uploaded.');
                reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(inputFile);
        });
    };

    const handleJsonUpload = async (event, contentHandler) => {
        event.persist();

        if (!event.target || !event.target.files || event.target.files[0] === null) {
            return;
        }

        setWaitingForFileUpload(true);
        contentHandler({
            fileName: 'N/A',
            fileSize: 'N/A',
            content: null,
        });

        const fileList = event.target.files;

        // Uploads will push to the file input's `.files` array. Get the last uploaded file.
        const latestUploadedFile = fileList.item(fileList.length - 1);

        // Validate uploaded file
        const fileObject = validateFile(latestUploadedFile);

        if (!fileObject.status) {
            try {
                const fileContent = await _readUploadedFileAsText(latestUploadedFile);
                const contentJSON = JSON.parse(fileContent);
                contentHandler({
                    fileName: fileObject.fileName,
                    fileSize: fileObject.fileSize,
                    content: contentJSON,
                });
                handleHelperMessageChange(`${fileObject.fileName} successfully uploaded.`);
                setWaitingForFileUpload(false);
            } catch (e) {
                console.log(e);
                handleHelperMessageChange('Problem parsing input file.');
                setWaitingForFileUpload(false);
            }
        } else {
            handleHelperMessageChange(fileObject.errMessage);
        }
    };

    useEffect(() => {
        setNewGraphID(_generateNewGraphID());
    }, [open]);

    return (
        <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Graph(s)</DialogTitle>
            <DialogContent>
                <Typography className={classes.subTitle}>
                    GRAPH IDENTIFIER:
                </Typography>
                <CustomTextField
                    label=""
                    placeholder="untitled-graph-01"
                    fullWidth
                    margin="dense"
                    className={classes.graphIdInput}
                    inputProps={{style: {
                        fontSize: 13,
                    }}}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleGraphIDChange}
                    value={newGraphID}
                />
                <Typography className={classes.subTitle}>
                    NODES/LINKS.json WEB LINK:
                </Typography>
                <CustomTextField
                    disabled={true}
                    label="URL"
                    placeholder="https://link-to-nodes_links.json"
                    fullWidth
                    margin="dense"
                    className={classes.urlInput}
                    inputProps={{style: {
                        fontSize: 13,
                    }}}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                />
                <IconButton
                    aria-label="download json"
                    className={classes.loadGraphButton}
                    disabled={true}
                >
                    <SystemUpdateAltIcon disableRipple fontSize="medium" />
                </IconButton>
                <Typography className={classes.subTitle}>
                    NODES/LINKS.json:
                </Typography>
                <input
                    accept=".json"
                    disabled={waitingForFileUpload}
                    className={classes.fileInput}
                    id="graph_file-upload"
                    multiple={false}
                    type="file"
                    onChange={(event) => handleJsonUpload(event, setNodesLinksUpload)}
                />
                <label htmlFor="graph_file-upload">
                    <Button variant="contained" component="span" className={classes.uploadButton}>
                        Upload
                    </Button>
                </label>
                <Typography className={classes.fileInfo}>
                    FILENAME: {nodesLinksUpload.fileName}
                    <br />
                    FILESIZE: {nodesLinksUpload.fileSize === 'N/A' ? 'N/A' : fileSizeDisplay(nodesLinksUpload.fileSize)}
                </Typography>
                <Divider fullWidth style={{ margin: "10px 0px 10px 0px" }}/>
                <Typography className={classes.subTitle}>
                    GRAPH_PARAMS.json WEB LINK:
                </Typography>
                <CustomTextField
                    disabled={true}
                    label="URL"
                    placeholder="https://link-to-graph_params.json"
                    fullWidth
                    margin="dense"
                    className={classes.urlInput}
                    inputProps={{style: {
                        fontSize: 13,
                    }}}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                />
                <IconButton
                    aria-label="download json"
                    className={classes.loadGraphButton}
                    disabled={true}
                >
                    <SystemUpdateAltIcon disableRipple fontSize="medium" />
                </IconButton>
                <br />
                <Typography className={classes.subTitle}>
                    GRAPH_PARAMS.json:
                </Typography>
                <input
                    accept=".json"
                    disabled={waitingForFileUpload}
                    className={classes.fileInput}
                    id="params_file-upload"
                    multiple={false}
                    type="file"
                    onChange={(event) => handleJsonUpload(event, setGraphParamsUpload)}
                />
                <label htmlFor="params_file-upload">
                    <Button variant="contained" component="span" className={classes.uploadButton}>
                        Upload
                    </Button>
                </label>
                <Typography className={classes.fileInfo}>
                    FILENAME: {graphParamsUpload.fileName}
                    <br />
                    FILESIZE: {graphParamsUpload.fileSize === 'N/A' ? 'N/A' : fileSizeDisplay(graphParamsUpload.fileSize)}
                </Typography>
                <br />
                <Typography className={classes.checkboxText}>
                    Graph has been previously annealed:
                </Typography>
                <Checkbox
                    checked={nodesFixed}
                    classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                    }}
                    onChange={handleNodesFixedChange}
                />
                <br />
                <Typography className={classes.checkboxText}>
                    Calculate quality scores:
                </Typography>
                <Checkbox
                    disabled={!nodesFixed}
                    checked={nodesFixed && calculateQ}
                    classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                        disabled: classes.disabled,
                    }}
                    onChange={handleCalculateQChange}
                />
                <br />
                <Typography className={classes.subTitle} style={{ marginTop: 10 }}>
                    HELPER TEXT
                </Typography>
                <Typography className={classes.helperText}>
                    {helperMessage}
                </Typography>
                <Divider fullWidth />
            </DialogContent>
            <DialogActions>
                <Button className={classes.actionButton} onClick={handleDialogClose}>
                    Cancel
                </Button>
                <Button disabled={nodesLinksUpload.content === null} className={classes.actionButton} onClick={handleAdd}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
  