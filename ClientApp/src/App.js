import React, { Component } from 'react'
import { Route } from 'react-router'
import { Layout } from './components/Layout'
import FetchData from './components/FetchData'
import Home from './components/Home'
import GetDirections from './pages/GetDirections'
import PastDrive from './pages/PastDrive'
import ThingsMissed from './pages/ThingsMissed'
import NewHome from './components/NewHome'
import './index.css'
export default class App extends Component {
  static displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path="/" component={NewHome} />
        <Route path="/GetDirections" component={GetDirections} />
        <Route path="/PastDrive" component={PastDrive} />
        <Route path="/ThingsMissed" component={ThingsMissed} />
      </Layout>
    )
  }
}
