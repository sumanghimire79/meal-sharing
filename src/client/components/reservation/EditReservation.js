import React, { useEffect, useState, useContext } from 'react';
import { SubmitFormFancyCSS } from '../SubmitFormFancyCSS';
// import { TitleCreateContext } from './AddReservation';
import { useParams } from 'react-router-dom';
export function EditReservation() {
  const { id } = useParams();

  const [editedReservation, setEditedReservation] = useState([]);

  const [reservationID, setReservationID] = useState();
  const [numberOfGuests, setNumberOfGuests] = useState();
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFulllName] = useState('');
  const [email, setEmail] = useState('');
  const [mealId, setMealId] = useState();

  const [editing, setEditing] = useState(false);

  const fetchReservationById = async () => {
    const data = await fetch(`http://localhost:3000/api/reservations/${id}`);
    const jsonData = await data.json();

    const result = jsonData.map((editReserve) => ({
      reservationID: editReserve.id,
      numberOfGuests: editReserve.number_of_guests,
      date: editReserve.created_date,
      phone: editReserve.contact_phonenumber,
      fullName: editReserve.contact_name,
      email: editReserve.contact_email,
      mealId: editReserve.meal_id,
    }));

    setEditedReservation(result);
  };
  useEffect(() => {
    putReservation();
    fetchReservationById();
  }, []);
    // POST request using fetch inside useEffect React hook
    function fetchtoEdit() {
      fetch(`http://localhost:3000/api/reservations/${ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationEdit),
      })
        .then((response) => response.json())
        .then((data) => setEditedReservation(data));
    }
  }

  return (
    <div>
      <h1>edit reservation page</h1>

      {
        <form onSubmit={putReservation}>
          <SubmitFormFancyCSS>
            <input
              type="number"
              name="reservationID"
              value={reservationID}
              onChange={(e) => setReservationID(reservationID)}
              placeholder="reservationID..."
              disabled
            />
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
              onChange={(e) => setMealId(e.target.value)}
              placeholder="meal title..."
            ></select>
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
              {editing ? (
                <button type="submit">Update</button>
              ) : (
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditedReservation({
                      number_of_guests: numberOfGuests,
                      created_date: date,
                      contact_phonenumber: phone,
                      contact_name: fullName,
                      contact_email: email,
                      meal_id: mealId,
                    });
                  }}
                >
                  edit
                </button>
              )}
            </div>
          </SubmitFormFancyCSS>
        </form>
      }
    </div>
  );
}
