import React, { useState } from 'react'
import '../CSS/PastDrive.css'
import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

export default function PastDrive() {
  const [seenLocations, setSeenLocations] = useState([])
  const [tripName, setTripName] = useState('')
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [error, setError] = useState('')
  const [view, setView] = useState({
    latitude: 27.9506,
    // this is up to 90
    longitude: -82.4572,
    // this is up to 180
    zoom: 3
  })
  const [zebra, setZebra] = useState('')

  const goGetList = e => {
    e.preventDefault()
    setError(false)
    axios
      .get('/api/location/' + tripName)
      .then(resp => {
        console.log(resp.data)
        if (resp.status === 200) {
          // if null make error message display
          setSeenLocations(resp.data)
          // setZebra(seenLocations.destinations)
          console.log(zebra)
          // axios.get('/api/trip/' + )
        } else {
          setError('You must have dreamed that trip.')
        }
      })
      .catch(error => {
        setError(
          "I'm sorry, your princess is in another tower. Please try again."
        )
        window.alert("I'm sorry Dave. I can't do that.")
        window.location.reload(true)
      })
  }

  return (
    <section>
      <h1>Oh the Places You've Been</h1>
      <h3>Pick a trip, any trip</h3>
      <form className="past-input" onSubmit={goGetList}>
        <input
          type="text"
          name="tripId"
          placeholder="Trip #"
          onChange={e => setTripName(e.target.value)}
        />
        <button style={{ display: 'none' }} />
      </form>
      {error && <div style={{ color: 'red' }}>That trip doesn't exist yet</div>}
      {/* {seenLocations ? (
        <ul>
          {seenLocations.map(location => {
            return <li>{location.location.place}</li>
          })}
        </ul>
      ) : (
        ''
      )} */}
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
          {/* {seenLocations.map(city => {
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
          ) : null} */}
        </ReactMapGL>
      </section>
    </section>
  )
}
