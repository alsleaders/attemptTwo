import React, { Component } from 'react'
import '../CSS/CurrentDrive.css'
import Script from 'react-script'
import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'

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
        <ReactMapGL
          // {...view}
          width="60"
          height="60vh"
          mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
          mapboxApiAccessToken={TOKEN}
          onViewportChange={view => view}
          ref={map => (this.mapRef = map)}
        >
          {/* <div style={{ position: 'absolute', left: 0 }}>
            <NavigationControl />
          </div> */}
          {this.state.mapList.map(city => {
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
          ) : null}
        </ReactMapGL>

        <p>
          Nice to meet you, Rose. Rose... before I go, I just want to tell you:
          you were fantastic. Absolutely fantastic. And do you know what? So was
          I! Run. Ricky, if I was to tell you what I was doing to the controls
          of my frankly magnificent timeship, would you even begin to
          understand? And I'm looking for a blonde in a Union Jack. A specific
          one, mind, I didn't just wake up this morning with a craving. Yeah, I
          came first in jiggery pokery, what about you? Do you wanna come with
          me? 'Cause if you do, then I should warn you — you're gonna see all
          sorts of things. Ghosts from the past. Aliens from the future. The day
          the Earth died in a ball of flame. It won't be quiet, it won't be
          safe, and it won't be calm. But I'll tell you what it will be: The
          trip of a lifetime!
        </p>
      </div>
    )
  }
}

export default CurrentDrive
