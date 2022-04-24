import React, { useEffect, useState, createContext } from 'react';
import { Link } from 'react-router-dom';

export function AllReviews() {
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
        <Link exact to={'/all-reviews/AddReview'}>
          {<p>Add a reviews </p>}
        </Link>
      </>
      <section className="display-container">
        {reviews.map((review, index) => {
          return (
            <>
              <section className="display-item" key={index}>
                <Link exact to={`/all-meals/${review.meal_id}`}>
                  <h1>
                    {review.id}
                    <span>. </span>
                    {review.title}
                  </h1>
                  <p>{review.description} </p>
                  <p> Stars: {review.stars} </p>
                  <p> Meal: {review.meal_id} </p>
                  <p> Review Date: {review.created_date} </p>
                </Link>
              </section>
            </>
          );
        })}
      </section>
    </div>
  );
}
