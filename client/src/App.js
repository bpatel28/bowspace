import React from 'react';
import Login from './components/Login'
import { BrowserRouter as Router, Route } from "react-router-dom"
import {  } from 'react-bootstrap'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  //render app
  render() {
    return (
      <Router>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Login} />
      </Router>
    );
  }
}

export default App;
