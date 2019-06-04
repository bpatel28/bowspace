import React from "react"
import {Container, ListGroup, Button, Card, Badge, OverlayTrigger} from "react-bootstrap"
import Loader from 'react-loader-spinner'

const ContactToolTip = (props, contact) => (
    <div {...props} className="bg-primary text-white p-2 mx-2 rounded">
        {contact.UserName}
    </div>
);

class Contacts extends React.Component {

    /**
     * method to get full name from firstname and last name
     */
    getFullName = (firstName, lastName) => {
        return firstName + " " + lastName;
    }

    render () {
        const contacts = this.props.Contacts;
        const user = this.props.User;
        const firstName = user.FirstName;
        const lastName = user.LastName;
        const name = this.getFullName(firstName, lastName);
        const username = user.UserName;
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        return (
            <Container fluid='true' className="text-white text-center" style={{height : '100%', padding : '0'}}>
                <Card style={{ backgroundColor : '#3575dd' }}>
                   <Card.Header as="h5">
                       <Card.Text><i className="fas fa-home"></i> Bowspace</Card.Text>
                   </Card.Header>
                   <Card.Body className="p-3 m-0">
                        <Card.Title as="h1"><Badge variant="light" pill="true">{initials}</Badge></Card.Title>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>{username}</Card.Text>
                        <Button variant="danger"><i className="fas fa-sign-out-alt"></i> Logout</Button>
                    </Card.Body>
                </Card >
                <Card bg='dark' style={{height : '60%'}}>
                    <Card.Header as="h5"><i className="fas fa-address-book"></i> Members</Card.Header>
                    <Card.Body style={{height : '95%', overflow : 'auto'}}>
                        <ListGroup variant="flush">
                            {
                                this.props.Wait ? 
                                    <div className="d-flex justify-content-center mt-3"><Loader type="Oval" color="#3575dd" height="100" width="100"/></div> 
                                :
                                    contacts.map((contact, index) => (
                                        <ListGroup.Item className = "bg-dark border-0" key={index}>
                                            <OverlayTrigger placement="right-start" overlay={(props) => ContactToolTip(props, contact)}>
                                                <Button variant="outline-light" onClick={() => this.props.showSpace(contact)}>
                                                    {this.getFullName(contact.FirstName, contact.LastName)}
                                                </Button>
                                            </OverlayTrigger>
                                        </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default Contacts;