// return false if links do not intersect
const checkIntersect = (linkA, linkB) => {
    const isLinkA_vert = linkA.target.x - linkA.source.x === 0,
        isLinkB_vert = linkB.target.x - linkB.source.x === 0;
    
    if (isLinkA_vert && !isLinkB_vert) {
        // if linkA is vertical and linkB is not
        const linkB_eqn = getLinkEqn(linkB);
        const yInt = linkB_eqn(linkA.source.x);
        return ({ x: linkA.source.x, y: yInt });
    } else if (!isLinkA_vert && isLinkB_vert) {
        // if linkB is vertical and linkA is not
        const linkA_eqn = getLinkEqn(linkA);
        const yInt = linkA_eqn(linkB.source.x);
        return ({ x: linkB.source.x, y: yInt });
    } else if (isLinkA_vert && isLinkB_vert) {
        // if both links are vertical
        return false;
    } else {
        // if both links are not vertical
        const gradientA = (linkA.target.y - linkA.source.y)/(linkA.target.x - linkA.source.x),
            gradientB = (linkB.target.y - linkB.source.y)/(linkB.target.x - linkB.source.x);
        if (gradientA === gradientB) {
            // if linkA and linkB are parallel
            return false;
        } else {
            // solve for intersection-x
            const cA = linkA.target.y - gradientA*linkA.target.x,
                cB = linkB.target.y - gradientB*linkB.target.x;
            const xInt = (cA - cB)/(gradientB - gradientA);

            // solve for intersection-y
            const linkA_eqn = getLinkEqn(linkA);
            const yInt = linkA_eqn(xInt);

            return ({ x: xInt, y: yInt });
        }
    }
}

const getLinkEqn = (link) => {
    const gradient = (link.target.y - link.source.y)/(link.target.x - link.source.x);
    const yEqn = (x) => gradient*(x - link.target.x) + link.target.y;

    return yEqn;
};

const checkIntersectionContained = (intersectionXY, linkA, linkB) => {
    // check if intersection lies within segment A
    const intOnA = (linkA.source.y - intersectionXY.y)*(linkA.target.y - intersectionXY.y) <= 0 && (linkA.source.x - intersectionXY.x)*(linkA.target.x - intersectionXY.x) <= 0,
        intOnB = (linkB.source.y - intersectionXY.y)*(linkB.target.y - intersectionXY.y) <= 0 && (linkB.source.x - intersectionXY.x)*(linkB.target.x - intersectionXY.x) <= 0;

    return (intOnA && intOnB);
};

export default function findIntersections(links) {
    const intersections = links.reduce((acc, curr, index) => {
        const linkIntersections = links.reduce((linkAcc, linkCurr, linkIndex) => {
            if (linkIndex >= index) {
                if (curr.id !== linkCurr.id && ![curr.target.id, curr.source.id].includes(linkCurr.source.id) && ![curr.target.id, curr.source.id].includes(linkCurr.target.id)) {
                    const intersection = checkIntersect(curr, linkCurr);
                    if (intersection && checkIntersectionContained(intersection, curr, linkCurr)) {
                        linkAcc.push({ id: `${curr.id}_${linkCurr.id}`, x: intersection.x, y: intersection.y });
                    }
                }
                return linkAcc; 
            } else {
                return linkAcc; 
            }
        }, []);
        return acc.concat(linkIntersections);
    }, []);

    return intersections;
};