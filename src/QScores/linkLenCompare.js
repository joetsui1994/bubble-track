export default function linkLenCompare(links, lambda) {
    var totalExpLen = 0,
        totalActLen = 0,
        maxLenDiffFrac = 0;

    links.forEach((link) => {
        // get total sum of expected branch lengths
        totalExpLen = totalExpLen + link.len;
        
        // get total sum of actual branch lengths
        const linkActLen = Math.sqrt((link.target.x - link.source.x)**2 + (link.target.y - link.source.y)**2)/lambda;
        totalActLen = totalActLen + linkActLen;

        // get maximum branch length difference
        const lenDiffFrac = Math.abs(linkActLen - link.len)/link.len;
        if (lenDiffFrac > maxLenDiffFrac) {
            maxLenDiffFrac = lenDiffFrac;
        }
    });

    return ({ lenDiffFrac: totalActLen/totalExpLen, maxLenDiffFrac: maxLenDiffFrac });
};