import React from 'react';
import Login from './components/Login'
import Register from './components/Registration'
import UserSpace from './components/User-Space'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import {  } from 'react-bootstrap'
import Whoops404 from './Whoops404'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      User : {
        Token : '',
        FirstName : 'Brijesh',
        LastName : 'Patel',
        Email : 'b.patel405@mybvc.ca',
        UserId : '1000',
        UserName : 'b.patel405'
      }, 
      Contacts : [
        {
          Token: '',
          FirstName: 'Brijesh',
          LastName: 'Patel',
          Email: 'b.patel405@mybvc.ca',
          UserId: '1000',
          UserName: 'b.patel405'
        },
      ],
      Posts : [],
      ModalShow : false,
    };
  }

  modalClose = () => {
    this.setState({
      ModalShow : false, 
    })
  }

  modalOpen = () => {
    console.log(true)
    this.setState({
      ModalShow : true,
    });
  }
  
  //render app
  render() {
    const loggedIn = this.state.Token !== '' ? true : false;
    const newPostProps = {
       ModalShow : this.state.ModalShow,
       modalOpen : this.modalOpen,
       modalClose : this.modalClose,
    }
    return (
      <Router>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register} />
        <Route exact path="/" component={(...props) => <UserSpace props NewPostProps={newPostProps} User={this.state.User} Posts={this.state.Posts} Contacts={this.state.Contacts}/>}/>
        <Route component={Whoops404}/>
      </Router>
    );
  }
}

export default App;
