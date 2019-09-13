import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
import themeOptions from './util/theme';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Mui
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// pages:
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
// components:
import Navbar from './components/Navbar';
import AuthRoute from './util/AuthRoute';

const theme = createMuiTheme(themeOptions);

const token = localStorage.FBIdToken;
let authenticated;
if (token) {
  const decodedToken = jwtDecode(token);
  // Compare against now *1000 because it is in seconds.
  if (decodedToken.exp * 1000 < Date.now()) {
    authenticated = false;
    window.location.href = '/login';
  } else {
    authenticated = true;
  }
}

function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute
                exact
                path="/login"
                component={login}
                authenticated={authenticated}
              />
              <AuthRoute
                exact
                path="/signup"
                component={signup}
                authenticated={authenticated}
              />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
