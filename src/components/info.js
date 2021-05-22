import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        top: 70,
        zIndex: 1,
    },
    expansion: {
        background: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        color: "#484848",
    },
    title: {
        fontSize: 14,
        fontWeight: 700
    },
    text: {
        fontSize: 13,
        fontWeight: 500
    }
}));

const AccordionSummary = withStyles({
    root: {
        marginBottom: -1,
        minHeight: 45,
        '&$expanded': {
            minHeight: 45,
        },
    },
    content: {
        '&$expanded': {
        margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        paddingTop: 0,
        paddingBottom: 13
    },
}))(MuiAccordionDetails);  

function InfoPaper() {
    const classes = useStyles();
    const [mouseOver, setMouseOver] = React.useState(false);
    const handleMouseOver = (enterLeave) => {
        setMouseOver(enterLeave);
    };

    return (
        <div className={classes.root} style={{ opacity: mouseOver ? 0.7 : 0.3 }} onMouseEnter={() => handleMouseOver(true)} onMouseLeave={() => handleMouseOver(false)}>
            <Accordion square className={classes.expansion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon fontSize='small' />}
                >
                    <Typography className={classes.title}>WHAT IS BUBBLE-track FOR?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.text}>
                        This interface was created with the following objectives:<br />
                        (1) to facilitate an easy and efficient process of checking and fine-tuning force-directed graphs<br />
                        (2) to act as a dashboard for monitoring the visual quality of a large number of force-directed graphs
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default InfoPaper;
