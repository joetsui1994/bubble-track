# BUBBLE-track

This interface was created with the following objectives:
1. To facilitate an easy and efficient process of checking and fine-tuning force-directed graphs.
2. To act as a dashboard for monitoring the visual quality of a large number of force-directed graphs.

## What can you do with it?

### Graphs Visualisation

To upload your own graph, click **(+) ADD GRAPH** located in the drawer on the left of the screen and a dialog will appear. Two possible ways of uploading your own graph is possible:
1. Enter URL to download the desired graph. (*to be implemented*)
2. Upload graph in JSON format.

A JSON file with customised parameter specifications can also be added (*optional*).\
To see examples, go to (link).

### Quality Control

Once a graph has been uploaded and rendered successfully, a Graph-Card will appear in the drawer on the left, displaying details and properties of the corresponding graph. If you click the speedometer icon in the top right corner of the card, the following quanlity-scores will be computed and displayed:
1. **INTERSECT-Q**: this is the number of intersection/crossing between links in the rendered graph scaled relative to a fraction (default = 0.05) of the total number of links in the graph. For example, in a graph with 100 links and 5 intersections, the INTERSECT-Q score will be 5/(100/20) = 1. This fraction is set arbitrarily to account for the fact that the probability of any two links intersecting increases with the number of links (although not linearly). The total number of intersections found is also shown.
2. **LINK-Q**: this is the sum of the length of all links in the rendered graph scaled relative to the sum of the expected length of all links in the graph. The largest fractional difference between the rendered length and expected length of a given link is also shown.
3. **POTENTIAL-Q**: this is the total potential "energy" (borrowing from Physics) of the rendered graph, with `num` as the mass of each node. This arbitrary quantity can be used to track the spatial spread of the graph, with a sparser configuration leading to a smaller POTENTIAL-Q. In general, a graph with a small POTENTIAL-Q is visually better than one with a large POTENTIAL-Q.

### Annealing

Annealing (also a term borrowed from Physics) is a process in which the graph is "heated" to a higher temperature at which it is allowed to relax, before it is cooled to a hopefully more optimal configuration. Although it is generally unrealistic to expect the graph to settle to the global minimum, this method can help escape from suboptimal local minima and reduce the number of link-crossings.

A number of parameters can be specified for the annealing process:

`A-Decay` (Alpha-Decay) [0,1]: Tthe alpha decay rate determines how quickly the current alpha interpolates towards the desired target alpha, or how quickly the simulation cools. A higher decay rate causes the simulation to cool more quickly and as a result increases the probability of being stuck in a local minimum; a lower decay rate leads to better convergence but takes longer to run. The default value for A-Decay is 0.03.

### Parameters Tuning

Testing
