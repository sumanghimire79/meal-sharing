import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [popularMeals, setPopularMeals] = useState([]);

  const fetchItem = async () => {
    const data = await fetch('/api/meals?popularMeal');
    const jsonData = await data.json();
    console.log(jsonData);
    setPopularMeals(jsonData);
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const popular = popularMeals.map((popularMeal, index) => {
    return (
      <div key={index} className="popularmeals">
        <Link to={`/meals/${popularMeal.id}`}>
          <h3>{popularMeal.title}</h3>

          {popularMeal.title.includes('pizza') && (
            <img
              className="bestItem"
              src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395__480.jpg"
              alt="Pizza"
            />
          )}
          {popularMeal.title.includes('pita') && (
            <img
              className="bestItem"
              src="https://mandekogebogen.dk/image/box/2130725/980/50000.jpg?oversize=1"
              alt="Pita Bread"
            />
          )}
          {popularMeal.title.includes('sandwitch') ? (
            <img
              className="bestItem"
              src="https://gastrofun.dk/wp-content/uploads/2020/04/Hjemmelavet-Burger-Shack-Burger-1.jpg"
              alt="burger"
            />
          ) : null}
        </Link>
        <p>
          <strong> {popularMeal.location} </strong>
        </p>
        <p>
          Max capacity:
          <strong> {popularMeal.max_reservations} </strong>
        </p>
        <p>
          Price :<strong> {popularMeal.price} </strong>
        </p>
      </div>
    );
  });
  console.log(popularMeals);
  return (
    <div className="homeSection">
      <div className="banner"></div>
      <div className="div-center">
        <h1>Book your table now</h1>

        <Link exact to={`/addReservaion`}>
          <button>Reserve Now</button>
        </Link>
      </div>
      <div className="div-3">{popular}</div>
    </div>
  );
}
