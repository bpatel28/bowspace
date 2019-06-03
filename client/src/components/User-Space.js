import React from "react"
import Contacts from "./Contacts"
import Posts from "./Post"
import {Container, Row, Col} from "react-bootstrap"

const UserSpace = props => {
    return(
        <Container fluid='true'>
            <Row>
                <Col md='3' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                    <Contacts/>
                </Col>
                <Col md='9' style={{height : '100vh', padding : '0'}} className='bg-dark'>
                    <Posts/>
                </Col>
            </Row>
        </Container>
    );
}

export default UserSpace;