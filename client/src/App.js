import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
// pages:
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// components:
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
          <Navbar />
          <Switch>
            <Route exact path="/" component={home} />
            <Route exact path="/login" component={login} />
            <Route exact path="/signup" component={signup} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
