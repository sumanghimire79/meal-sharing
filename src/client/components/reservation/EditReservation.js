import React, { useEffect, useState } from 'react';
import { SubmitFormFancyCSS } from '../SubmitFormFancyCSS';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
export function EditReservation() {
  const { id } = useParams();
  const history = useHistory();

  const [reservationID, setReservationID] = useState();
  const [numberOfGuests, setNumberOfGuests] = useState();
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFulllName] = useState('');
  const [email, setEmail] = useState('');
  const [mealId, setMealId] = useState();
  const [title, setTitle] = useState([]);

  const [editing, setEditing] = useState(false);

  console.log(reservationID);
  console.log(numberOfGuests);
  console.log(date);
  console.log(phone);
  console.log(fullName);
  console.log(email);
  console.log(mealId);
  const fetchReservationById = async () => {
    const data = await fetch(`http://localhost:3000/api/reservations/${id}`);
    const jsonData = await data.json();

    const result = await jsonData.map((editReserve) => {
      return (
        <div>
          {setReservationID(editReserve.id)}
          {setNumberOfGuests(editReserve.number_of_guests)}
          {setDate(editReserve.created_date.split('T')[0])}
          {setPhone(editReserve.contact_phonenumber)}
          {setFulllName(editReserve.contact_name)}
          {setEmail(editReserve.contact_email)}
          {setMealId(editReserve.meal_id)}
        </div>
      );
    });
  };

  // const date1 = new Date();
  // const dateParse = date1.toLocaleDateString();
  // const time1 = date1.toLocaleTimeString();
  // console.log(dateParse);
  // console.log(time1);

  const titleforMealToEdit = async () => {
    const data = await fetch(`http://localhost:3000/api/meals/${mealId}`);
    const jsonData = await data.json();
    const titleEditReserve = await jsonData.map((editReserve, index) => (
      <option key={index}> {editReserve.title} </option>
    ));
    console.log(titleEditReserve);
    setTitle(titleEditReserve);
  };
  useEffect(() => {
    titleforMealToEdit();
  }, [mealId]);

  useEffect(() => {
    putReservation();
    fetchReservationById();
  }, []);

  function putReservation() {
    const postReserrvation = {
      number_of_guests: Number(numberOfGuests),
      created_date: date,
      contact_phonenumber: phone,
      contact_name: fullName,
      contact_email: email,
      meal_id: Number(mealId),
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postReserrvation),
    };
    fetch(`http://localhost:3000/api/reservations/${id}`, requestOptions).then(
      (data) => {
        if (data.ok) {
          setEditing(false);
          history.push(`/reservations/${mealId}`);
        }
      },
    );
  }

  return (
    <div>
      <h1>edit reservation page</h1>

      {
        // <form onSubmit={putReservation}>
        <SubmitFormFancyCSS>
          <label> reservation ID </label>
          <input
            type="number"
            name="reservationID"
            value={reservationID}
            onChange={(e) => setReservationID(reservationID)}
            placeholder="reservationID..."
            disabled
          />
          <label> Number of guests </label>
          <input
            type="number"
            name="number_of_guests"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            placeholder="Number of guests..."
          />
          <label> meal title </label>
          <select
            type="number"
            name="meal_id"
            value={mealId}
            onChange={(e) => setMealId(e.target.value)}
            placeholder="meal title..."
          >
            {title}
          </select>
          <label> Phone Number </label>
          <input
            type="number"
            name="contact_phonenumber"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number..."
          />
          <label> Enter your fullname. </label>
          <input
            type="text"
            name="contact_name"
            value={fullName}
            onChange={(e) => setFulllName(e.target.value)}
            placeholder="Enter your fullname..."
          />
          <label> contact email </label>
          <input
            type="email"
            name="contact_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
          />

          <label> created date </label>
          <input
            type="datetime"
            name="created_date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="submit-form">
            {!editing ? (
              <button
                type="submit"
                onClick={() => {
                  setEditing(true);
                  putReservation();
                }}
              >
                Update
              </button>
            ) : (
              <button disabled>Updatating...</button>
            )}
          </div>
        </SubmitFormFancyCSS>
        // </form>
      }
    </div>
  );
}
