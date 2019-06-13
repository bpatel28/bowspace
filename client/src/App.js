import React from 'react';
import Login from './components/Login'
import Register from './components/Registration'
import UserSpace from './components/User-Space'
import Whoops404 from './components/Whoops404'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"

class App extends React.Component {

  INITIAL_STATE = {
    User: {
        Token: '',
        FirstName: '',
        LastName: '',
        Email: '',
        UserId: '',
        UserName: ''
      },
      Contacts: '',
      ViewingSpaceId: '',
      Posts: '',
      ModalShow: false,
      ContactLoad: true,
      PostsLoad: true,
      NewMessageSent: true,
      LoginLoad: false,
      SignUpLoad: false,
  }

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  /**
   * method to close newPost Modal
   */
  modalClose = () => {
    this.setState({
      ModalShow : false, 
    });
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
  showSpace = user => {
    if (user.UserId !== this.state.ViewingSpaceId) {
      this.setState({
        ViewingSpaceId: user.UserId,
        PostsLoad: true,
        Posts : '',
      });
    }
  }

  /**
   * change state for Users login data
   */
  OnSuccessLogin = data => {
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
   * 
   */
  OnSuccessRegister = data => {
    this.setState({ SignUpLoad : false})
  }

  /**
   * update user list
   */
  updateUserList = (userList) => {
    this.setState({
      Contacts : userList, ContactLoad : false 
    });
  }

  /**
   * update user post
   */
  updatePostList = (posts) => {
    this.setState({ 
      Posts : posts, PostsLoad : false  
    });
  }

  /**
   * logout user and reinitialize page
   */
  logoutUser = () => {
    this.setState({User : this.INITIAL_STATE.User});
  }

  /**
   * on sending start loader
   */
  onSendingMessage = () => {
    this.setState({ NewMessageSent : false });
  }

  /**
   * send new message
   */
  sendMessage = () => {
    this.setState({
      ModalShow: false,
      NewMessageSent : true,
    })
  }

  /**
   * complete loader
   */
  onSuccessRegister = () => {
    this.setState({
      SignUpLoad : false,
    });
  }

  /**
   * start loader on signup
   */
  onProcessRegister = () => {
    this.setState({
      SignUpLoad : true,
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
       onSend : this.sendMessage,
       onSendingMessage : this.onSendingMessage,
    };
    const contactProps = {
      Contacts : this.state.Contacts,
      User : this.state.User,
      Wait: this.state.ContactLoad,
      showSpace : this.showSpace,
      updateUserList : this.updateUserList,
      logoutUser: this.logoutUser,
    }
    const postsProps = {
      Contacts : this.state.Contacts,
      Posts : this.state.Posts,
      User : this.state.User,
      ViewingSpaceId : this.state.ViewingSpaceId,
      Wait : this.state.PostsLoad,
      updatePostList: this.updatePostList,
      onProcessPost : this.onProcessPost,
    }
    return (
      <Router>
        <Switch>
          <Route path="/login" component={(props) => ( 
                loggedIn === false ? 
                  ( <Login props={props} Wait={this.state.LoginLoad} OnSuccessLogin={this.OnSuccessLogin} OnProcessLogin={this.OnProcessLogin} OnFailedLogin={this.OnFailedLogin}/>) 
                : (<Redirect to="/"/>)) }/>
          <Route path="/register" component={(props) =>  <Register props={props} Wait={this.state.SignUpLoad} onProcessRegister={this.onProcessRegister} onSuccessRegister={this.onSuccessRegister}/>} />
          <Route exact path="/" component={(props) => ( 
                loggedIn === true ? 
                  ( <UserSpace props={props} NewPostProps={newPostProps} ContactProps={contactProps} PostsProps={postsProps}/>) 
                : ((<Redirect to="/login"/>)))}/>
          <Route component={Whoops404}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
