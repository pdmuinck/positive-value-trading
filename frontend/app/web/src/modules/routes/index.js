import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/home'
import Event from '../event/detail'


export default function Main() {

    return(
        <main>
            <Switch>
                <Route exact path='/'><Home></Home></Route>
                
                <Route path='/event/:eventKey' render={(props) => {
                                return (<Event {...props}></Event>)
                            }}>
                </Route>
            </Switch>
        </main>
    )

}