import React, { useState } from 'react';

import { SubmitFormFancyCSS } from '../SubmitFormFancyCSS';

export function AddMeal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [when, setWhen] = useState('');
  const [maxReservation, setMaxReservation] = useState();
  const [price, setPrice] = useState();
  // const [createdDate, setCreatedDAte] = useState('');

  const [message, setMessage] = useState('');
  const [isDone, setIsDone] = useState(false);

  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  let handleSubmit = async (e) => {
    e.preventDefault();
    const mealPost = {
      title: title,
      description: description,
      location: location,
      when: when,
      max_reservations: maxReservation,
      price: price,
      created_date: date,
    };
    console.log(mealPost);
    try {
      setIsDone(true);
      let res = await fetch('http://localhost:3000/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(mealPost),
      });

      let resJson = await res.json();
      console.log(resJson);
      if (res.status === 201) {
        setMessage('Meal added successfully');
        setIsDone(false);
      } else {
        setMessage('Some error occured');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Add a meal</h1>
      {
        <form onSubmit={handleSubmit}>
          <SubmitFormFancyCSS>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meal title..."
            />
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meal description..."
            />
            <input
              type="text"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="location..."
            />
            <input
              type="date"
              name="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
            <input
              type="number"
              name="max_reservation"
              value={maxReservation}
              onChange={(e) => setMaxReservation(Number(e.target.value))}
              placeholder="max reservation..."
            />
            <input
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder=" set meal price..."
            />
            {/* <input
              type="date"
              name="created date"
              value={createdDate}
              onChange={(e) => setCreatedDAte(e.target.value)}
              placeholder="meal created date..."
            /> */}

            <div className="submit-form">
              {!isDone && <button type="submit">Add Meal</button>}
              {isDone && (
                <button type="submit" disabled>
                  Adding Meal...
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
