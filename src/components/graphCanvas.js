import React, { Component } from 'react';
import * as d3 from "d3";

const linkColor = '#dedede';
const nodeColor = '#dedede';
const linkOpacity = 0.95;
const linkWidth = 1.5;
const maxLinkWidth = 10;

//Calculate node radius given constants (min and max radii), scaling parameter and node value
//Exponential scaling with parameter gamma, R(x) = maxR - (maxR - minR) * exp(gamma * value)
function radiusCalc(minR, maxR, gamma, value) {
    return maxR - (maxR - minR)*Math.exp(-gamma*(value - 1));
}

class HNetwork extends Component {
    state = {
        simulation: null,
        treeNodes: this.props.graph.nodesLinks.nodes,
        treeLinks: this.props.graph.nodesLinks.links,
        transform: null,
        zoom: null,
        width: 5000,
        height: 3500,
        viewWidth: 0,
        viewHeight: 0,
    };
    viewRef = React.createRef();

    _updateDim = () => {
        this.setState({
            viewWidth: this.viewRef.current.offsetWidth,
            viewHeight: this.viewRef.current.offsetHeight,
        });
    }

    componentDidMount() {
        try {
            this.drawChart(this);
        } catch(error) {
            console.log(error);
            this.props.handleGraphRenderError();
        } finally {
            this.props.setGraphLoading(false);
        }
        this.setState({
            viewWidth: this.viewRef.current.offsetWidth,
            viewHeight: this.viewRef.current.offsetHeight,
        });
        window.addEventListener("resize", this._updateDim);
    }

