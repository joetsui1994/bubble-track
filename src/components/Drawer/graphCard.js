import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SpeedIcon from '@material-ui/icons/Speed';
import ReplayIcon from '@material-ui/icons/Replay';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const drawerWidth = 300;

// intersection QScore is scaled relative to intersectionQ_scale% of the total number of links
// if the number of intersection is comparable to intersectionQ_scale% of the total number of links -> BAD
// this is an arbitrary scaling factor
const intersectionQ_scale = 5;

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 10,
        borderRadius: 0,
        padding: 10,
        paddingBottom: 12, 
        opacity: 0.9,
        width: drawerWidth - 20,
        overflow: 'auto',
    },
    graphIndex: {
        lineHeight: '18px',
        minWidth: 18,
        display: 'inline-block',
        marginRight: 5,
        padding: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        fontWeight: 500,
        border: '1px solid #000',
    },
    activeGraphIndex: {
        backgroundColor: '#054a5c',
        color: '#fff',
    },
    graphID: {
        fontSize: 15,
        fontWeight: 700,
        maxWidth: 170,
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        marginBottom: -7,
    },
    text: {
        fontSize: 12,
        fontWeight: 300,
        whiteSpace: 'normal',
        cursor: 'pointer',
        display: 'inline-block',
    },
    scoreBar: {
        height: 6,
        borderRadius: 2,
        display: 'inline-block',
    },
    intersectionArrows: {
        display: 'inline-block',
        margin: 0,
    },
    subText: {
        display: 'block',
        fontSize: 9,
        fontWeight: 300,
        marginTop: -4,
    },
    actionButtonsContainer: {
        display: 'inline-block',
        float: 'right',
    },
    actionButton: {
        height: 15,
        width: 15,
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
}));

function score_bar(score, maxBarWidth, barHeight, styleClass, inv=false) {
    return <div className={styleClass} style={{ width: score ? Math.max(score*maxBarWidth, barHeight) : `${barHeight}px`, height: `${barHeight}px`, backgroundColor: `hsl(${(inv ? (1 - score)*100 : score*100)}, 70%, 50%)` }} />
}

