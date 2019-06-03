import React from "react"
import {Link} from "react-router-dom"
import {Container, Row, Col, Form, Button, Card} from "react-bootstrap"

const Register = props => {
    return (
        <div className='bg-dark d-flex align-items-center' style={{height : '100vh', backgroundColor : 'black'}}>
          <Container style={{overflow : 'auto', maxHeight : '100%'}}>
            <Row className='my-3'>
              <Col></Col>
              <Col md="5">
                    <Card border='primary'>
                        <Card.Header as='h5' className="text-center text-white" style={{ backgroundColor : '#3575dd' }}>
                            <Form.Label>WELCOME</Form.Label>
                            <Form.Text>Create a new account.</Form.Text>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formBasicTextFname">
                                    <Form.Label><i className="fas fa-user"></i> First Name</Form.Label>
                                    <Form.Control type="fname" placeholder="Enter First Name" />
                                </Form.Group>

                                <Form.Group controlId="formBasicTextLname">
                                    <Form.Label><i className="fas fa-user"></i> Last Name</Form.Label>
                                    <Form.Control type="lname" placeholder="Enter Last Name" />
                                </Form.Group>

                                <Form.Group controlId="formBasicTextUsername">
                                    <Form.Label><i className="fas fa-user-alt"></i> User Name</Form.Label>
                                    <Form.Control type="username" placeholder="Enter User Name" />
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label><i className="fas fa-envelope"></i> Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter Email" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label><i className="fas fa-key"></i> Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <Form.Group controlId="formBasicConfirmPassword">
                                    <Form.Label><i className="fas fa-key"></i> Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-muted text-center">
                                        Already have an account. <Link to='/login'> Login here. </Link>
                                    </Form.Label>
                                </Form.Group>
                        
                                <Form.Group className="text-center">
                                        <Button style={{backgroundColor : '#3575dd'}} className="text-center" type="submit">
                                            <i className="fas fa-sign-in-alt"></i> Sign Up
                                        </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register;