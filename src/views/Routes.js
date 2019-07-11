// the main routes of our app are defined here using react-router
// https://reacttraining.com/react-router/web/example/basic

import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Account from './account/Account'
import Error from './misc/Error'
import Signup from './account/Signup'
import Login from './account/Login';
import Dashboard from './dashboard/Dashboard'
import Employees from './Employees/Employees'
// import ComingSoon from './misc/ComingSoon';
import ResetPassword from './account/ResetPassword';
import Settings from './Settings/Settings';
import Pulses from './Pulses/Pulses';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/reset-password" component={ResetPassword} />
    {/*<Route path="/dashboard" component={Dashboard} />*/}
    {/*<Route path="/employees" component={Employees} />*/}
    {/*<Route path="/settings" component={Settings} />*/}
    <Route path="/account" component={Account} />
    {/*<Route path="/pulses" component={Pulses} />*/}
    <Route component={Error} />
  </Switch>
)

export default Routes
