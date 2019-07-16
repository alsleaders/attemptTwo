import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../CSS/ThingsMissed.css'

export default function ThingsMissed(props) {
  const [mapList, setMapList] = useState([])
  const [locationData, setLocationData] = useState({})
  const [tripName, setTripName] = useState('')
  const [tripNumber, setTripNumber] = useState([])
  const [tripIdentifier, setTripIdentifier] = useState('')

  useEffect(() => {
    axios.get('/api/location/visited').then(resp => {
      console.log(resp.data)
      setMapList(resp.data)
    })
  }, [])

  const findOldTrip = e => {
    e.preventDefault()
    axios.get('/api/location/' + tripName).then(resp => {
      console.log(resp.data)
      console.log(resp.data[0].destinations[0].trip.id)
      setTripNumber(resp.data)
      setTripIdentifier(resp.data[0].destinations[0].trip.id)
    })
  }

  const addToCurrentTrip = item => {
    // setLocationData({ item })
    console.log(item)
    axios
      .post('/api/destination/', {
        tripId: tripIdentifier,
        locationId: item.id
      })
      .then(resp => console.log(resp.data))
    console.log('add button works', item.id)
    axios
      .patch(`/api/location/${item.id}`)
      .then(response => setMapList(oldList => oldList.concat(item !== item.id)))
  }

  const deleteFromTable = itemId => {
    console.log(itemId)
    axios.delete(`/api/location/${itemId}`).then(resp => {
      console.log(resp.data)
      setMapList(oldList => oldList.filter(item => item.id !== itemId))
      console.log('delete works')
    })
  }

  const updateVisited = itemId => {
    console.log(itemId)
    axios.patch(` /api/location/${itemId}`).then(resp => {
      setMapList(oldList => oldList.filter(item => item.id !== itemId))
      console.log('visited updated')
    })
  }

  return (
    <section className="things-missed">
      <h1>These are some of the things you've missed</h1>
      <p className="instructions">
        Feel free to track places you've been, keep a running list of places you
        want to go back to, or admit that your priorities change and you really
        aren't going to try and make it back to that cool place you heard about
        that once and take it off the list. <br />
        Anything goes.
      </p>
      <hr />
      <section>
        <h3>Do you want to add a destination to a previous trip?</h3>
        <form onSubmit={findOldTrip}>
          <input
            className="prev-trip-input"
            type="text"
            placeholder="Where else did you go on that trip?"
            onChange={e => setTripName(e.target.value)}
          />
          <button>Find that trip</button>
        </form>
      </section>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Add to this Trip?</th>
            <th>Point of Interest</th>
            <th>Been there?</th>
            <th>Not worried about it?</th>
          </tr>
        </thead>
        <tbody>
          {mapList.map(item => (
            <tr key={item.id}>
              <td>
                <button
                  className="button"
                  onClick={() => addToCurrentTrip(item)}
                >
                  Add
                </button>
              </td>
              <td>{item.place}</td>
              <td>
                <button
                  className="button"
                  onClick={() => updateVisited(item.id)}
                >
                  Done That
                </button>
              </td>
              <td>
                <button
                  className="button"
                  onClick={() => deleteFromTable(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
