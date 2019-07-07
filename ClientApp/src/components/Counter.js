import React, { Component } from 'react'

export class Counter extends Component {
  static displayName = Counter.name

  constructor(props) {
    super(props)
    this.state = { currentCount: 0 }
    this.incrementCounter = this.incrementCounter.bind(this)
  }

  incrementCounter() {
    this.setState({
      currentCount: this.state.currentCount + 1
    })
  }

  render() {
    return (
      <div>
        <h1>Past Drives You've Taken</h1>

        <p> This is the Past Drives page</p>

        <p>
          Current count: <strong>{this.state.currentCount}</strong>
        </p>

        <button className="btn btn-primary" onClick={this.incrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}
