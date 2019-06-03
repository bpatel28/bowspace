import React from 'react';
import Login from './components/Login'
import Register from './components/Registration'
import UserSpace from './components/User-Space'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import {  } from 'react-bootstrap'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      User : {
        Token : '',
        FirstName : '',
        LastName : '',
        Email : '',
        UserId : '',
        UserName : ''
      }, 
      Contacts : [],
      Posts : [],
    };
  }
  
  //render app
  render() {
    const loggedIn = this.state.Token !== '' ? true : false;
    return (
      <Router>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register} />
        <Route exact path="/" component={UserSpace}/>
      </Router>
    );
  }
}

export default App;
