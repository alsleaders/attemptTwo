import React, { useState, useEffect } from 'react'
import '../CSS/Home.css'

import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

export default function Home() {
  // let mapRef = {}
  const [view, setView] = useState({
    latitude: 27.9506,
    // this is up to 90
    longitude: -82.4572,
    // this is up to 180
    zoom: 2
  })
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [mapData, setMapData] = useState([])
  const [currentLocation, setCurrentLocation] = useState('')
  const [currentLocationData, setCurrentLocationData] = useState({})
  const [plannedDestination, setPlannedDestination] = useState('')
  const [plannedDestinationData, setPlannedDestinationData] = useState({})

  useEffect(() => {
    axios.get('https://localhost:5001/api/location').then(resp => {
      console.log(resp.data)
      setMapData(resp.data)
    })
  }, [])

  const planTrip = e => {
    e.preventDefault()
    console.log('submitting')
    let thing = {}
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentLocation}.json?access_token=${TOKEN}`
      )
      .then(currentLocationResp => {
        console.log(currentLocationResp.data)
        console.log(currentLocationResp.data.features[0].center)
        thing = {
          Place: currentLocation,
          Long: currentLocationResp.data.features[0].center[0],
          Lat: currentLocationResp.data.features[0].center[1]
        }
        setCurrentLocationData(thing)
        axios
          .get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${plannedDestination}.json?access_token=${TOKEN}`
          )
          .then(plannedDestinationResp => {
            console.log(plannedDestinationResp.data)
            console.log(plannedDestinationResp.data.features[0].center)
            setPlannedDestinationData({
              Place: plannedDestination,
              Long: plannedDestinationResp.data.features[0].center[0],
              Lat: plannedDestinationResp.data.features[0].center[1]
            })
            axios
              .post('https://localhost:5001/api/location', {
                Place: currentLocation,
                Long: currentLocationResp.data.features[0].center[0],
                Lat: currentLocationResp.data.features[0].center[1],
                Destination: [{ tripId: 2 }]
              })
              .then(resp => {
                console.log(resp.data)
                setMapData(data => {
                  return data.concat(resp.data)
                })
              })
            axios
              .post('https://localhost:5001/api/location', {
                Place: plannedDestination,
                Long: plannedDestinationResp.data.features[0].center[0],
                Lat: plannedDestinationResp.data.features[0].center[1],
                Destination: [{ tripId: 2 }]
              })
              .then(response => {
                console.log(response.data)
                setMapData(data => {
                  return data.concat(response.data)
                })
                // setCurrentLocation('')
                // setPlannedDestination('')
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
                console.log(currentLocationData)
                console.log(thing)
                console.log('helllllllo')
                axios.get(
                  'https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B-74%2C40.733.json?access_token=pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aW10cjkwMmR4NDNsZ2NoaWI0OGx3In0.xMNCyuPZyAjV6M8iX-fdJA'
                )
              })
          })
      })

    // add to your mapboxgl map
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
