import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../mealSharing.css';
import { SubmitFormFancyCSS } from '../SubmitFormFancyCSS';

export function MealSpecific() {
  const [meals, setMeals] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [numberOfGuests, setNumberOfGuests] = useState();
  const [phone, setPhone] = useState('');
  const [fullName, setFulllName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isDone, setIsDone] = useState(false);

  const { id } = useParams();

  let handleSubmit = async (e) => {
    e.preventDefault();
    const reservationPost = {
      number_of_guests: numberOfGuests,
      created_date: date,
      contact_phonenumber: phone,
      contact_name: fullName,
      contact_email: email,
      meal_id: id,
    };

    try {
      setIsDone(true);
      let res = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(reservationPost),
      });

      let resJson = await res.json();
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

  const getMealWithId = async () => {
    const data = await fetch(`http://localhost:3000/api/meals/${id}`);
    const jsonData = await data.json();
    setMeals(jsonData);
  };

  function handleClickDeleteMeal(ID) {
    fetch(`http://localhost:3000/api/meals/${ID}`, {
      method: 'DELETE',
    });
    // history.push('/');
  }

  const getReservations = async () => {
    const data = await fetch(`http://localhost:3000/api/reservations`);
    const jsonData = await data.json();
    setReservations(jsonData);
  };

  useEffect(() => {
    getMealWithId();
    getReservations();
  }, []);

  const allReservations = reservations
    .filter((reservation) => reservation.meal_id == Number(id))
    .map((guest) => guest.number_of_guests)
    .reduce((one, another) => one + another, 0);

  const maxReservation = meals.map((meal) => meal.max_reservations)[0];
  const seatAvailable = maxReservation - allReservations;

  return (
    <div>
      <h1> Meal Specific page</h1>
      {meals.status === 'Failed' ? (
        <h1 key={meals.message}> {meals.message}</h1>
      ) : (
        meals.map((meal, index) => (
          <div className="display-container">
            <section className="display-item" key={index}>
              <h1>
                {meal.id} {meal.title}
              </h1>

              <Link exact to={'/menu'} title="Go back to menu">
                <i> {meal.description}</i>
                <p>
                  <strong> Location :</strong> {meal.location}
                </p>
                <p>
                  <strong>Price :</strong> {meal.price}
                </p>
                <p>
                  <strong>Reseration Capacity : </strong>
                  {meal.max_reservations} Persons
                </p>
              </Link>
              <span className="mealSpecificButtonSpan">
                <Link exact to={`/reviews/${meal.id}`}>
                  <button> Review</button>
                </Link>

                <Link exact to={`/reservations/${meal.id}`}>
                  <button> Reservation</button>
                </Link>

                <button onClick={() => handleClickDeleteMeal(meal.id)}>
                  Delete
                </button>
              </span>
            </section>
          </div>
        ))
      )}

      <h1>Add Reservation</h1>
      <section className="addReservationForm">
        <p>
          <strong>Seat Available : </strong>
          {seatAvailable <= 0
            ? 'more than capacity ' + seatAvailable
            : seatAvailable + ' seat available'}
        </p>
        {numberOfGuests > seatAvailable
          ? '***you entered ' +
            (numberOfGuests - seatAvailable) +
            ' seat more than the limit...'
          : null}
        {seatAvailable >= 1 ? (
          <SubmitFormFancyCSS>
            <form className="reservationDetailpage" onSubmit={handleSubmit}>
              <input
                type="number"
                name="number_of_guests"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                placeholder="Number of guests..."
              />

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
                    Adding Reservation...{' '}
                  </button>
                )}
              </div>

              <div className="message">{message ? <p>{message}</p> : null}</div>
            </form>
          </SubmitFormFancyCSS>
        ) : (
          <p>Reservation not available</p>
        )}
      </section>
    </div>
  );
}
