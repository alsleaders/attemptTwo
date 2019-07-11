import React, { Component } from 'react'
import '../CSS/Home.css'
import Map from 'mapbox-gl'
import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import waterfall from 'async/waterfall'
import mapboxgl from 'mapbox-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

function callback(e) {
  return e
}

let tripId = 1

var geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    }
  ]
}

class NewHome extends Component {
  mapRef = {}
  state = {
    viewport: {
      zoom: 3,
      latitude: 27.9506,
      // this is up to 90
      longitude: -82.4572
      // this is up to 180
    },
    map: {},
    mapData: [],
    selectedInfo: null,
    currentLocation: '',
    plannedDestination: '',
    currentLocationData: {},
    plannedDestinationData: {},
    route: {},
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-122.486052, 37.830348]
  }

  componentDidMount() {
    // let map = new mapboxgl.Map({
    //   container: 'mapView',
    //   style: this.state.style,
    //   center: this.state.center,
    //   zoom: this.state.zoom
    // })
    console.log(this.mapRef)
    this.setState({ map: this.mapRef.getMap() })

    axios.get('/api/location').then(resp => {
      console.log(resp.data)
      this.setState({
        mapData: resp.data
      })
    })
  }

  getCurrentLoc = callback => {
    tripId += tripId
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          this.state.currentLocation
        }.json?access_token=${TOKEN}`
      )
      .then(resp => {
        console.log(resp.data)
        console.log(resp.data.features[0].center)
        this.setState({
          currentLocationData: {
            Place: this.state.currentLocation,
            Long: resp.data.features[0].center[0],
            Lat: resp.data.features[0].center[1]
          }
        })
        callback()
      })
  }

  getPlannedDes = callback => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          this.state.plannedDestination
        }.json?access_token=${TOKEN}`
      )
      .then(resp => {
        console.log(resp.data)
        console.log(resp.data.features[0].center)
        this.setState({
          plannedDestinationData: {
            Place: this.state.plannedDestination,
            Long: resp.data.features[0].center[0],
            Lat: resp.data.features[0].center[1]
          }
        })
        callback()
      })
  }

  postCLToDB = callback => {
    axios
      .post('/api/location', {
        currentLocationData: this.state.currentLocationData
        // tripId: tripId
      })
      .then(resp => {
        console.log('Posting Current Location')
        this.setState({
          mapData: this.state.mapData.concat(resp.data)
        })
        callback()
      })
  }

  postPDtoDB = callback => {
    // console.log(plannedDestinationData)
    axios
      .post('/api/location', {
        location: this.state.currentLocationData
      })
      .then(response => {
        console.log('Posting Planned Destination')
        this.setState({
          mapData: this.state.mapData.concat(response.data)
        })
        callback()
      })
  }

  getTheLine = callback => {
    axios
      .get(
        'https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B-74%2C40.733.json?access_token=pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aW10cjkwMmR4NDNsZ2NoaWI0OGx3In0.xMNCyuPZyAjV6M8iX-fdJA'
      )
      .then(resp => {
        console.log(resp.data, 'this should be the geocoding line')
        this.setState({ route: resp.data })
        var startPoint = [-113.787, 47.7596]

        this.state.map.addSource('point1', {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: [
              this.state.currentLocationData.Long,
              this.state.currentLocationData.Lat
            ]
          }
        })
        this.state.map.addLayer({
          id: 'circle1',
          source: 'point1',
          type: 'circle',
          paint: {
            'circle-radius': 25,
            'circle-radius-transition': {
              duration: 0
            },
            'circle-opacity-transition': {
              duration: 0
            },
            'circle-color': '#007cbf'
          }
        })
        this.state.map.addSource('point2', {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: [
              this.state.plannedDestinationData.Long,
              this.state.plannedDestinationData.Lat
            ]
          }
        })
        this.state.map.addLayer({
          id: 'circle2',
          source: 'point2',
          type: 'circle',
          paint: {
            'circle-radius': 25,
            'circle-radius-transition': {
              duration: 0
            },
            'circle-opacity-transition': {
              duration: 0
            },
            'circle-color': '#007cbf'
          }
        })
        this.state.map.addLayer({
          id: 'line-animation',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 2
          }
        })

        callback()
      })
  }

  planTrip = e => {
    e.preventDefault()
    console.log('submitting')
    waterfall([
      callback => {
        this.getCurrentLoc(callback)
      },
      callback => {
        this.getPlannedDes(callback)
      },
      callback => {
        this.postCLToDB(callback)
      },
      callback => {
        this.postPDtoDB(callback)
      },
      callback => {
        this.getTheLine(callback)
      }
    ])
    // this.setState({
    //   currentLocation: '',
    //   plannedDestination: ''
    // })
  }

  render() {
    return (
      <section>
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
            {this.state.mapData.map(city => {
              return (
                <Marker key={city.id} latitude={city.lat} longitude={city.long}>
                  <button
                    className="marker"
                    onClick={e => {
                      e.preventDefault()
                      this.setState({
                        selectedInfo: city
                      })
                    }}
                  />
                </Marker>
              )
            })}

            {this.state.selectedInfo ? (
              <Popup
                latitude={this.state.selectedInfo.lat}
                longitude={this.state.selectedInfo.long}
                onClose={() => {
                  this.setState({
                    selectedInfo: null
                  })
                }}
              >
                <h2>{this.state.selectedInfo.place}</h2>
              </Popup>
            ) : null}
          </ReactMapGL>
        </section>
        <hr />
        <section className="input-fields">
          <h3>Input your location and destination</h3>
          <div className="input-column">
            <form onSubmit={this.planTrip}>
              <input
                type="text"
                placeholder="Current location"
                value={this.state.currentLocation}
                onChange={e =>
                  this.setState({
                    currentLocation: e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="Planned destination"
                value={this.state.plannedDestination}
                onChange={e =>
                  this.setState({
                    plannedDestination: e.target.value
                  })
                }
              />
              <button style={{ display: 'none' }}>submit</button>
            </form>
          </div>
        </section>
      </section>
    )
  }
}

export default NewHome
