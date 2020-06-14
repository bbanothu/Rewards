import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Rewards from "./components/Rewards"
import redirect from "./Redirect"
import { Provider } from 'react-redux';
import store from './Store/myStore'
import "bootstrap/dist/css/bootstrap.min.css";

// Entry point
class App extends Component {
  render() {
    return (
      <div id="smooth">
        <Provider store={store}>
          <Router>
            <Switch>
              <Route exact path="/" component={Rewards} />
              <Route path='*' exact={true} component={redirect} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}
export default App;