    componentWillUnmount() {
        this.state.simulation !== null && this.state.simulation.stop();
        window.removeEventListener("resize", this._updateDim);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isFrozen !== this.props.isFrozen) {
            this.props.isFrozen ? this.state.simulation.stop() : this.state.simulation.restart();
        } else if (prevProps.isHeating !== this.props.isHeating && this.props.isHeating) {
            this.state.simulation.alpha(1).alphaDecay(this.props.params.alphaDecay).velocityDecay(this.props.params.velocityDecay).alphaTarget(0).restart();
        } else if (JSON.stringify(prevProps.params) !== JSON.stringify(this.props.params) || prevProps.checkExpLen !== this.props.checkExpLen) {
            if (prevProps.params.lambda !== this.props.params.lambda) {
                const newLambda = this.props.params.lambda;
                this.state.simulation.force("link", d3.forceLink().links(this.state.treeLinks).id(function(d) { return d.id; }).distance(function(d) { return d.len*newLambda }).strength(1));
            } else if (prevProps.params.minZoom !== this.props.params.minZoom || prevProps.params.maxZoom !== this.props.params.maxZoom) {
                this.setState({
                    zoom: this.state.zoom.scaleExtent([this.props.params.minZoom, this.props.params.maxZoom]),
                });
            } else if (prevProps.params.minAlpha !== this.props.params.minAlpha) {
                this.state.simulation.alphaMin(this.props.params.minAlpha);
            } else {
                this._simulationUpdate(this, this.state.transform);
            }
        } else if (prevProps.zoomGo !== this.props.zoomGo) {
            this._zoomTo(this.state.zoom, this.props.params.centreX, this.props.params.centreY, this.props.params.centreScale);
        } else if (prevProps.centreGo !== this.props.centreGo) {
            const geoX = this.state.treeNodes.reduce((acc, curr) => acc + curr.x, 0)/this.state.treeNodes.length;
            const geoY = this.state.treeNodes.reduce((acc, curr) => acc + curr.y, 0)/this.state.treeNodes.length;
            this._zoomTo(this.state.zoom, geoX, geoY, this.props.params.centreScale);
        } else if (prevProps.locateXYS !== this.props.locateXYS) {
            var canvas = document.getElementById('canvas');
            if (this.props.locateXYS) {
                canvas.setAttribute('style', 'cursor: crosshair')
            } else {
                canvas.setAttribute('style', 'cursor: auto')
            }
        } else if ((prevProps.zoomXY === null && this.props.zoomXY !== null) || (prevProps.zoomXY !== null && this.props.zoomXY !== null && prevProps.zoomXY.id !== this.props.zoomXY.id)) {
            this._zoomTo(this.state.zoom, this.props.zoomXY.x, this.props.zoomXY.y, 1);
        }
    }

    _simulationUpdate = (compStat, transform) => {
        var canvas = document.getElementById('canvas');

        var { treeNodes, treeLinks, width, height } = compStat.state;
        var { params, checkExpLen } = compStat.props;

        if (canvas !== null) {
            var context = canvas.getContext("2d");

            context.save();
    
            context.clearRect(0, 0, width, height);
    
            context.translate(transform.x, transform.y);
            context.scale(transform.k, transform.k);
        
            // Draw links
            treeLinks.forEach(function(d, i) {
                var newLinkColor = linkColor,
                    newLinkWidth = linkWidth;
                if (checkExpLen) {
                    // ExpLen-Q
                    const actLen = Math.sqrt((d.target.x - d.source.x)**2 + (d.target.y - d.source.y)**2)/params.lambda;
                    const lenDiffFrac = Math.min(1, Math.abs(actLen - d.len)/d.len);

                    // Colour code
                    newLinkColor = `hsl(0, 100%, ${50*(2 - lenDiffFrac)}%)`;

                    // Adjust link width
                    newLinkWidth = linkWidth + lenDiffFrac*(maxLinkWidth - linkWidth);
                }

                context.beginPath();
                context.moveTo(d.source.x, d.source.y);
                context.lineTo(d.target.x, d.target.y);
                context.strokeStyle = newLinkColor;
                context.lineWidth = newLinkWidth;
                context.globalAlpha = linkOpacity;
                context.stroke();
            });

            // To reset lineWidth if the last link is selected
            context.lineWidth = linkWidth;
            context.stroke();

            // Draw nodes
            treeNodes.forEach(function(d, i) {
                var beginAngle = 0,
                endAngle = 2*Math.PI;

                var nodeRadius = d.type > 0 ? radiusCalc(params.minR, params.maxR, params.gamma, d.num) : params.nonNodeR;
                context.globalAlpha = 0.8;

                context.beginPath();
                context.arc(d.x, d.y, nodeRadius, beginAngle, endAngle);
                context.strokeStyle = "#fff";
                context.lineWidth = 0;
                context.stroke();
                
                context.fillStyle = nodeColor;
                context.fill();

                //draw circle border
                context.beginPath();
                context.arc(d.x, d.y, nodeRadius, 0, 2*Math.PI);
                context.strokeStyle = "#fff";
                context.stroke();
            });
    
            context.restore();
        } else {
            throw Error("canvas is null")
        }
    }

    _zoomTo = (zoom, x, y, zScale) => {
        var canvas = document.getElementById('canvas');
        var transform = d3.zoomIdentity;

        transform.k = zScale;
        d3.select(canvas).call(zoom.transform, transform)

        var dx = transform.applyX(x) - this.state.viewWidth/2,
            dy = transform.applyY(y) - this.state.viewHeight/2;
        transform.x -= dx;
        transform.y -= dy;
        d3.select(canvas).call(zoom.transform, transform)
    }

    drawChart = (compStat) => {

        const { params } = compStat.props;

        var canvas = document.getElementById("canvas");
        canvas.width = compStat.state.width;
        canvas.height = compStat.state.height;

        var transform = d3.zoomIdentity;

        var simulation = d3.forceSimulation()
            // .force("center", d3.forceCenter(compStat.width/2, compStat.height/2))
            .force("charge", d3.forceManyBody().strength(function(d) { return d.type > 0 ? -params.charge : 1 }))
            .force("collide", d3.forceCollide().strength(0.9).radius(function(d, i) { return d.type > 0 ? radiusCalc(params.minR, params.maxR, params.gamma, d.num) : 0 }))
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return d.len*params.lambda }).strength(1))
            .alphaDecay(params.alphaDecay)
            .velocityDecay(params.velocityDecay)
            .alphaMin(params.minAlpha);

        compStat.setState({
            simulation: simulation,
        });

        function zoomed(event) {
            transform = event.transform;
            compStat._simulationUpdate(compStat, transform);
            compStat.setState({
                transform: transform,
            });
        }

        var zoom = d3.zoom().scaleExtent([params.minZoom, params.maxZoom]).on("zoom", zoomed);
        compStat.setState({
            zoom: zoom,
        });

        d3.select(canvas)
            .call(d3.drag().subject(dragsubject).on("start", dragstarted).on("drag", dragged).on("end", dragended))
            .call(zoom);

        // zoom to geo_centre on initial render, timeout needed to wait for proper zoom
        setTimeout(function() {
            compStat._zoomTo(zoom, params.centreX, params.centreY, params.centreScale);
        }, 0);

        function dragsubject(event) {
            if (!compStat.props.isFrozen) {
                var i,
                x = transform.invertX(event.x),
                y = transform.invertY(event.y),
                dx,
                dy;

                if (compStat.props.locateXYS) {
                    compStat.props.handleSetCursorXYS(x, y, compStat.state.transform.k);
                } else {
                    for (i = compStat.state.treeNodes.length - 1; i >= 0; --i) {
                        var node = compStat.state.treeNodes[i];
                        dx = x - node.x;
                        dy = y - node.y;
    
                        var nodeRadius = radiusCalc(compStat.props.params.minR, compStat.props.params.maxR, compStat.props.params.gamma, node.num);
    
                        if (dx * dx + dy * dy <= nodeRadius * nodeRadius) {
                    
                            node.x = transform.applyX(node.x);
                            node.y = transform.applyY(node.y);
    
                            return node
                        }
                    }
                }
            }
        }

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.99).restart();
            event.subject.fx = transform.invertX(event.x);
            event.subject.fy = transform.invertY(event.y);
        }
        
        function dragged(event) {
            event.subject.fx = transform.invertX(event.x);
            event.subject.fy = transform.invertY(event.y);
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        function ticked() {

            var alpha = this.alpha(),
                chargeStrength;

            compStat.props.handleAlphaChange(alpha);

            if (alpha > compStat.props.params.heatingCutoff) {
                chargeStrength = -compStat.props.params.heatingCharge;
            } else {
                chargeStrength = -compStat.props.params.charge;
            }

            if (alpha <= compStat.props.params.minAlpha) {
                compStat.props.handleReheat(false);
            }

            compStat.state.treeLinks.forEach(function(d, i) {
                const x1 = d.source.x,
                    x2 = d.target.x,
                    y1 = d.source.y,
                    y2 = d.target.y;
          
                d.x = (x2 + x1)/2;
                d.y = (y2 + y1)/2;
            });

            this.force("charge", d3.forceManyBody().strength(chargeStrength))
                .force("collide", d3.forceCollide().strength(0.9).radius(function(d, i) { return d.type > 0 ? radiusCalc(compStat.props.params.minR, compStat.props.params.maxR, compStat.props.params.gamma, d.num) : 0 }));

            return compStat._simulationUpdate(compStat, transform);
        }

        try {
            simulation.nodes(compStat.state.treeNodes.concat(compStat.state.treeLinks))
                .on("tick", ticked);
        } catch (error) {
            console.log(error);
            simulation.stop();
            compStat.props.handleGraphRenderError();
        }

        try {
            simulation.force("link")
                .links(compStat.state.treeLinks);
        } catch (error) {
            console.log(error);
            simulation.stop();
            compStat.props.handleGraphRenderError();
        }

        if (compStat.props.graph.nodesFixed) {
            compStat.state.treeNodes.forEach(function(node) {
                if ('fxy' in node) {
                    node.x = node.fxy.x;
                    node.y = node.fxy.y;
                }
            });

            simulation.stop();
        }
    }

    render() {
        // const { graph, isFrozen, isHeating, locateXYS, zoomGo, centreGo, checkExpLen, zoomXY, params } = this.props;
        // const { handleReheat, handleSetCursorXYS, handleAlphaChange, handleGraphRenderError, setGraphLoading } = this.props;

        return (
            <div style={{ backgroundColor: "#292929", overflow: "hidden", position: 'absolute', top: 0, left: 0 }} id="snapshot" ref={this.viewRef}>
                <div style={{ overflowY: "hidden", overflowX: "hidden", minHeight: 400, height: "100vh", width: "100vw" }}>
                    <canvas
                        id={"canvas"}
                        style={{ 
                            display: "block",
                        }}
                        ref={el => (this.canvas = el)}
                    />
                </div>
            </div>
        )
    }
}

export default HNetwork;