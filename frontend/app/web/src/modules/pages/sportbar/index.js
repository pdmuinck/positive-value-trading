import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DashBoard from '../dashboard';

function TabTitle(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      variant="h5"
      role="tabtitle"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabTitle.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function DashBoard() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue)
    getData
  }

  const tabs = ['Today', 'Soccer', 'Tennnis', 'Basketball']

  return (
    <div className={classes.root}>
    
      <TabTitle value={value} index={0}>
        Sports Betting Odds
      </TabTitle>
      <TabTitle value={value} index={1}>
        Soccer Odds and Betting Lines
      </TabTitle>
      <TabTitle value={value} index={2}>
        Tennis Odds and Betting Lines
      </TabTitle>
      <TabTitle value={value} index={3}>
        Basketball Odds and Betting Lines
      </TabTitle>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="sport tabs">
          {tabs.map((tab, index) => {
            return(
              <Tab label={tab} {...a11yProps({index})} />
            )
          })}
          
        </Tabs>
      </AppBar>

      <DashBoard sport={value}></DashBoard>

    </div>
  )
}
