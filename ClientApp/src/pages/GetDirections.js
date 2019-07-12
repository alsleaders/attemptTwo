// import React, { Component } from 'react'
// // import './App.css'
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
// import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
// import DrawControl from 'react-mapbox-gl-draw'
// import Geocoder from '../components/Geocoder'
// const TOKEN =
//   'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

// const Map = ReactMapboxGl({
//   accessToken: TOKEN
// })

// class CurrentDrive extends Component {
//   state = {
//     view: {
//       latitude: 27.9506,
//       // this is up to 90
//       longitude: -82.4572
//       // this is up to 180
//     }
//   }
//   onDrawCreate = ({ features }) => {
//     console.log(features)
//   }

//   onDrawUpdate = ({ features }) => {
//     console.log({ features })
//   }
//   render() {
//     return (
//       <section>
//         <section className="mapView">
//           <Map
//             {...this.state.view}
//             style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
//             containerStyle={{
//               height: '60vh',
//               width: '60'
//             }}
//           >
//             <DrawControl
//               position="top-left"
//               onDrawCreate={this.onDrawCreate}
//               onDrawUpdate={this.onDrawUpdate}
//             />
//             {/* <Geocoder /> */}
//           </Map>
//         </section>
//         <p>
//           And I'm looking for a blonde in a Union Jack. A specific one, mind, I
//           didn't just wake up this morning with a craving. Do you wanna come
//           with me? 'Cause if you do, then I should warn you — you're gonna see
//           all sorts of things. Ghosts from the past. Aliens from the future. The
//           day the Earth died in a ball of flame. It won't be quiet, it won't be
//           safe, and it won't be calm. But I'll tell you what it will be: The
//           trip of a lifetime! Nice to meet you, Rose. The past is another
//           country. 1987's just the Isle of Wight. Your wish is my command. But
//           be careful what you wish for. The past is another country. 1987's just
//           the Isle of Wight. Nine hundred years of time and space, and I've
//           never been slapped by someone's mother. You look beautiful!
//           ...considering. That you're human. Rose... before I go, I just want to
//           tell you: you were fantastic. Absolutely fantastic. And do you know
//           what? So was I! The thing is, Adam, time travel is like visiting
//           Paris. You can't just read the guidebook, you've got to throw yourself
//           in! Eat the food, use the wrong verbs, get charged double and end up
//           kissing complete strangers! Or is that just me?
//         </p>
//       </section>
//     )
//   }
// }

// export default CurrentDrive
//   constructor() {
//     super()
//     this.state = {
//       coordinates: []
//     }

//     this.drawControl = null
//   }

//   handleCreateDraw = async e => {
//     let cords = e.features[0].geometry.coordinates.join(';')
//     var url =
//       'https://api.mapbox.com/directions/v5/mapbox/cycling/' +
//       cords +
//       '?geometries=geojson&steps=true&&access_token=' +
//       accessToken
//     let res = await fetch(url)
//     let response = await res.json()

//     this.setState({
//       coordinates: response.routes[0].geometry.coordinates
//     })
//   }

//   addLayer() {
//     console.log(this)
//   }

//   handleUpdateDraw = e => {
//     console.log('update', e)
//   }

//   handleDeleteDraw = e => {
//     console.log('delete', e)
//   }

//   render() {
//     return (
//       <div className="App">
//         <Map
//           style="mapbox://styles/mapbox/streets-v9"
//           containerStyle={{
//             height: '100vh',
//             width: '100vw'
//           }}
//         >
//           <DrawControl
//             ref={drawControl => {
//               this.drawControl = drawControl
//             }}
//             onDrawCreate={this.handleCreateDraw}
//             onDrawUpdate={this.handleUpdateDraw}
//             onDrawDelete={this.handleDeleteDraw}
//           />
//           <Layer
//             type="line"
//             id="power"
//             layout={{
//               'line-join': 'round',
//               'line-cap': 'round'
//             }}
//             paint={{
//               'line-color': '#3b9ddd',
//               'line-width': 8,
//               'line-opacity': 0.8
//             }}
//           >
//             <Feature coordinates={this.state.coordinates} />
//           </Layer>
//         </Map>
//       </div>
//     )
//   }
// }

// import React from 'react';
// import PropTypes from 'prop-types';
// import mapboxgl from 'mapbox-gl';

// class FetchData extends React.Component {
//   static propTypes = {
//     id: PropTypes.string.isRequired,
//     style: PropTypes.string.isRequired,
//     center: PropTypes.array,
//     zoom: PropTypes.number,

//     onLoad: PropTypes.func,
//     onClick: PropTypes.func,
//   };

//   static defaultProps = {
//     style: 'mapbox://styles/mapbox/streets-v9',
//     zoom: 14,
//   };

//   constructor (props) {
//     super(props);

//     this.state = {
//       map: null,
//     };
//   }

//   componentDidMount () {
//     const map = new mapboxgl.Map({
//       container: this.props.id,
//       style: this.props.style,
//       center: this.props.center,
//       zoom: this.props.zoom,
//     });
//     this.setState({ map: map });

//     // register events
//     map.on('load', function () {

