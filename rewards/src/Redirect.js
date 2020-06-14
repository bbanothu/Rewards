import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// Redirect Class
class redirect extends Component {
  render() {
    return <Redirect to='/' />
  }
}
export default redirect;
