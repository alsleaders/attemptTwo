import React, { Component } from 'react'
import '../CSS/CurrentDrive.css'
// import Script from 'react-sscript'
import axios from 'axios'
import ReactMapGL, { NavigationControl } from 'react-map-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

class GetDirections extends Component {
  mapRef = {}
  directionsThing = {}
  // get props from add button on thingsMissed
  state = {
    map: null,
    viewport: {
      zoom: 4,
      latitude: 28.46,
      // this is up to 90
      longitude: -81.35
      // this is up to 180
    },
    mapList: [],
    cityInfo: null
  }

  //append that location to the map list

  componentDidMount() {
    console.log(this.mapRef)
    let mapboxobj = this.mapRef.getMap()
    console.log({ mapboxobj })
    // eslint-disable-next-line no-undef
    this.directionsThing = new MapboxDirections({
      accessToken: TOKEN
    })
    mapboxobj.addControl(this.directionsThing, 'top-left')
    axios.get('/api/location').then(resp => {
      this.setState({
        mapList: resp.data
      })
    })

    console.log('after', { mapboxobj })
    console.log(this.mapRef)

    this.directionsThing.on('destination', () => {
      console.log('hey destination!')
      console.log(this.directionsThing)
      // console.log(this.directionsThing.actions.addWaypoint())

      console.log(this.directionsThing.actions.queryDestination())
      console.log(this.directionsThing.getDestination())
      console.log(this.directionsThing.getOrigin().geometry.coordinates)

      console.log(this.directionsThing.getDestination().geometry.coordinates)
    })
  }

  // const map = new mapboxgl.Map({
  //   container: 'map',
  //   style: 'mapbox://styles/mapbox/streets-v11',
  //   center: [-122.486052, 37.830348],
  //   zoom: 15
  // })
  //         .post('/api/location', {
  //           Place: MUST FIND NAME TO GO HERE,
  //           Long: this.directionsThing.getDestination().geometry.coordinates[0],
  //           Lat: this.directionsThing.getDestination().geometry.coordinates[1],
  //           Destination: [{ tripId: 2 }]
  //         })
  // axios
  //         .post('/api/location', {
  //           Place: MUST FIND NAME TO GO HERE,
  //           Long: this.directionsThing.getOrigin().geometry.coordinates[0],
  //           Lat: this.directionsThing.getOrigin().geometry.coordinates[1],
  //           Destination: [{ tripId: 2 }]
  //         })
  // })

  // AMANDA DO NOT FORGET TO SMASH THIS BUG
  //   this.directionsThing.actions.addWaypoint(1, waypoint(to be acquired from TM page button))

  // this.directionsThing.on('load', () => {
  //   console.log('hey load!')
  // })
  // this.directionsThing.on('selectRoute', () => {
  //   console.log('hey selectRoute!')
  // })
  // this.directionsThing.on('highlightRoute', () => {
  //   console.log('hey highlightRoute!')
  // })

  // waypoints.forEach((waypoint, index) => {
  //   this.directions.addWaypoint(index, waypoint);
  // });

  render() {
    return (
      <div>
        <header>
          <h1>Get Directions</h1>
          <h3>Get turn by turn directions, so you don't get lost</h3>
          <h5>Unless you want to get lost</h5>
        </header>
        <section className="mapView" id="mapView">
          <ReactMapGL
            {...this.state.viewport}
            width="60"
            height="60vh"
            mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
            mapboxApiAccessToken={TOKEN}
            onViewportChange={vp => this.setState({ viewport: vp })}
            ref={map => (this.mapRef = map)}
          >
            <div style={{ position: 'absolute', left: 0 }}>
              <NavigationControl />
            </div>
          </ReactMapGL>
        </section>
      </div>
    )
  }
}

export default GetDirections
