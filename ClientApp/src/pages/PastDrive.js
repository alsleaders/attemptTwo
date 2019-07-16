import React, { useState, useEffect } from 'react'
import '../CSS/PastDrive.css'
import axios from 'axios'
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl'
import waterfall from 'async/waterfall'

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
  const [zebra, setZebra] = useState({})

  const findSpecificTrip = e => {
    e.preventDefault()
    axios
      .get('/api/location/' + tripName)
      .then(resp => {
        console.log(resp.data)
        console.log(resp.data[0].destinations[0])
        if (resp.status === 200) {
          // if null make error message display
          setZebra(resp.data[0].destinations[0])
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
    // setTimeout(callback(), 0)
  }

  useEffect(() => {
    axios.get('/api/trip/' + zebra.tripId).then(resp => {
      console.log(resp.data)
      setSeenLocations(resp.data.destinations)
    })
  }, [zebra])

  //   console.log(zebra)
  //   // axios.get('/api/trip/' + )
  //   callback()
  // }

  // const goGetList = e => {
  //   e.preventDefault()
  //   setError(false)
  //   waterfall([
  //     callback => {
  //       findSpecificTrip(callback)
  //     },
  //     callback => {
  //       findLocForThatTrip(callback)
  //     }
  //   ])
  // }

  const clearThisUp = () => {
    window.location.reload(true)
  }

  return (
    <section>
      <h1>Oh the Places You've Been</h1>
      <h3>Review your old trips</h3>
      <form className="past-input" onSubmit={findSpecificTrip}>
        <input
          className="prev-trip-input"
          type="text"
          name="tripId"
          placeholder="Where did you go on that trip?"
          onChange={e => setTripName(e.target.value)}
        />
        <button>Submit</button>
        <button type="reset" className="clear-button" onClick={clearThisUp}>
          Clear
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>That trip doesn't exist yet</div>}
      {seenLocations ? (
        <>
          <h5>Here are the places you saw on that trip</h5>
          <ul>
            {seenLocations.map(location => {
              return <li className="elephant">{location.location.place}</li>
            })}
          </ul>{' '}
        </>
      ) : (
        ''
      )}
      <section className="mapView" id="mapView">
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
