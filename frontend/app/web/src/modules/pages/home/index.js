import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DashBoard from '../dashboard';
import {getBySportAndRegion} from '../../odds/api'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import useInterval from '../../utils/userinterval'

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
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Home() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0)
  const [data, setData] = React.useState()
  const [leaguesSelected, setLeaguesSelected] = React.useState()
  const [filteredEvents, setFilteredEvents] = React.useState()
  const [chips, setChips] = React.useState([])

  function handleFilter(chip) {
    const newChips = []
    const newLeagues = []
    const allLeagues = []
    chips.forEach(myChip => {
      if(myChip.label === chip.chip.label){
        if(!myChip.selected) {
          myChip.selected = true
          myChip.variant = 'default'
          newLeagues.push(myChip.label)
          allLeagues.push(myChip.label)
        } else {
          myChip.selected = false
          myChip.variant = 'outlined'
          allLeagues.push(myChip.label)
        }
      } else {
        if(myChip.selected) {
          newLeagues.push(myChip.label)
        }
        allLeagues.push(myChip.label)
      }
      newChips.push(myChip)
    })

    setChips(newChips)
    //leaguesSelected.push(league)
    if(newLeagues.length > 0) {
      setLeaguesSelected(newLeagues)
    }

    let allChipsOutlined = true

    newChips.forEach(newChip => {
      if(newChip.selected) allChipsOutlined = false
    })

    if(allChipsOutlined) setLeaguesSelected(allLeagues)

  }

  useInterval(() => {
    async function fetchSportData() {
      const odds = await getBySportAndRegion(tabs[value].search, 'belarus')
      setData(odds)
      setLeaguesSelected(odds.leagues)
      
      const newChips = []
      
      odds.leagues.forEach(league => {
        let assigned = false
        chips.forEach(chip => {
          if(chip.label === league && chip.selected) {
            newChips.push(chip)
            assigned = true
          } 
        })
        if(!assigned) {
          newChips.push({selected: false, label: league, variant: 'outlined'})
        }
      })

      
      
      setChips(newChips)
    }

    fetchSportData()
  }, 1000 * 60)

  React.useEffect(() => {
    async function fetchSport() {
      console.log(tabs[value].search)
      const odds = await getBySportAndRegion(tabs[value].search, 'belarus')
      setData(odds)
      setFilteredEvents(odds)
      setLeaguesSelected(odds.leagues)
      const newChips = []
      
      odds.leagues.forEach(league => {
        newChips.push({selected: false, label: league, variant: 'outlined'})
      })
      
      setChips(newChips)
    }
    
    fetchSport()
    
  }, [value])

  React.useEffect(() => {

    applyFilters()

  }, [leaguesSelected])

  function applyFilters() {
    if(data) {
      const leagues = data.leagues
      const events=[]

      data.events.forEach(event => {
        if(leaguesSelected && leaguesSelected.includes(event.league)) events.push(event)
      })
      
      setFilteredEvents({leagues: leagues, events: events})
    }
  }


  const tabs = [{label: 'football', search: 'football'}, {label: 'table tennis', search: 'table_tennis'}]

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  function clearFilter() {
    setFilteredEvents({leagues: data.leagues, events: data.events})
    resetChips()
  }

  function resetChips() {
    const newChips = []
    chips.forEach(chip => {
      chip.variant = 'outlined'
      chip.selected = false
      newChips.push(chip)
    })

    setChips(newChips)
  }

  function getFilters() {
    return(
    <Box m={3}>
      {chips.map(chip => {
                  return(
                    <Box display='inline-block' m={1} key = {chip.label}><Chip 
                    
                    label={chip.label}
                    onClick={() => handleFilter({chip})}
                    clickable
                    color="primary"
                    variant={chip.variant}
                  >
                  </Chip>
                  </Box> 
                  )
                })}
                <Button 
                color="secondary"
                onClick={clearFilter}
                >
                      Clear Filter
                  </Button>
                </Box>)
  }

  let oddsData
  let filters

  if(filteredEvents) {
    filters = getFilters()
    oddsData = <DashBoard events={filteredEvents.events}></DashBoard>
  } else {
    oddsData = <div>No events found</div>
    filters = <div></div>
  }

  return (
    <div className={classes.root}>
    
      <TabTitle value={value} index={0}>
        Soccer Odds and Betting Lines
      </TabTitle>
      <TabTitle value={value} index={1}>
        Tennis Odds and Betting Lines
      </TabTitle>
      <TabTitle value={value} index={2}>
        Basketball Odds and Betting Lines
      </TabTitle>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="sport tabs">
          {tabs.map((tab, index) => {
            return(
              <Tab key={tab.label} label={tab.label} {...a11yProps({index})} />
            )
          })}
          
        </Tabs>
      </AppBar>
               
      {filters}
      {oddsData}
      

    </div>
  )
}