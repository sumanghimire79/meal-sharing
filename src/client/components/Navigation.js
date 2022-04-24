import React from 'react';
import './mealSharing.css';
import { Link } from 'react-router-dom';
export function Navigation() {
  return (
    <nav>
      <h3>logo</h3>
      <section>
        {/* <img src="./assets/images/hyf.png" alt="Logo" /> */}
      </section>
      <ul>
        <Link to={'/'}>
          <li>Home</li>
        </Link>
        <Link to={'/about'}>
          <li>About</li>
        </Link>
        <Link to={'/menu'}>
          <li>Menu</li>
        </Link>

        <Link to={'/reservation'}>
          <li>Reservation</li>
        </Link>
        <Link to={'/all-reviews'}>
          <li>Reviews</li>
        </Link>
        <Link to={'/contact'}>
          <li>Contact</li>
        </Link>
      </ul>
    </nav>
  );
}
