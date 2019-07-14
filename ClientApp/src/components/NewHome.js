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

var framesPerSecond = 20
var initialOpacity = 1
var opacity = initialOpacity
var initialRadius = 4
var radius = initialRadius
var maxRadius = 15
var lineCoordinates = []
var speedFactor = 100 // number of frames per longitude degree
var animation // to store and cancel the animation

class NewHome extends Component {
  mapRef = {}
  state = {
    viewport: {
      zoom: 4,
      latitude: 28.46,
      // this is up to 90
      longitude: -81.35
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
    center: [-122.486052, 37.830348],
    startPoint: [],
    endPoint: [],
    tripNumber: 0
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

  makeNewTrip = callback => {
    axios
      .post('/api/trip', {
        StartDate: '2019-07-26',
        EndDate: '2019-07-28'
      })
      .then(resp => {
        console.log(resp.data)
        console.log(resp.data.id)
        axios
          .post('/api/destination', { tripId: resp.data.id })
          .then(response => {
            console.log(response.data)
            callback()
          })
      })
  }

  getCurrentLoc = callback => {
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
          startPoint: resp.data.features[0].center,
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
          endPoint: resp.data.features[0].center,
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
    axios.post('/api/location', this.state.currentLocationData).then(resp => {
      console.log('Posting Current Location', this.state.currentLocationData)
      // this.setState({
      //   mapData: this.state.mapData.concat(resp.data)
      // })
      callback()
    })
  }

  postPDtoDB = callback => {
    axios
      .post('/api/location', this.state.plannedDestinationData)
      .then(response => {
        console.log(
          'Posting Planned Destination',
          this.state.plannedDestinationData
        )
        // this.setState({
        //   mapData: this.state.mapData.concat(response.data)
        // })
        callback()
      })
  }

  getTheLine = callback => {
    axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${
          this.state.currentLocationData.Long
        }%2C${this.state.currentLocationData.Lat}%3B${
          this.state.plannedDestinationData.Long
        }%2C${this.state.plannedDestinationData.Lat}.json?access_token=${TOKEN}`
      )
      .then(resp => {
        console.log(
          resp.data.waypoints[0].location,
          'this should be the geocoding coordinates for the first? location'
        )
        console.log(
          resp.data.waypoints[1].location,
          'this should be the geocoding coordinates for the second? location'
        )

        this.setState({ route: resp.data.waypoints[0] })
        // var startPoint = [-113.787, 47.7596]
        // add point 1
        this.state.map.addSource('point1', {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: [this.state.startPoint[0], this.state.startPoint[1]]
          }
        })
        this.state.map.addLayer({
          id: 'circle1',
          source: 'point1',
          type: 'circle',
          paint: {
            'circle-radius': 10,
            'circle-radius-transition': {
              duration: 5
            },
            'circle-opacity-transition': {
              duration: 5
            },
            'circle-color': '#007cbf'
          }
        })
        this.state.map.addLayer({
          id: 'point1',
          source: 'point1',
          type: 'circle',
          paint: {
            'circle-radius': 10,
            'circle-color': '#007cbf'
          }
        })
        // add point 2
        this.state.map.addSource('point2', {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: [this.state.endPoint[0], this.state.endPoint[1]]
          }
        })
        this.state.map.addLayer({
          id: 'circle2',
          source: 'point2',
          type: 'circle',
          paint: {
            'circle-radius': 10,
            'circle-radius-transition': {
              duration: 5
            },
            'circle-opacity-transition': {
              duration: 5
            },
            'circle-color': '#007cbf'
          }
        })

        var diffX = this.state.endPoint[0] - this.state.startPoint[0]
        var diffY = this.state.endPoint[1] - this.state.startPoint[1]

        var sfX = diffX / speedFactor
        var sfY = diffY / speedFactor

        var i = 0
        var j = 0

        while (i < diffX || Math.abs(j) < Math.abs(diffY)) {
          lineCoordinates.push([
            this.state.startPoint[0] + i,
            this.state.startPoint[1] + j
          ])

          if (Math.abs(i) < Math.abs(diffX)) {
            i += sfX
          }

          if (Math.abs(j) < Math.abs(diffY)) {
            j += sfY
          }
        }

        console.log({ lineCoordinates })

        this.state.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: lineCoordinates
              }
            }
          },
          layout: {},
          paint: {
            'line-color': '#a9bcd0',
            'line-width': 3
          }
        })
      })

    // var animationCounter = 0

    // function animateLine() {
    //   if (animationCounter < lineCoordinates.length) {
    //     geojson.features[0].geometry.coordinates.push(
    //       lineCoordinates[animationCounter]
    //     )
    //     this.state.map.getSource('line-animation').setData(geojson)

    //     requestAnimationFrame(animateLine)
    //     animationCounter++
    //   } else {
    //     var coord = geojson.features[0].geometry.coordinates
    //     coord.shift()
    //     console.log(coord)

    //     if (coord.length > 0) {
    //       geojson.features[0].geometry.coordinates = coord
    //       this.state.map.getSource('line-animation').setData(geojson)

    //       //-------------- Point2 Animation End ---------------
    //       requestAnimationFrame(animateLine)
    //     }
    //   }
    // }

    // animateLine()

    callback()
  }

  planTrip = e => {
    e.preventDefault()
    console.log('submitting')
    waterfall([
      callback => {
        this.makeNewTrip(callback)
      },
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
  }

  clearInputs = e => {
    e.preventDefault()
    this.setState({
      currentLocation: '',
      plannedDestination: ''
    })
  }
  render() {
    return (
      <section>
        <header>
          <h1>Start your Trip</h1>
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
          {/* <h3>Where do we go now?</h3> */}
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
              <button>Submit</button>
              {/* style={{ display: 'none' }} */}
              <button className="clear-button" onClick={this.clearInputs}>
                Clear
              </button>
            </form>
          </div>
        </section>
      </section>
    )
  }
}

export default NewHome
