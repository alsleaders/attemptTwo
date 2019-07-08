import React, { useEffect, useState } from 'react'
import '../CSS/PastDrive.css'
import axios from 'axios'

export default function PastDrive() {
  const [seenLocations, setSeenLocations] = useState([])
  const [tripId, setTripId] = useState('')

  useEffect(() => {
    axios.get('https://localhost:5001/api/trip/' + tripId).then(resp => {
      console.log(resp.data)
      setSeenLocations(resp.data)
    })
  }, [])

  return (
    <section>
      <h1>Oh the Places You've Been</h1>
      <h3>Pick a trip, any trip</h3>
      <input
        type="text"
        name="tripId"
        placeholder="Trip #"
        onChange={e => setTripId(e.target.value)}
      />
      <ul>
        {seenLocations.map(location => {
          return <li>{location.place}</li>
        })}
      </ul>
      <p>
        The past is another country. 1987's just the Isle of Wight. Two wrongs
        don't make a left turn. Why are you pointing your screwdrivers like
        that? They're scientific instruments, not water pistols. It's all right
        up to the eyebrows. Then it goes haywire. I don't like it. People assume
        that time is a strict progression of cause-and-effect... but actually,
        from a non-linear, non-subjective viewpoint, it's more like a big ball
        of wibbly-wobbly... timey-wimey... stuff. Blimey, trying to make an Ood
        laugh...
      </p>
    </section>
  )
}
