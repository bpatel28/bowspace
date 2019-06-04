import React from 'react';
import Login from './components/Login'
import Register from './components/Registration'
import UserSpace from './components/User-Space'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
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
    this.setState({
      ModalShow : true,
    });
  }

  /**
   * method to change viewing sapce id
   */
  showSpace = (user) => {
    if (user.UserId !== this.state.ViewingSpaceId) {
      this.setState({
        ViewingSpaceId: user.UserId,
      });
      //fetch posts here

    }
  }
  
  //render app
  render() {
    const loggedIn = this.state.Token !== '' ? true : false;
    const newPostProps = {
       ModalShow : this.state.ModalShow,
       User : this.state.User,
       Wait : false,
       modalOpen : this.modalOpen,
       modalClose : this.modalClose,
    };
    const contactProps = {
      Contacts : this.state.Contacts,
      User : this.state.User,
      Wait: false,
      showSpace : this.showSpace,
    }
    const postsProps = {
      Contacts : this.state.Contacts,
      Posts : this.state.Posts,
      User : this.state.User,
      ViewingSpaceId : this.state.ViewingSpaceId,
      Wait : false,
    }
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register} />
          <Route exact path="/" component={(...props) => <UserSpace props NewPostProps={newPostProps} ContactProps={contactProps} PostsProps={postsProps}/>}/>
          <Route component={Whoops404}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
