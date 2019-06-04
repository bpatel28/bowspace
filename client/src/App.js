import React from 'react';
import Login from './components/Login'
import Register from './components/Registration'
import UserSpace from './components/User-Space'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
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
          FirstName: 'Brijesh',
          LastName: 'Patel',
          Email: 'b.patel405@mybvc.ca',
          UserId: '1000',
          UserName: 'b.patel405'
        }
      ],
      ViewingSpaceId : "1000",
      Posts : [],
      ModalShow : false,
    };
  }

  /**
   * method to close newPost Modal
   */
  modalClose = () => {
    this.setState({
      ModalShow : false, 
    })
  }

  /**
   * method to open newPost Modal
   */
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
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register} />
          <Route exact path="/" component={(...props) => <UserSpace props NewPostProps={newPostProps} User={this.state.User} Posts={this.state.Posts} Contacts={this.state.Contacts} ViewingSpaceId={this.state.ViewingSpaceId}/>}/>
          <Route component={Whoops404}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
