import React, { Component } from 'react'
import { Route } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './components/Home'
import CurrentDrive from './pages/CurrentDrive'
import PastDrive from './pages/PastDrive'
import ThingsMissed from './pages/ThingsMissed'

export default class App extends Component {
  static displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/CurrentDrive" component={CurrentDrive} />
        <Route path="/PastDrive" component={PastDrive} />
        <Route path="/ThingsMissed" component={ThingsMissed} />
      </Layout>
    )
  }
}
