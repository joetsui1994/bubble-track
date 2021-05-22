export default function getPotentialQ(nodesLinks) {
    // get system potential energy considering all possible interactions
    const jR = nodesLinks.nodes.reduce((acc, curr, index) => {
        const jTmp = nodesLinks.nodes.reduce((nodeAcc, nodeCurr, nodeIndex) => {
            if (nodeIndex > index) {
                const rTmp = Math.sqrt((curr.x - nodeCurr.x)**2 + (curr.y - nodeCurr.y)**2);

                return nodeAcc + (curr.num*nodeCurr.num/rTmp);
            } else {
                return nodeAcc;
            }
        }, 0);

        return acc + jTmp;
    }, 0);

    return jR;
}