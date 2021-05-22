# BUBBLE-track

This interface was created with the following objectives:\
1. To facilitate an easy and efficient process of checking and fine-tuning force-directed graphs\
2. To act as a dashboard for monitoring the visual quality of a large number of force-directed graphs

## What can it do with it?

### Graphs Visualisation

To upload your own graph, click **(+) ADD GRAPH** located in the drawer on the left of the screen and a dialog will appear. Two possible ways of uploading your own graph is possible:\
1. Enter URL to download the desired graph (*to be implemented*)
2. Upload graph in JSON format

A JSON file with customised parameter specifications can also be added (*optional*).\
To see examples, go to (link).\

### Quality Control

Once a graph has been uploaded and rendered successfully, a Graph-Card will appear in the drawer on the left, displaying details and properties of the corresponding graph. If you click the speedometer icon in the top right corner of the card, the following quanlity-scores will be computed and displayed:
1. **INTERSECT-Q**: this is the number of intersection/crossing between links in the rendered graph scaled relative to a fraction (default = 0.05) of the total number of links in the graph. For example, in a graph with 100 links and 5 intersections, the INTERSECT-Q score will be 5/(100/20) = 1. This fraction is set arbitrarily to account for the fact that the probability of any two links intersecting increases with the number of links (although not linearly). The total number of intersections found is also shown.
2. **LINK-Q**: this is the sum of the length of all links in the rendered graph scaled relative to the sum of the expected length of all links in the graph. The largest fractional difference between the rendered length and expected length of a given link is also shown.
3. **POTENTIAL-Q**: this is the total potential "energy" (borrowing from Physics) of the rendered graph, with `num` as the mass of each node. This arbitrary quantity can be used to track the spatial spread of the graph, with a sparser configuration leading to a smaller POTENTIAL-Q. In general, a graph with a small POTENTIAL-Q is visually better than one with a large POTENTIAL-Q.

### Annealing

Annealing (also a term borrowed from Physics) is a process by which the graph is "heated" to a higher temperature at which it is allowed to relax, before it is cooled to a hopefully more optimal configuration. Although it is generally unrealistic to expect a global minimum to be found, this method can help the graph escape from suboptimal local minima.

A number of parameters can be specified for the annealing process:

### Parameters Tuning



### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
