import React, { useEffect, useState } from 'react';

import { SubmitFormFancyCSS } from '../SubmitFormFancyCSS';

export function AddReservation() {
  const [availableReservations, setAvailableReservations] = useState([]);
  const [numberOfGuests, setNumberOfGuests] = useState();
  const [phone, setPhone] = useState('');
  const [fullName, setFulllName] = useState('');
  const [email, setEmail] = useState('');
  const [mealId, setMealId] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isDone, setIsDone] = useState(false);

  const fetchAvailableReservations = async () => {
    const data = await fetch(
      'http://localhost:3000/api/meals?availableReservations=true',
    );
    const jsonData = await data.json();
    setAvailableReservations(jsonData);
  };

  useEffect(() => {
    fetchAvailableReservations();
  }, []);

  let handleSubmit = async (e) => {
    e.preventDefault();
    const reservationPost = {
      number_of_guests: numberOfGuests,
      created_date: date,
      contact_phonenumber: phone,
      contact_name: fullName,
      contact_email: email,
      meal_id: mealId,
    };

    try {
      setIsDone(true);
      let res = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(reservationPost),
      });

      let resJson = await res.json();
      console.log(resJson);
      if (res.status === 201) {
        setFulllName('');
        setEmail('');
        setMessage('Reservation done successfully');
        setIsDone(false);
      } else {
        setMessage('Some error occured');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const title = availableReservations.map((available) => (
    <>
      <option>
        ID: {available.id} title: {available.title}
      </option>
    </>
  ));

  return (
    <>
      {
        <h1>
          All {availableReservations.length} meals available for reservations{' '}
        </h1>
      }
      <div className="display-container">
        {availableReservations.map((availableReservation) => {
          return (
            <div className="display-item">
              <p> MealID : {availableReservation.id}</p>
              <p>{availableReservation.title}</p>
              <p> Capacity: {availableReservation.max_reservations}</p>
              <p> Reserved: {availableReservation.total_guests}</p>
              <p>Available: {availableReservation.Available_Reservation}</p>
            </div>
          );
        })}
      </div>

      <h1>Add Reservation</h1>
      {
        <form onSubmit={handleSubmit}>
          <SubmitFormFancyCSS>
            <input
              type="number"
              name="number_of_guests"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              placeholder="Number of guests..."
            />
            <select
              type="number"
              name="meal_id"
              value={mealId}
              onChange={(e) => setMealId(Number(e.target.value.match(/\d+/g)))}
              placeholder="meal title..."
            >
              {title}
            </select>

            <input
              type="number"
              name="contact_phonenumber"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number..."
            />

            <input
              type="text"
              name="contact_name"
              value={fullName}
              onChange={(e) => setFulllName(e.target.value)}
              placeholder="Enter your fullname..."
            />

            <input
              type="email"
              name="contact_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@email.com"
            />

            <input
              type="date"
              name="created_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="submit-form">
              {!isDone && <button type="submit">Add Reservation</button>}
              {isDone && (
                <button type="submit" disabled>
                  Adding Reservation...
                </button>
              )}
            </div>
            <div className="message">{message ? <p>{message}</p> : null}</div>
          </SubmitFormFancyCSS>
        </form>
      }
    </>
  );
}
