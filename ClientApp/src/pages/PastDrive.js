import React, { useEffect, useState } from 'react'
import '../CSS/PastDrive.css'
import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

export default function PastDrive() {
  const [seenLocations, setSeenLocations] = useState([])
  const [tripId, setTripId] = useState('')
  const [selectedInfo, setSelectedInfo] = useState(null)

  const goGetList = e => {
    e.preventDefault()
    axios.get('/api/trip/' + tripId).then(resp => {
      console.log(resp.data)
      console.log(resp.data.destinations)
      setSeenLocations(resp.data.destinations)
    })
  }

  const [view, setView] = useState({
    latitude: 27.9506,
    // this is up to 90
    longitude: -82.4572,
    // this is up to 180
    zoom: 3
  })

  return (
    <section>
      <h1>Oh the Places You've Been</h1>
      <h3>Pick a trip, any trip</h3>
      <form className="past-input" onSubmit={goGetList}>
        <input
          type="text"
          name="tripId"
          placeholder="Trip #"
          onChange={e => setTripId(e.target.value)}
        />
        <button style={{ display: 'none' }} />
      </form>
      {seenLocations ? (
        <ul>
          {seenLocations.map(location => {
            return <li>{location.location.place}</li>
          })}
        </ul>
      ) : (
        ''
      )}
      <section className="mapView" id="mapView">
        <ReactMapGL
          {...view}
          width="60"
          height="60vh"
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          mapboxApiAccessToken={TOKEN}
          onViewportChange={view => {
            setView(view)
          }}
          // ref={map => (this.mapRef = map)}
        >
          <div style={{ position: 'absolute', left: 0 }}>
            <NavigationControl />
          </div>
          {seenLocations.map(city => {
            return (
              <Marker
                key={city.location.id}
                latitude={city.location.lat}
                longitude={city.location.long}
              >
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
    </section>
  )
}
