import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Home } from './components/Home';
import { Navigation } from './components/Navigation';

import { About } from './components/About';

import { Menu } from './components/menu/Menu';
import { MealSpecific } from './components/menu/MealSpecific';
import { AddMeal } from './components/menu/AddMeal';

import { Reservations } from './components/reservation/Reservations';
import { ReservationSpecific } from './components/reservation/ReservationSpecific';
import { AddReservation } from './components/reservation/AddReservation';

import { Reviews } from './components/review/Reviews';
import { ReviewSpecific } from './components/review/ReviewSpecific';
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

          <Route exact path="/menu/:id" component={MealSpecific} />
          <Route exact path="/menu" component={Menu} />
          <Route exact path="/addMeal" component={AddMeal} />

          <Route exact path="/reviews/:id" component={ReviewSpecific} />
          <Route exact path="/reviews" component={Reviews} />
          <Route exact path="/addReview" component={AddReview} />

          <Route
            exact
            path="/reservations/:id"
            component={ReservationSpecific}
          />
          <Route exact path="/reservations" component={Reservations} />
          <Route exact path="/addReservaion" component={AddReservation} />

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
