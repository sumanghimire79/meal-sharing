import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../mealSharing.css';
// import { EditReservation } from './EditReservation';

export function ReservationSpecific({ match }) {
  const id = Number(match.params.id);

  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');

  const fetchReservations = async () => {
    const data = await fetch('http://localhost:3000/api/reservations');
    const jsonData = await data.json();
    setReservations(jsonData);
  };
  useEffect(() => {
    fetchReservations();
  }, []);

  async function handleClickDeleteReview(ID) {
    const res = await fetch(`http://localhost:3000/api/reservations/${ID}`, {
      method: 'DELETE',
    });

    let resJson = await res.json();
    console.log(resJson);
    if (res.status === 200) {
      setMessage('Reservation deleted successfully');
      setIsDone(false);
    } else {
      setMessage('Some error occured');
    }
  }

  const reservationSpecific = reservations.filter(
    (reservation) => reservation.meal_id === id,
  );
  console.log(reservationSpecific);
  // <EditReservation reservationSpecific={reservationSpecific} />;
  return (
    <>
      <h1>Reservation specific page</h1>
      <i>
        <b>This meal has got {reservationSpecific.length} reservations</b>
      </i>
      <></>
      {reservationSpecific.length === 0 ? (
        <>
          <Link exact to={'/addReservaion'}>
            {<p>Add Reservations</p>}
          </Link>
          <Link exact to={'/reservations'}>
            {<p>view all Reservations</p>}
          </Link>
        </>
      ) : (
        <section className="reservationSpeceficSection">
          <Link exact to={'/addReservaion'}>
            {<p>Add a reservation for this meal</p>}
          </Link>
          <Link exact to={'/reservations'}>
            {<p>view all Reservations</p>}
          </Link>
          <section className="display-container">
            {reservationSpecific.map((reservation, index) => (
              <section key={index} className="display-item">
                <Link
                  exact
                  to={`/menu/${reservation.meal_id}`}
                  title="click to view the specific meal for this reservation "
                >
                  <h3>Number of Guests: {reservation.number_of_guests}</h3>
                  <p>Created Date: {reservation.created_date.slice(0, 10)}</p>
                  <p>Phone: {reservation.contact_phonenumber}</p>
                  <p> Contact Name: {reservation.contact_name}</p>
                  <p> Contact Email: {reservation.contact_email}</p>
                  <p> Meal ID: {reservation.meal_id}</p>
                </Link>

                <Link
                  exact
                  to={`/editReservaion/${reservation.id}`}
                  title="click to edit this reservation "
                >
                  <button> Edit</button>
                </Link>

                <button onClick={() => handleClickDeleteReview(reservation.id)}>
                  Delete
                </button>
              </section>
            ))}
            <>
              <h3>{message}</h3>
            </>
          </section>
        </section>
      )}
    </>
  );
}
