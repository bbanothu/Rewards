import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Rewards from "./components/Rewards"
import "bootstrap/dist/css/bootstrap.min.css";
import redirect from "./Redirect"
import { Provider } from 'react-redux';
import countReducer from './reducer/reducer'
import { createStore } from 'redux';
var uniqueId = require('lodash.uniqueid');

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

let State = [];
let rewardsArray = [];
let C1 = [];
let C2 = [];
let C3 = [];
let C4 = [];
let C5 = [];
rewardsArray.push({ id: uniqueId(`R-1`), content: `R1` });
rewardsArray.push({ id: uniqueId(`R-2`), content: `R2` });
rewardsArray.push({ id: uniqueId(`R-3`), content: `R3` });
rewardsArray.push({ id: uniqueId(`R-4`), content: `R4` });
rewardsArray.push({ id: uniqueId(`R-5`), content: `R5` });
State.push(rewardsArray);
State.push(C1);
State.push(C2);
State.push(C3);
State.push(C4);
State.push(C5);

const store = createStore(todos, State)

// Entry point
class App extends Component {
  // Render Function
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