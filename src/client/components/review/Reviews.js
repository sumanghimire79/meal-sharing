import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../mealSharing.css';

export function Reviews({ match }) {
  const id = Number(match.params.id);

  const [reviews, setReviews] = useState([]);
  const history = useHistory();

  const fetchItem = async () => {
    const data = await fetch('http://localhost:3000/api/reviews');
    const jsonData = await data.json();

    console.log(jsonData);
    setReviews(jsonData);
  };
  useEffect(() => {
    fetchItem();
  }, []);
  const reviewSpecific = reviews.filter((review) => review.meal_id === id);
  console.log(reviewSpecific);

  function handleClickDeleteReview() {
    fetch('http://localhost:3000/api/reviews/' + id, {
      method: 'DELETE',
    });
    // history.push('/');
  }
  return (
    <>
      <h1>Reviews page</h1>
      <i>
        <b>This meal has got {reviewSpecific.length} reviews</b>
      </i>
      <>
        <Link exact to={'/all-reviews/AddReview'}>
          {<p>Add a reviews for this meal</p>}
        </Link>
      </>
      {reviewSpecific.length === 0 ? (
        <>
          <Link exact to={'/all-reviews'}>
            {<p>view all reviews</p>}
          </Link>
        </>
      ) : (
        <section className="display-container">
          {reviewSpecific.map((review) => (
            <section className="display-item">
              <h3>Review: {review.title}</h3>
              <p>Ratings: {review.stars}</p>
              <p>{review.description}</p>
              <p> Review Date: {review.created_date}</p>
              <button onClick={handleClickDeleteReview}>Delete Review</button>
            </section>
          ))}
        </section>
      )}
    </>
  );
}
