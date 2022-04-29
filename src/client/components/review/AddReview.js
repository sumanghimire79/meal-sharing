import React, { useEffect, useState } from 'react';

import { SubmitFormFancyCSS } from '../SubmitFormFancyCSS';

export function AddReview() {
  const [meals, setMeals] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState('');
  const [stars, setStars] = useState('');

  const [mealId, setMealId] = useState('');

  const [message, setMessage] = useState('');
  const [isDone, setIsDone] = useState(false);
  console.log(typeof mealId);

  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  const fetchReview = async () => {
    const data = await fetch('http://localhost:3000/api/meals');
    const jsonData = await data.json();
    setMeals(jsonData);
  };

  useEffect(() => {
    fetchReview();
  }, []);

  let handleSubmit = async (e) => {
    e.preventDefault();
    const reviewPost = {
      title: title,
      description: description,
      stars: stars,
      created_date: date,
      meal_id: mealId,
    };

    try {
      setIsDone(true);
      let res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(reviewPost),
      });

      let resJson = await res.json();
      console.log(resJson);
      if (res.status === 201) {
        setMessage('Review added successfully');
        setIsDone(false);
      } else {
        setMessage('Some error occured');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mealTitle = meals.map((meal, index) => (
    <option key={index} value={meal.id} defaultValue={'select meal'}>
      {meal.title}
    </option>
  ));
  console.log(mealId);
  return (
    <>
      <h1>Add Review</h1>
      {
        <form onSubmit={handleSubmit}>
          <SubmitFormFancyCSS>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title..."
            />
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Review description..."
            />
            <input
              type="number"
              name="stars"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              placeholder="Review stars..."
            />

            <select
              type="number"
              name="meal_id"
              value={Number(mealId)}
              onChange={(e) => setMealId(e.target.value)}
              placeholder="meal id/title..."
            >
              {mealTitle}
            </select>

            <div className="submit-form">
              {!isDone && <button type="submit">Add Review</button>}
              {isDone && (
                <button type="submit" disabled>
                  Adding Review...
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
