import React from "react"
import Contacts from "./Contacts"
import Posts from "./Post"
import {Container, Row, Col, Card, Badge, Button} from "react-bootstrap"

class UserSpace extends React.Component {
    render() {
        const Username = "BrijeshPatel_";
        const FirstName = "Brijesh";
        const LastName = "Patel";
        const initials = "BP";
        return(
            <Container fluid='true'>
                <Row>
                    <Col md='3' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                        <Contacts/>
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
                                                    <Card.Title>{FirstName + " " + LastName}</Card.Title>
                                                    <Card.Subtitle className="">{Username}</Card.Subtitle>
                                                </div>
                                            </div>
                                            <Button style={{borderRadius: "35px", fontSize : "24px", width : "60px", height : "60px"}} variant="light"><i class="fas fa-pen"></i></Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="p-3" style={{height : "75%", overflow : "auto", margin: "0 auto"}}>
                                <Posts/>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default UserSpace;