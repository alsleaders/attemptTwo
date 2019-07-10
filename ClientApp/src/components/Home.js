import React, { useState, useEffect } from 'react'
import '../CSS/Home.css'

import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import waterfall from 'async/waterfall'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

function callback(e) {
  return e
}

export default function Home() {
  // let mapRef = {}
  const [view, setView] = useState({
    latitude: 27.9506,
    // this is up to 90
    longitude: -82.4572,
    // this is up to 180
    zoom: 4
  })
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [mapData, setMapData] = useState([])
  const [currentLocation, setCurrentLocation] = useState('')
  const [currentLocationData, setCurrentLocationData] = useState({})
  const [plannedDestination, setPlannedDestination] = useState('')
  const [plannedDestinationData, setPlannedDestinationData] = useState({})
  const [route, setRoute] = useState({})

  useEffect(() => {
    axios.get('https://localhost:5001/api/location').then(resp => {
      console.log(resp.data)
      setMapData(resp.data)
    })
  }, [])

  const getCurrentLoc = callback => {
    let thing = {}
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentLocation}.json?access_token=${TOKEN}`
      )
      .then(resp => {
        console.log(resp.data)
        console.log(resp.data.features[0].center)
        thing = {
          Place: currentLocation,
          Long: resp.data.features[0].center[0],
          Lat: resp.data.features[0].center[1]
        }
        console.log(thing)
        setCurrentLocationData({ thing }, () => {
          callback()
        })
      })
  }

  const getPlannedDes = callback => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${plannedDestination}.json?access_token=${TOKEN}`
      )
      .then(resp => {
        console.log(resp.data)
        console.log(resp.data.features[0].center)
        setPlannedDestinationData(
          {
            Place: plannedDestination,
            Long: resp.data.features[0].center[0],
            Lat: resp.data.features[0].center[1]
          },
          () => {
            callback()
          }
        )
      })
    console.log(plannedDestinationData)
  }

  const postCLToDB = callback => {
    axios
      .post('https://localhost:5001/api/location', {
        currentLocationData
      })
      .then(resp => {
        console.log(resp.data)
        setMapData(
          data => {
            return data.concat(resp.data)
          },
          () => {
            callback()
          }
        )
      })
  }

  const postPDtoDB = callback => {
    console.log(plannedDestinationData)
    axios
      .post('https://localhost:5001/api/location', {
        plannedDestinationData
      })
      .then(response => {
        console.log(response.data)
        setMapData(
          data => {
            return data.concat(response.data)
          },
          () => {
            callback()
          }
        )
      })
  }

  const getTheLine = callback => {
    axios
      .get(
        'https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B-74%2C40.733.json?access_token=pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aW10cjkwMmR4NDNsZ2NoaWI0OGx3In0.xMNCyuPZyAjV6M8iX-fdJA'
      )
      .then(resp => {
        console.log(resp.data)
        setRoute(
          {
            route: resp.data
          },
          () => {
            callback()
          }
        )
      })
  }

  const planTrip = e => {
    e.preventDefault()
    console.log('submitting')
    waterfall([
      callback => {
        getCurrentLoc(callback)
      },
      callback => {
        getPlannedDes(callback)
      },
      callback => {
        postCLToDB(callback)
      },
      callback => {
        postPDtoDB(callback)
      },
      callback => {
        getTheLine(callback)
      }
    ])

    setCurrentLocation('')
    setPlannedDestination('')
    // axios.get(
    //   `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${
    //     currentLocationData.Long
    //   }%2C${currentLocationData.Lat}%3B${
    //     plannedDestinationData.Long
    //   }%2C${
    //     plannedDestinationData.Lat
    //   }.json?geometries=polyline&steps=true&overview=full&access_token=${TOKEN}`
    // )
    console.log(currentLocation)
    console.log(currentLocationData, 'is this a thing?')
    console.log('helllllllo')
  }

  return (
    <section>
      <section className="mapView">
        <ReactMapGL
          {...view}
          width="60"
          height="60vh"
          mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
          mapboxApiAccessToken={TOKEN}
          onViewportChange={view => {
            setView(view)
          }}
          // ref={map => (this.mapRef = map)}
        >
          <div style={{ position: 'absolute', left: 0 }}>
            <NavigationControl />
          </div>
          {mapData.map(city => {
            return (
              <Marker key={city.id} latitude={city.lat} longitude={city.long}>
                <button
                  className="marker"
                  onClick={e => {
                    e.preventDefault()
                    setSelectedInfo(city)
                  }}
                />
              </Marker>
            )
          })}

          {selectedInfo ? (
            <Popup
              latitude={selectedInfo.lat}
              longitude={selectedInfo.long}
              onClose={() => {
                setSelectedInfo(null)
              }}
            >
              <h2>{selectedInfo.place}</h2>
            </Popup>
          ) : null}
        </ReactMapGL>
      </section>

      <hr />
      <section className="input-fields">
        <h3>Input your location and destination</h3>
        <div className="input-column">
          <form onSubmit={planTrip}>
            <input
              type="text"
              placeholder="Current location"
              value={currentLocation}
              onChange={e => setCurrentLocation(e.target.value)}
            />
            {/* </div>
        <div className="input-column"> */}
            <input
              type="text"
              placeholder="Planned destination"
              value={plannedDestination}
              onChange={e => setPlannedDestination(e.target.value)}
            />
            <button style={{ display: 'none' }}>submit</button>
          </form>
        </div>
      </section>
    </section>
  )
}
