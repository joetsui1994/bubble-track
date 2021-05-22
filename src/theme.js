import { createMuiTheme } from '@material-ui/core/styles';

const custom_theme = createMuiTheme({
    typography: {
        fontFamily: ['"PTRootUI"', 'Open Sans'].join(','),
    }
})

export default custom_theme;
