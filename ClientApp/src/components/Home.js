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
    zoom: 4
  })
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [mapData, setMapData] = useState([])
  const [currentLocation, setCurrentLocation] = useState('')
  const [plannedDestination, setPlannedDestination] = useState('')

  useEffect(() => {
    axios.get('https://localhost:5001/api/location').then(resp => {
      console.log(resp.data)
      setMapData(resp.data)
    })
  }, [])

  const planTrip = e => {
    e.preventDefault()
    console.log('submitting')
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentLocation}.json?access_token=${TOKEN}`
      )
      .then(currentLocationResp => {
        console.log(currentLocationResp.data)
        console.log(currentLocationResp.data.features[0].center)
        axios
          .get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${plannedDestination}.json?access_token=${TOKEN}`
          )
          .then(plannedDestinationResp => {
            console.log(plannedDestinationResp.data)
            console.log(plannedDestinationResp.data.features[0].center)
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
              // value={currentLocation}
              onChange={e => setCurrentLocation(e.target.value)}
            />
            {/* </div>
        <div className="input-column"> */}
            <input
              type="text"
              placeholder="Planned destination"
              // value={plannedDestination}
              onChange={e => setPlannedDestination(e.target.value)}
            />
            <button style={{ display: 'none' }}>submit</button>
          </form>
        </div>
      </section>
    </section>
  )
}

// export class Home extends Component {
//   static displayName = Home.name

//   render() {
//     return (
//       <div>
//         <h1>Hello, world!</h1>
//         <p>Welcome to your new single-page application, built with:</p>
//         <ul>
//           <li>
//             <a href="https://get.asp.net/">ASP.NET Core</a> and{' '}
//             <a href="https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx">
//               C#
//             </a>{' '}
//             for cross-platform server-side code
//           </li>
//           <li>
//             <a href="https://facebook.github.io/react/">React</a> for
//             client-side code
//           </li>
//           <li>
//             <a href="http://getbootstrap.com/">Bootstrap</a> for layout and
//             styling
//           </li>
//         </ul>
//         <p>To help you get started, we have also set up:</p>
//         <ul>
//           <li>
//             <strong>Client-side navigation</strong>. For example, click{' '}
//             <em>Counter</em> then <em>Back</em> to return here.
//           </li>
//           <li>
//             <strong>Development server integration</strong>. In development
//             mode, the development server from <code>create-react-app</code> runs
//             in the background automatically, so your client-side resources are
//             dynamically built on demand and the page refreshes when you modify
//             any file.
//           </li>
//           <li>
//             <strong>Efficient production builds</strong>. In production mode,
//             development-time features are disabled, and your{' '}
//             <code>dotnet publish</code> configuration produces minified,
//             efficiently bundled JavaScript files.
//           </li>
//         </ul>
//         <p>
//           The <code>ClientApp</code> subdirectory is a standard React
//           application based on the <code>create-react-app</code> template. If
//           you open a command prompt in that directory, you can run{' '}
//           <code>npm</code> commands such as <code>npm test</code> or{' '}
//           <code>npm install</code>.
//         </p>
//       </div>
//     )
//   }
// }