//       map.addLayer({
//       "id": "route",
//       "type": "line",
//       "source": {
//       "type": "geojson",
//       "data": {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//       "type": "LineString",
//       "coordinates": [
//       [-122.48369693756104, 37.83381888486939],
//       [-122.48348236083984, 37.83317489144141],
//       [-122.48339653015138, 37.83270036637107],
//       [-122.48356819152832, 37.832056363179625],
//       [-122.48404026031496, 37.83114119107971],
//       [-122.48404026031496, 37.83049717427869],
//       [-122.48348236083984, 37.829920943955045],
//       [-122.48356819152832, 37.82954808664175],
//       [-122.48507022857666, 37.82944639795659],
//       [-122.48610019683838, 37.82880236636284],
//       [-122.48695850372314, 37.82931081282506],
//       [-122.48700141906738, 37.83080223556934],
//       [-122.48751640319824, 37.83168351665737],
//       [-122.48803138732912, 37.832158048267786],
//       [-122.48888969421387, 37.83297152392784],
//       [-122.48987674713133, 37.83263257682617],
//       [-122.49043464660643, 37.832937629287755],
//       [-122.49125003814696, 37.832429207817725],
//       [-122.49163627624512, 37.832564787218985],
//       [-122.49223709106445, 37.83337825839438],
//       [-122.49378204345702, 37.83368330777276]
//       ]
//       }
//       }
//       },
//       "layout": {
//       "line-join": "round",
//       "line-cap": "round"
//       },
//       "paint": {
//       "line-color": "#888",
//       "line-width": 8
//       }
//       });
//     map.on('click', this.props.onClick);
//   }
//     );

//   // addSource (sourceID, geoJSON) {
//   //   const layer = this.state.map.getSource(sourceID);

//   //   if (layer) {
//   //     this.updateSource(sourceID, geoJSON);
//   //     return;
//   //   }

//   //   this.state.map.addSource(sourceID, {
//   //     type: 'geojson',
//   //     data: geoJSON,
//   //   });
//   // }

//   // addLayer (layer, belowLayerID) {
//   //   this.state.map.addLayer(layer, belowLayerID);
//   // }

//   // updateSource (sourceID, geoJSON) {
//   //   this.state.map.getSource(sourceID).setData(geoJSON);
//   // }

//   render () {
//     return (
//       <div id={this.props.id} className="map-container"></div>
//     )
//   }
// }

// export default FetchData;

import React, { Component } from 'react'
import '../CSS/CurrentDrive.css'
// import Script from 'react-sscript'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import ReactMapGL, { GeoJSONlayer } from 'react-map-gl'

const TOKEN =
  'pk.eyJ1IjoiYWxzbGVhZGVycyIsImEiOiJjang1aXNrcGkwMmR5M3lsZzg4OXFyNWRqIn0.qQib-cz84tOegHyTyc0U9g'

class GetDirections extends Component {
  mapRef = {}
  directionsThing = {}
  // get props from add button on thingsMissed
  state = {
    map: null,
    view: {
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.486052, 37.830348],
      zoom: 15
    },
    mapList: [],
    cityInfo: null
  }

  //append that location to the map list

  componentDidMount() {
    console.log(this.mapRef)
    let mapboxobj = this.mapRef.getMap()
    console.log({ mapboxobj })
    // eslint-disable-next-line no-undef
    this.directionsThing = new MapboxDirections({
      accessToken: TOKEN
    })
    mapboxobj.addControl(this.directionsThing, 'top-left')
    axios.get('/api/location').then(resp => {
      this.setState({
        mapList: resp.data
      })
    })

    console.log('after', { mapboxobj })
    console.log(this.mapRef)

    this.directionsThing.on('destination', () => {
      console.log('hey destination!')
      console.log(this.directionsThing)
      // console.log(this.directionsThing.actions.addWaypoint())

      console.log(this.directionsThing.actions.queryDestination())
      console.log(this.directionsThing.getDestination())
      console.log(this.directionsThing.getOrigin().geometry.coordinates)

      console.log(this.directionsThing.getDestination().geometry.coordinates)
    })
  }

  // const map = new mapboxgl.Map({
  //   container: 'map',
  //   style: 'mapbox://styles/mapbox/streets-v11',
  //   center: [-122.486052, 37.830348],
  //   zoom: 15
  // })
  //         .post('/api/location', {
  //           Place: MUST FIND NAME TO GO HERE,
  //           Long: this.directionsThing.getDestination().geometry.coordinates[0],
  //           Lat: this.directionsThing.getDestination().geometry.coordinates[1],
  //           Destination: [{ tripId: 2 }]
  //         })
  // axios
  //         .post('/api/location', {
  //           Place: MUST FIND NAME TO GO HERE,
  //           Long: this.directionsThing.getOrigin().geometry.coordinates[0],
  //           Lat: this.directionsThing.getOrigin().geometry.coordinates[1],
  //           Destination: [{ tripId: 2 }]
  //         })
  // })

  // AMANDA DO NOT FORGET TO SMASH THIS BUG
  //   this.directionsThing.actions.addWaypoint(1, waypoint(to be acquired from TM page button))

  // this.directionsThing.on('load', () => {
  //   console.log('hey load!')
  // })
  // this.directionsThing.on('selectRoute', () => {
  //   console.log('hey selectRoute!')
  // })
  // this.directionsThing.on('highlightRoute', () => {
  //   console.log('hey highlightRoute!')
  // })

  // waypoints.forEach((waypoint, index) => {
  //   this.directions.addWaypoint(index, waypoint);
  // });

  render() {
    return (
      <div>
        <header>
          <h1>Get Directions</h1>
        </header>
        <section className="mapView">
          <ReactMapGL
            // {...this.state.view}
            width="60"
            height="60vh"
            mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
            mapboxApiAccessToken={TOKEN}
            onViewportChange={view => view}
            ref={map => (this.mapRef = map)}
          />
        </section>
      </div>
    )
  }
}

export default GetDirections
