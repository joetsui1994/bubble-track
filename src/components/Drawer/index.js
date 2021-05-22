import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';

import GraphCard from './graphCard';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        height: '100vh',
        background: '#3d3d3d',
        overflowY: 'hidden',
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
        },
    },
    drawerContainer: {
        height: '100%',
        paddingBottom: 10,
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        color: '#fff',
        ...theme.mixins.toolbar,
    },
    divider: {
        background: '#5c5c5c',
    },
    actionButton: {
        borderRadius: 0,
        fontSize: 16,
        fontWeight: 700,
        height: 55,
        width: drawerWidth,
        '&:disabled': {
            backgroundColor: '#d4d4d4'
        }
    },
}));

function TreesDrawer(props) {
    const classes = useStyles();
    const { open, graphs, currGraph } = props;
    const { handleDrawerClose, handleAddGraphsDialogOpen, handleCalculateQ, handleRemoveGraph, handleRetrieveGraph, handleZoomXY } = props;

    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
        >
            <div className={classes.toolbarIcon}>
                <IconButton
                    color="inherit"
                    onClick={handleDrawerClose}
                >
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider className={classes.divider} />
            <Button
                disabled={true}
                elevation={0}
                disableRipple={true}
                variant="contained"
                style={{ borderTop: '0.1px solid #d4d4d4' }}
                className={classes.actionButton}
                // onClick={handleAddGraphsDialogOpen}
                startIcon={<SettingsEthernetIcon />}
            >
                EIGEN
            </Button>
            <Button
                elevation={0}
                disableRipple={true}
                variant="contained"
                style={{ borderBottom: '0.1px solid #d4d4d4' }}
                className={classes.actionButton}
                onClick={handleAddGraphsDialogOpen}
                startIcon={<AddIcon />}
            >
                ADD GRAPH(S)
            </Button>
            <div className={classes.drawerContainer}>
                {
                    graphs.map((graph, i) => (
                        <GraphCard
                            key={i}
                            index={i+1}
                            graph={graph}
                            active={currGraph !== null && graph.id === currGraph.id}
                            handleCalculateQ={handleCalculateQ}
                            handleRemoveGraph={handleRemoveGraph}
                            handleRetrieveGraph={handleRetrieveGraph}
                            handleZoomXY={handleZoomXY}
                        />
                    ))
                }
            </div>
            <Divider className={classes.divider} />
        </Drawer>
    );
}

export default TreesDrawer;
