import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [popularMeals, setPopularMeals] = useState([]);

  const fetchItem = async () => {
    const data = await fetch('/api/meals?popularMeal=true');
    const jsonData = await data.json();
    setPopularMeals(jsonData);
  };

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const popular = popularMeals.map((popularMeal, index) => {
    return (
      <div key={index} className="popularmeals">
        <Link to={`/meals/${popularMeal.id}`}>
          <h3>{popularMeal.title}</h3>

          {!popularMeal.title
            .toLowerCase()
            .includes('sandwitch' || 'pita' || 'pizza') && (
            <img
              className="bestItem"
              src="https://gastrofun.dk/wp-content/uploads/2020/04/Hjemmelavet-Burger-Shack-Burger-1.jpg"
              alt="bestItem"
            />
          )}
          {popularMeal.title.toLowerCase().includes('pizza') && (
            <img
              className="bestItem"
              src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395__480.jpg"
              alt="Pizza"
            />
          )}
          {popularMeal.title.toLowerCase().includes('pita') && (
            <img
              className="bestItem"
              src="https://mandekogebogen.dk/image/box/2130725/980/50000.jpg?oversize=1"
              alt="Pita Bread"
            />
          )}

          {popularMeal.title.toLowerCase().includes('sandwitch') && (
            <img
              className="bestItem"
              src="https://www.bing.com/th?id=OIP.8RJptF5WHZYS6JYr9jXS1QHaFH&w=300&h=207&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
              alt="sandwitch"
            />
          )}
        </Link>
        <p>
          <strong> {popularMeal.location} </strong>
        </p>
        <p>
          Price :<strong> {popularMeal.price} </strong>
        </p>
      </div>
    );
  });

  return (
    <div className="homeSection">
      <div className="banner">
        <Link exact to={`/addReservaion`}>
          <h1>Book Your Meal</h1>
          <button>Reserve Now</button>
        </Link>
      </div>
      <h3>Popular Meals</h3>
      <div className="div-3">{popular}</div>
    </div>
  );
}
