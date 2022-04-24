import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Home } from './components/Home';
import { Navigation } from './components/Navigation';

import { About } from './components/About';

import { Menu } from './components/menu/Menu';
import { MealDetails } from './components/menu/MealDetails';
import { AddMeal } from './components/menu/AddMeal';

import { Reservation } from './components/reservation/Reservation';
import { AddReservation } from './components/reservation/AddReservation';

import { Reviews } from './components/review/Reviews';
import { AllReviews } from './components/review/AllReviews';
import { AddReview } from './components/review/AddReview';

import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

import { NotFound } from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route path="/about" component={About} />

          <Route exact path="/menu" component={Menu} />
          <Route exact path="/menu/:id" component={MealDetails} />
          <Route exact path="/addMeal" component={AddMeal} />

          <Route exact path="/reviews/:id" component={Reviews} />
          <Route exact path="/all-reviews" component={AllReviews} />
          <Route exact path="/all-reviews/AddReview" component={AddReview} />

          <Route exact path="/reservation" component={Reservation} />
          <Route
            exact
            path="/reservation/addReservaion"
            component={AddReservation}
          />
          <Route exact path="/contact" component={Contact} />

          <Route exact path="/" component={Home} />
          <Route path="*" component={NotFound} />
        </Switch>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