function GraphCard(props) {
    const classes = useStyles();
    const { index, graph, active } = props;
    const { handleCalculateQ, handleRemoveGraph, handleRetrieveGraph, handleZoomXY } = props;

    const [mouseOver, setMouseOver] = React.useState(false);
    const handleMouseOver = (enterLeave) => {
        setMouseOver(enterLeave);
    };

    const [intersectionCount, setIntersectionCount] = React.useState(0);
    const handleNextIntersection = () => {
        if (graph.intersections !== null && intersectionCount <= graph.intersections.length - 2) {
            handleZoomXY(graph.intersections[intersectionCount + 1]);
            setIntersectionCount(intersectionCount + 1);
        }
    };
    const handlePreviousIntersection = () => {
        if (graph.intersections !== null && intersectionCount >= 1) {
            handleZoomXY(graph.intersections[intersectionCount - 1]);
            setIntersectionCount(intersectionCount - 1);
        }
    };
    const handleGoToIntersection = () => {
        if (graph.intersections !== null) {
            handleZoomXY(null);
            setTimeout(function() {
                handleZoomXY(graph.intersections[intersectionCount]);
            }, 10);  // setTimeout to allow zoomXY to be first set to null
        }
    };

    const _calculateQ = (graph) => {
        setIntersectionCount(0);
        handleCalculateQ(graph);
    };

    useEffect(() => {
        setIntersectionCount(0);
    }, [active]);

    return (
        <Paper elevation={1} className={classes.root} style={{ opacity: mouseOver ? 0.7 : 0.9 }} onMouseEnter={() => handleMouseOver(true)} onMouseLeave={() => handleMouseOver(false)}>
            <div className={clsx(classes.graphIndex, active && classes.activeGraphIndex)}>{index}</div>
            <Typography className={classes.graphID}>
                {graph.id}
            </Typography>
            <div className={classes.actionButtonsContainer}>
                <IconButton
                    disabled={!active}
                    color="inherit"
                    className={classes.actionButton}
                    onClick={() => _calculateQ(graph)}
                >
                    <SpeedIcon fontSize='small' />
                </IconButton>
                <IconButton
                    color="inherit"
                    className={classes.actionButton}
                    onClick={() => handleRetrieveGraph(graph)}
                >
                    <ReplayIcon fontSize='small' />
                </IconButton>
                <IconButton
                    color="inherit"
                    className={classes.actionButton}
                    onClick={() => handleRemoveGraph(graph.id)}
                >
                    <ClearIcon fontSize='small' />
                </IconButton>
            </div>
            <br />
            <Typography className={classes.text}>
                <span style={{ fontWeight: 700 }}>INFO: </span>{graph.info}
            </Typography>
            <br />
            <Typography className={classes.text}>
                <span style={{ fontWeight: 700 }}>NODE_NUM: </span>{graph.nodesLinks.nodes.length}
            </Typography>
            <br />
            <Typography className={classes.text}>
                <span style={{ fontWeight: 700 }}>EDGE_NUM: </span>{graph.nodesLinks.links.length}
            </Typography>
            <br />
            {
                graph.intersections === null ?
                null
                :
                <Fragment>
                    {score_bar(Math.min((graph.intersections.length/(graph.nodesLinks.links.length/intersectionQ_scale)), 1), 120, 6, classes.scoreBar, true)}
                    <Typography className={classes.text}>
                        &nbsp;&nbsp;(INTERSECT-Q)
                    </Typography>
                    <IconButton
                        disabled={!active || intersectionCount === 0}
                        aria-label="previous intersection"
                        className={classes.intersectionArrows}
                        size="small"
                        onClick={handlePreviousIntersection}
                    >
                        <ArrowLeftIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        disabled={!active || !graph.intersections.length || intersectionCount === graph.intersections.length - 1}
                        aria-label="next intersection"
                        className={classes.intersectionArrows}
                        size="small"
                        onClick={handleNextIntersection}
                    >
                        <ArrowRightIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        disabled={!active || !graph.intersections.length}
                        aria-label="go to intersection"
                        className={classes.intersectionArrows}
                        size="small"
                        onClick={handleGoToIntersection}
                    >
                        <RadioButtonCheckedIcon style={{ fontSize: 12 }} />
                    </IconButton>
                    <Typography className={classes.subText}>
                        SCORE_BAR IS SCALED RELATIVE TO EDGE_NUM/{intersectionQ_scale}
                    </Typography>
                    <Typography className={classes.subText}>
                        (INTERSECTION_NUM: {graph.intersections.length})
                    </Typography>
                </Fragment>
            }
            {
                graph.lenQ === null ?
                null
                :
                <Fragment>
                    {score_bar(Math.min(graph.lenQ.lenDiffFrac % 1, 1), 120, 6, classes.scoreBar, true)}
                    <Typography className={classes.text}>
                        &nbsp;&nbsp;({Math.round(graph.lenQ.lenDiffFrac*10000)*100/10000}% of ExpLen)
                    </Typography>
                    <Typography className={classes.subText}>
                        (MAX. LEN_DIFF: {Math.round(graph.lenQ.maxLenDiffFrac*10000)/10000})
                    </Typography>
                </Fragment>
            }
            {
                graph.potentialQ === null ?
                null
                :
                <Fragment>
                    <Typography className={classes.text}>
                        POTENTIAL-Q: {Math.round(graph.potentialQ*10000)/10000}
                    </Typography>
                    <Typography className={classes.subText}>
                        (LOWER POTENTIAL-Q = BETTER)
                    </Typography>
                </Fragment>
            }
        </Paper>
    );
}

export default GraphCard;
