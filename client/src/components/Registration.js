import React from "react";
import {Link} from "react-router-dom"
import {Container, Row, Col, Form, Button, Card} from "react-bootstrap";

const Register = props => {
    return (
        <div className='bg-dark d-flex align-items-center' style={{height : '100vh', backgroundColor : 'black'}}>
          <Container style={{overflow : 'auto', maxHeight : '100%'}}>
            <Row>
              <Col></Col>
              <Col md="5">
                    <Card border='primary'>
                        <Card.Header as='h5' className="text-center text-white" style={{ backgroundColor : '#3575dd' }}>
                            Create New Account
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formBasicTextFname">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="fname" placeholder="Enter First Name" />
                                </Form.Group>

                                <Form.Group controlId="formBasicTextLname">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="lname" placeholder="Enter Last Name" />
                                </Form.Group>

                                <Form.Group controlId="formBasicTextUsername">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="username" placeholder="Enter User Name" />
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter Email" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <Form.Group controlId="formBasicConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="text-muted text-center">
                                        Already have an account. <Link to='/login'> Login here. </Link>
                                    </Form.Label>
                                </Form.Group>
                        
                                <Form.Group className="text-center">
                                        <Button style={{backgroundColor : '#3575dd'}} className="text-center" type="submit">
                                            Submit
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