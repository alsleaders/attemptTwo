import React, { Component } from 'react'
import '../CSS/CurrentDrive.css'
import Script from 'react-script'
import axios from 'axios'
import ReactMapGL from 'react-map-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

class CurrentDrive extends Component {
  mapRef = {}
  directionsThing = {}
  // get props from add button on thingsMissed
  state = {
    view: {},
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
      // axios
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
    })

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
    axios.get('/api/location').then(resp => {
      this.setState({
        mapList: resp.data
      })
    })
  }

  render() {
    return (
      <div>
        <header>
          <h1>Your Current Drive</h1>
        </header>
        <section className="mapView">
          <ReactMapGL
            // {...view}
            width="60"
            height="60vh"
            mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
            mapboxApiAccessToken={TOKEN}
            onViewportChange={view => view}
            ref={map => (this.mapRef = map)}
          />
        </section>
      </div>
    )
  }
}

export default CurrentDrive
