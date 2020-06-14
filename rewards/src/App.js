import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Rewards from "./components/Rewards"
import "bootstrap/dist/css/bootstrap.min.css";
// const store = configureStore();

class App extends Component {
  // initialize navbar values
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      menuVal: "none",
    };
  }

  // Render Function
  render() {
    return (
      <div id="smooth">
        {/* {particlesLoader()} */}
        {/* <Provider store={store}> */}
        <Router>
          <Switch>
            <Route exact path="/" component={Rewards} />
            {/* <Route path='*' exact={true} component={redirect} /> */}
          </Switch>
        </Router>
        {/* </Provider> */}
      </div>
    );
  }
}
export default App;