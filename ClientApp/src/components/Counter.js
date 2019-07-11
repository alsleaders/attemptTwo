import React, { Component } from 'react'
import { Map } from 'mapbox-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

  mapboxgl.accessToken =TOKEN

export class Counter extends Component {
var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [0.11256, 52.201733],
        zoom: 15
      });

  render() {
    return (
      <div>
        map
      </div>
    )
  }
}
