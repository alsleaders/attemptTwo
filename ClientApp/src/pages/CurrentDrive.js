import React, { Component } from 'react'
import '../CSS/CurrentDrive.css'
import Script from 'react-script'
import axios from 'axios'
import ReactMapGL from 'react-map-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

class CurrentDrive extends Component {
  mapRef = {}
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
    mapboxobj.addControl(
      // eslint-disable-next-line no-undef
      new MapboxDirections({
        accessToken: TOKEN
      }),
      'top-left'
    )
    axios.get('https://localhost:5001/api/location').then(resp => {
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
          >
            {/* <div style={{ position: 'absolute', right: 0 }}>
              <Scale />
            </div> */}
            {/* {this.state.mapList.map(city => {
            return (
              <Marker key={city.id} latitude={city.lat} longitude={city.long}>
                <button
                  className="marker"
                  onClick={e => {
                    e.preventDefault()
                    this.setState({
                      cityInfo: city
                    })
                  }}
                />
              </Marker>
            )
          })}

          {this.state.cityInfo ? (
            <Popup
              latitude={this.state.cityInfo.lat}
              longitude={this.state.cityInfo.long}
              onClose={() => {
                this.setState({
                  cityInfo: null
                })
              }}
            >
              <h2>{this.state.cityInfo.place}</h2>
            </Popup>
          ) : null} */}
          </ReactMapGL>
        </section>
      </div>
    )
  }
}

export default CurrentDrive
