import React, { useState, useEffect } from 'react';
import '../mealSharing.css';
import { Link } from 'react-router-dom';
export function Reservations() {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    const data = await fetch('http://localhost:3000/api/reservations');
    const jsonData = await data.json();
    setReservations(jsonData);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <>
      <Link exact to="/addReservaion">
        <button>Add Reservation</button>
      </Link>
      {<h1> All {reservations.length} reservations </h1>}
      <div className="display-container">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="display-item">
            <Link
              exact
              to={`/menu/${reservation.meal_id}`}
              title="click to view the meal"
            >
              <h5> {reservation.contact_name}</h5>
              <p> {reservation.contact_email}</p>
              <p>Phone : {reservation.contact_phonenumber}</p>
              <p> Number of Guests : {reservation.number_of_guests}</p>
              <p> Event Date: {reservation.created_date.slice(0, 10)}</p>
              <p> meal ID : {reservation.meal_id}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
