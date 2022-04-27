import React, { useEffect, useState, createContext } from 'react';
import { Link } from 'react-router-dom';
import Stars from 'react-stars-display';

export function Reviews() {
  const [reviews, setReviews] = useState([]);

  const fetchItem = async () => {
    const data = await fetch('http://localhost:3000/api/reviews');
    const jsonData = await data.json();
    console.log(jsonData);
    setReviews(jsonData);
  };
  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div>
      <h1> All {reviews.length} Reviews</h1>
      <>
        <Link exact to={'/AddReview'}>
          {<p>Add a review </p>}
        </Link>
      </>
      <section className="display-container">
        {reviews.map((review, index) => {
          return (
            <>
              <section className="display-item" key={index}>
                <Link
                  exact
                  to={`/reviews/${review.meal_id}`}
                  title="click to view the meal"
                >
                  <h1>
                    {review.id}
                    <span>. </span>
                    {review.title}
                  </h1>
                  <p>{review.description} </p>
                  {/* <p> Stars: {review.stars} </p> */}
                  <Stars stars={review.stars} size={30} />
                  <p> Meal: {review.meal_id} </p>
                  <p> Review Date: {review.created_date.slice(0, 10)} </p>
                </Link>
              </section>
            </>
          );
        })}
      </section>
    </div>
  );
}
