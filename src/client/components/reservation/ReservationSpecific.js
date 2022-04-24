import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../mealSharing.css';

export function ReservationSpecific({ match }) {
  const id = Number(match.params.id);

  const [reservations, setReservations] = useState([]);
  const history = useHistory();

  const fetchReservations = async () => {
    const data = await fetch('http://localhost:3000/api/reservations');
    const jsonData = await data.json();
    setReservations(jsonData);
  };
  useEffect(() => {
    fetchReservations();
  }, []);
  const reservationSpecific = reservations.filter(
    (reservation) => reservation.meal_id === id,
  );
  console.log(reservationSpecific);

  function handleClickDeleteReview() {
    fetch('http://localhost:3000/api/reservations/' + id, {
      method: 'DELETE',
    });
    // history.push('/');
  }
  return (
    <>
      <h1>Reservation specific page</h1>
      <i>
        <b>This meal has got {reservationSpecific.length} reservations</b>
      </i>
      <>
        <Link exact to={'/addReservaion'}>
          {<p>Add a reservation for this meal</p>}
        </Link>
      </>
      {reservationSpecific.length === 0 ? (
        <>
          <Link exact to={'/reservations'}>
            {<p>view all Reservations</p>}
          </Link>
        </>
      ) : (
        <section className="display-container">
          {reservationSpecific.map((reservation) => (
            <section className="display-item">
              <h3>Number of Guests: {reservation.number_of_guests}</h3>
              <p>Created Date: {reservation.created_date.slice(0, 10)}</p>
              <p>Phone: {reservation.contact_phonenumber}</p>
              <p> Contact Name: {reservation.contact_name}</p>
              <p> Contact Email: {reservation.contact_email}</p>
              <p> Meal ID: {reservation.meal_id}</p>

              <button onClick={handleClickDeleteReview}>
                Delete Reservation
              </button>
            </section>
          ))}
        </section>
      )}
    </>
  );
}
