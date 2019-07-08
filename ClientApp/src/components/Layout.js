import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { NavMenu } from './NavMenu'

export class Layout extends Component {
  static displayName = Layout.name

  render() {
    return (
      <section className="fullHeight">
        <NavMenu />
        <Container>{this.props.children}</Container>
      </section>
    )
  }
}
