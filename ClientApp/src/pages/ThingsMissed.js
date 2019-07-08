import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../CSS/ThingsMissed.css'

export default function ThingsMissed() {
  const [mapList, setMapList] = useState([])

  useEffect(() => {
    axios.get('https://localhost:5001/api/location').then(resp => {
      console.log(resp.data)
      setMapList(resp.data)
    })
  }, [])

  const addToCurrentTrip = () => {
    // add as a waypoint to the current trip
    // pass as props to current travel route
    console.log('button works')
  }

  const deleteFromTable = itemId => {
    console.log(itemId)
    axios.delete(`https://localhost:5001/api/location/${itemId}`).then(resp => {
      console.log(resp.data)
      setMapList(oldList => oldList.filter(item => item.id !== itemId))
      console.log('delete works')
    })
  }

  return (
    <section className="things-missed">
      <h1>These are some of the things you've missed</h1>
      <p className="instructions">
        Feel free to add to your current trip, keep a running list of places you
        want to go back to, or admit that your priorities change and you really
        aren't going to try and make it back to that cool place you heard about
        that once. <br />
        Anything goes.
      </p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Add to Trip?</th>
            <th>Point of Interest</th>
            <th>Not worried about it?</th>
          </tr>
        </thead>
        <tbody>
          {mapList.map(item => (
            <tr key={item.id}>
              <td>
                <button className="button" onClick={addToCurrentTrip}>
                  Add
                </button>
              </td>
              <td>{item.place}</td>
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
