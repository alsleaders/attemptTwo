import React, { Component } from 'react'
import { Map } from 'mapbox-gl'
import PropTypes from 'prop-types'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

class Geocoder extends Component {
  static contextTypes = { map: PropTypes.object.isRequired }

  // context: {
  //   map: Map
  // }

  componentDidMount() {
    const { map } = this.context

    map.addControl(
      new MapboxGeocoder({
        TOKEN
      })
    )
  }

  render() {
    return null
  }
}

export default Geocoder
