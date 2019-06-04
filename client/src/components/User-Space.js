import React from "react"
import Contacts from "./Contacts"
import Posts from "./Post"
import NewPostModal from "./New-Post"
import {Container, Row, Col, Card, Badge, Button} from "react-bootstrap"

class UserSpace extends React.Component {

    render() {
        const user = this.props.User;
        const userName = user.UserName;
        const firstName = user.FirstName;
        const lastName = user.LastName;
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        return(
            <Container fluid='true'>
                <Row>
                    <Col md='3' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                        <Contacts Contacts={this.props.Contacts} User={user}/>
                    </Col>
                    <Col md='9' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                        <Container style={{height : "100%"}}>
                            <div className="py-2" style={{height : "20%"}}>
                                <Card className="text-white py-2" style={{backgroundColor : "#3575dd"}}>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                <Card.Title as="h1"><Badge variant="light" pill="true">{initials}</Badge></Card.Title>
                                                <div className="ml-3">
                                                    <Card.Title>{firstName + " " + lastName}</Card.Title>
                                                    <Card.Subtitle className="">{userName}</Card.Subtitle>
                                                </div>
                                            </div>
                                            <Button style={{borderRadius: "35px", fontSize : "24px", width : "60px", height : "60px"}} variant="light" onClick={this.props.NewPostProps.modalOpen}><i class="fas fa-pen"></i></Button>
                                            <NewPostModal Receiver={user} show={this.props.NewPostProps.ModalShow} onHide={this.props.NewPostProps.modalClose}/>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="p-3" style={{height : "75%", overflow : "auto", margin: "0 auto"}}>
                                <Posts Contacts={this.props.Contacts} Posts={this.props.Posts}/>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default UserSpace;