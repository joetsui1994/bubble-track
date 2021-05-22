import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import WhatshotOutlinedIcon from '@material-ui/icons/WhatshotOutlined';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import TuneIcon from '@material-ui/icons/Tune';
import GetAppIcon from '@material-ui/icons/GetApp';
import GamepadIcon from '@material-ui/icons/Gamepad';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';
import { saveAs } from 'file-saver';
import clsx from 'clsx';
import custom_theme from './theme';

import './App.css';
import bubbleLogo from './bubble_logo.png';
import NoGraphDisplay from './noGraphPage';
import TreesDrawer from './components/Drawer';
import InfoPaper from './components/info';
import GraphCanvas from './components/graphCanvas';
import ParamsDialog from './components/paramsDialog';
import AddGraphsDialog from './components/AddGraphs';
import GraphLoadingDialog from './graphLoadingDialog';

import findIntersections from './QScores/findIntersections';
import linkLenCompare from './QScores/linkLenCompare';
import getPotentialQ from './QScores/potentialQ';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    background: '#292929',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#054a5c',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menuButton: {
    marginRight: 25,
    marginLeft: 2,
  },
  menuButtonHidden: {
    display: 'none',
  },
  actionButton: {
    marginRight: 0,
  },
  reheatButtonHeating: {
    color: '#f20000',
  },
  freeButtonFrozen: {
    color: '#00cce3',
  },
  title: {
    flexGrow: 1,
    fontWeight: 500,
    fontSize: 17,
  },
  xyText: {
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 3,
    padding: 10,
    margin: 5,
    backgroundColor: 'rgb(50, 50, 50, 0.7)',
    opacity: 0.8,
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  bubbleLogo: {
    height: 20,
    marginLeft: 20,
    verticalAlign: 'middle',
  }
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [graphs, setGraphs] = React.useState([]);
  const [graphLoading, setGraphLoading] = React.useState(false);
  const [graphRenderError, setGraphRenderError] = React.useState(false);
  const [currGraph, setCurrGraph] = React.useState(null);
  const [currParams, setCurrParams] = React.useState(null);
  const [paramsDialogOpen, setParamsDialogOpen] = React.useState(false);
  const [addGraphsDialogOpen, setAddGraphsDialogOpen] = React.useState(false);
  const [alpha, setAlpha] = React.useState(1);
  const [locateXYS, setLocateXYS] = React.useState(false);
  const [cursorXYS, setCursorXYS] = React.useState({ x: null, y: null });
  const [centreGo, setCentreGo] = React.useState(false);
  const [zoomGo, setZoomGo] = React.useState(false);
  const [zoomXY, setZoomXY] = React.useState(null);
  const [reheat, setReheat] = React.useState(false);
  const [freeze, setFreeze] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const _loadGraph = (graph, timeout) => {
    setGraphLoading(true);
    setCurrGraph(null);
    setTimeout(function() {
      setCurrParams(graph.params);
      setCurrGraph(graph);
    }, timeout);
  };

  const handleGraphRenderError = () => {
    handleRemoveGraph(currGraph.id);
    setGraphRenderError(true);
    setTimeout(function() {
      setGraphRenderError(false);
    }, 3000);
  };

  const handleAddGraph = (graphID, nodesLinks, graphInfo, graphParams, nodesFixed, calculateQ) => {
    // calculate QScores if calculateQ is true
    var intersections = null,
      lenQ = null,
      potentialQ = null;
    if (calculateQ) {
      intersections = findIntersections(nodesLinks.links);
      lenQ = linkLenCompare(nodesLinks.links, graphParams.lambda);
      potentialQ = getPotentialQ(nodesLinks);
    }
    
    const newGraph = {
      id: graphID,
      info: graphInfo,
      nodesLinks: nodesLinks,
      params: graphParams,
      nodesFixed: nodesFixed,
      intersections: intersections,
      lenQ: lenQ,
      potentialQ: potentialQ,
    };
    const newGraphsArray = graphs.concat([newGraph]);
    setGraphs(newGraphsArray);
    
    _loadGraph(newGraph, 2000);
  };

  const handleCalculateQ = (graph) => {
    const intersections = findIntersections(graph.nodesLinks.links),
      lenQ = linkLenCompare(graph.nodesLinks.links, graph.params.lambda),
      potentialQ = getPotentialQ(graph.nodesLinks);

    const newGraph = { ...graph, intersections: intersections, lenQ: lenQ, potentialQ: potentialQ };
    const newGraphsArray = graphs.map(g => g.id === graph.id ? newGraph : g);

    setCurrGraph(newGraph);
    setGraphs(newGraphsArray);
  };

  const handleRemoveGraph = (graphID) => {
    const newGraphsArray = graphs.filter(graph => graph.id !== graphID);
    setGraphs(newGraphsArray);

    if (currGraph !== null && currGraph.id === graphID) {
      setCurrGraph(null);
    }
  };

  const handleRetrieveGraph = (graph) => {
    // remove QScores
    graph = { ...graph, intersections: null, lenQ: null, potentialQ: null };
    const newGraphsArray = graphs.map(g => g.id === graph.id ? graph : g);

    setGraphs(newGraphsArray);
    _loadGraph(graph, 2000);
  };

  const handleExport = () => {
    const nodesLinksFileName = `${currGraph.id}_nodesLinks.json`,
      paramsFileName = `${currGraph.id}_params.json`;
    const nodesLinksBlob = new Blob([JSON.stringify(currGraph.nodesLinks)], { type: 'application/json', name: nodesLinksFileName }),
      paramsBlob = new Blob([JSON.stringify(currParams)], { type: 'application/json', name: paramsFileName });
    saveAs(nodesLinksBlob, nodesLinksFileName);
    saveAs(paramsBlob, paramsFileName);
  };

  const handleParamsDialogOpen = () => {
    setParamsDialogOpen(true);
  };

  const handleParamsDialogClose = () => {
    setParamsDialogOpen(false);
  };

  const handleParamsChange = (newParams) => {
    const newParams_copy = JSON.parse(JSON.stringify(newParams));
    const newGraph = { ...currGraph, params: newParams_copy };
    const newGraphsArray = graphs.map(g => g.id === currGraph.id ? newGraph : g);

    setCurrParams(newParams_copy);
    setCurrGraph(newGraph);
    setGraphs(newGraphsArray);
  };

  const handleAddGraphsDialogOpen = () => {
    setAddGraphsDialogOpen(true);
  };

  const handleAddGraphsDialogClose = () => {
    setAddGraphsDialogOpen(false);
  };

  const handleAlphaChange = (newAlpha) => {
    setAlpha(newAlpha.toFixed(4));
  };

  const handleSetCursorXYS = (x, y, s) => {
    setCursorXYS({ x: Math.round(x*100000)/100000, y: Math.round(y*100000)/100000, s: Math.round(s*100000)/100000 });
  };

  const handleLocateXYS = () => {
    setLocateXYS(!locateXYS);
  };

  const handleGeoCentre = () => {
    setCentreGo(!centreGo);
  };

  const handleZoomGo = () => {
    setZoomGo(!zoomGo);
  };

  const handleZoomXY = (intersection) => {
    setZoomXY(intersection);
  };

  const handleReheat = (isHeating) => {
    freeze && setFreeze(false);
    setReheat(isHeating);
  };

  const handleFreeze = () => {
    setFreeze(!freeze);
  };

  React.useEffect(() => {
    setZoomGo(false);
  }, [currGraph]);

  return (
    <ThemeProvider theme={custom_theme}>
      <div className={classes.root}>
        <AppBar position="absolute" elevation={2} className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon fontSize='small' />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              BUBBLE-track
              <img src={bubbleLogo} className={classes.bubbleLogo}  alt="bubbleLogo"/>
            </Typography>
            <Typography variant="body1" color="inherit" className={classes.xyText}>
              alpha: {alpha}
            </Typography>
            <Typography variant="body1" color="inherit" className={classes.xyText}>
              x: {cursorXYS.x ?? 'NULL'}
            </Typography>
            <Typography variant="body1" color="inherit" className={classes.xyText}>
              y: {cursorXYS.y ?? 'NULL'}
            </Typography>
            <Typography variant="body1" color="inherit" className={classes.xyText}>
              k: {cursorXYS.s ?? 'NULL'}
            </Typography>
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color="inherit"
              aria-label="export graph"
              onClick={handleExport}
              className={classes.actionButton}
            >
              <GetAppIcon fontSize='small' />
            </IconButton>
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color={locateXYS ? '#484848' : "inherit"}
              aria-label="locate xy"
              onClick={handleLocateXYS}
              className={classes.actionButton}
            >
              <GamepadIcon fontSize='small' />
            </IconButton>
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color="inherit"
              aria-label="change grpah parameters"
              onClick={handleParamsDialogOpen}
              className={classes.actionButton}
            >
              <TuneIcon fontSize='small' />
            </IconButton>
            { currParams === null ? null : <ParamsDialog open={paramsDialogOpen} params={currParams} handleClose={handleParamsDialogClose} handleParamsApply={handleParamsChange} /> }
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color="inherit"
              aria-label="centre graph"
              onClick={handleZoomGo}
              className={classes.actionButton}
            >
              <GpsFixedIcon fontSize='small' />
            </IconButton>
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color="inherit"
              aria-label="go to geometric centre"
              onClick={handleGeoCentre}
              className={classes.actionButton}
            >
              <BlurCircularIcon fontSize='small' />
            </IconButton>
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color="inherit"
              aria-label="freeze graph"
              onClick={handleFreeze}
              className={clsx(classes.actionButton, freeze && classes.freeButtonFrozen)}
            >
              <AcUnitIcon fontSize='small' />
            </IconButton>
            <IconButton
              disabled={currGraph === null}
              edge="end"
              color="inherit"
              aria-label="reheat graph"
              onClick={() => handleReheat(true)}
              className={clsx(classes.actionButton, reheat && classes.reheatButtonHeating)}
            >
              <WhatshotOutlinedIcon fontSize='small' />
            </IconButton>
          </Toolbar>
        </AppBar>
        <TreesDrawer
          open={open}
          graphs={graphs}
          currGraph={currGraph}
          handleCalculateQ={handleCalculateQ}
          handleRemoveGraph={handleRemoveGraph}
          handleRetrieveGraph={handleRetrieveGraph}
          handleDrawerClose={handleDrawerClose}
          handleAddGraphsDialogOpen={handleAddGraphsDialogOpen}
          handleZoomXY={handleZoomXY}
        />
        <AddGraphsDialog
          open={addGraphsDialogOpen}
          graphs={graphs}
          handleClose={handleAddGraphsDialogClose}
          handleAddGraph={handleAddGraph}
        />
        <GraphLoadingDialog
          graphLoading={graphLoading}
          graphRenderError={graphRenderError}
        />
        <div className={classes.content}>
          <InfoPaper />
          {
            currGraph === null ?
            <NoGraphDisplay drawerOpen={open} />
            :
            <GraphCanvas
              graph={currGraph}
              isFrozen={freeze}
              isHeating={reheat}
              handleReheat={handleReheat}
              locateXYS={locateXYS}
              handleSetCursorXYS={handleSetCursorXYS}
              zoomGo={zoomGo}
              centreGo={centreGo}
              zoomXY={zoomXY}
              handleAlphaChange={handleAlphaChange}
              params={currParams}
              handleGraphRenderError={handleGraphRenderError}
              setGraphLoading={setGraphLoading}
            />
          }
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
