import React from "react"
import Contacts from "./Contacts"
import Posts from "./Post"
import NewPostModal from "./New-Post"
import {Container, Row, Col, Card, Badge, Button} from "react-bootstrap"
import Loader from "react-loader-spinner"
import { GetUserList } from "../api/api"

/**
 * Userspace component to view User space as per the state data
 */
class UserSpace extends React.Component {

    /**
     * filter contact from list with userid
     */
    getContactFromList = (contactList, userId) => {
        let filteredContacts = contactList.filter(contact => contact.UserId === userId);
        return filteredContacts[0];
    }

    /**
     * get initial from firstname and lastname
     */
    getIntitials = (firstName, lastName) => {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }

    componentDidMount = () => {
        this.userTimerId = window.setTimeout(() => this.fetchUserList(), 1000);
    }

    componentWillUnmount = () => {
        clearTimeout(this.userTimerId);
    }

    fetchUserList = () => {
         GetUserList(this.props.ContactProps.User.Token)
            .then((result) => {
                if (result.Status === "Success") {
                    this.props.ContactProps.updateUserList(result.Users);
                } else {
                    throw new Error(result.Guidance);
                }
            })
            .then(this.userTimerId = window.setTimeout(() => this.fetchUserList(), 2000))
    }

    render() {
        const contacts = this.props.PostsProps.Contacts;
        const viewingSpaceId = this.props.PostsProps.ViewingSpaceId;
        const viewingUser = this.getContactFromList(contacts, viewingSpaceId);
        return(
            <Container fluid='true'>
                <Row>
                    <Col md='3' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                        <Contacts Contacts={this.props.ContactProps.Contacts} Wait={this.props.ContactProps.Wait} User={this.props.ContactProps.User} showSpace={this.props.ContactProps.showSpace}/>
                    </Col>
                    <Col md='9' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                        <Container style={{height : "100%"}}>
                            <div className="py-2" style={{height : "20%"}}>
                            <Card className="text-white py-2" style={{backgroundColor : "#3575dd"}}>
                                {
                                    this.props.PostsProps.Wait ? 
                                        <div className="d-flex justify-content-center mt-3"><Loader type="Oval" color="white" height="50" width="50"/></div> 
                                    :
                                        <Card.Body>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex flex-row">
                                                    <Card.Title as="h1"><Badge variant="light" pill="true">{this.getIntitials(viewingUser.FirstName, viewingUser.LastName)}</Badge></Card.Title>
                                                    <div className="ml-3">
                                                        <Card.Title>{viewingUser.FirstName + " " + viewingUser.LastName}</Card.Title>
                                                        <Card.Subtitle className="">{viewingUser.UserName}</Card.Subtitle>
                                                    </div>
                                                </div>
                                                <Button style={{borderRadius: "35px", fontSize : "24px", width : "60px", height : "60px"}} variant="light" onClick={this.props.NewPostProps.modalOpen}><i className="fas fa-pen"></i></Button>
                                                <NewPostModal Wait={this.props.NewPostProps.Wait} Receiver={viewingUser} show={this.props.NewPostProps.ModalShow} onHide={this.props.NewPostProps.modalClose}/>
                                            </div>
                                        </Card.Body>
                                }
                            </Card>
                            </div>
                            <div className="p-3" style={{height : "75%", overflow : "auto", margin: "0 auto"}}>
                                <Posts Wait={this.props.PostsProps.Wait} Contacts={this.props.PostsProps.Contacts} Posts={this.props.PostsProps.Posts}/>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default UserSpace;