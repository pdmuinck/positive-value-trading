import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import Main from '../src/modules/routes'


function App() {
  return(
    <div>
      <Main></Main>
    </div>
  )
}

ReactDOM.render(
  <Router>
    <App/>
  </Router>, document.getElementById('root'));
