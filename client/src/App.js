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
        FirstName : '',
        LastName : '',
        Email : '',
        UserId : '',
        UserName : ''
      }, 
      Contacts : [],
      ViewingSpaceId : 0,
      Posts : [],
      ModalShow : false,
      ContactLoad : false,
      PostsLoad : false,
      NewMessageSent : false,
      LoginLoad : false,
      SignUpLoad : false,
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

  /**
   * change state for Users login data
   */
  OnSuccessLogin = (data) => {
    this.setState({ User : data.Login, LoginLoad : false, ViewingSpaceId : data.Login.UserId, Contacts : [data.Login] });
  }

  /**
   * change state to show loader
   */
  OnProcessLogin = () => {
    this.setState({
      LoginLoad : true
    });
  }

  /**
   * change state to finish loader
   */
  OnFailedLogin = () => {
    this.setState({LoginLoad : false});
  }

  /**
   * update user list
   */
  updateUserList = (userList) => {
    this.setState(prevState => {
      if (JSON.stringify(prevState.Contacts) !== JSON.stringify(userList)) {
        return { Contacts : userList }
      }
    });
  }

  /**
   * update user post
   */
  updatePostList = posts => {
    this.setState(prevState => {
      if (JSON.stringify(prevState.Posts) !== JSON.stringify(posts)) {
        return { Posts : posts }
      }
    });
  }
  
  //render app
  render() {
    const loggedIn = this.state.User.Token !== '' ? true : false;
    const newPostProps = {
       ModalShow : this.state.ModalShow,
       User : this.state.User,
       Wait : this.state.NewMessageSent,
       modalOpen : this.modalOpen,
       modalClose : this.modalClose,
    };
    const contactProps = {
      Contacts : this.state.Contacts,
      User : this.state.User,
      Wait: this.state.ContactLoad,
      showSpace : this.showSpace,
      updateUserList : this.updateUserList,
    }
    const postsProps = {
      Contacts : this.state.Contacts,
      Posts : this.state.Posts,
      User : this.state.User,
      ViewingSpaceId : this.state.ViewingSpaceId,
      Wait : this.state.PostsLoad,
      updatePostList: this.updatePostList,
    }
    return (
      <Router>
        <Switch>
          <Route path="/login" component={(...props) => ( 
                loggedIn === false ? 
                  ( <Login props Wait={this.state.LoginLoad} OnSuccessLogin={this.OnSuccessLogin} OnProcessLogin={this.OnProcessLogin} OnFailedLogin={this.OnFailedLogin}/>) 
                : (<Redirect to="/"/>)) }/>
          <Route path="/register" component={(...props) => (
                 loggedIn === false ? 
                  (<Register props Wait={this.state.SignUpLoad}/>) 
                : (<Redirect to="/"/>)) } />
          <Route exact path="/" component={(...props) => ( 
                loggedIn === true ? 
                  ( <UserSpace props NewPostProps={newPostProps} ContactProps={contactProps} PostsProps={postsProps}/>) 
                : ((<Redirect to="/login"/>)))}/>
          <Route component={Whoops404}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
