import React from "react";
import {Link} from "react-router-dom"
import {Container, Row, Col, Form, Button, Card} from "react-bootstrap";

const Login = props => {
    return (
        <div className='bg-dark d-flex align-items-center' style={{height : '100vh', backgroundColor : 'black'}}>
          <Container>
            <Row>
              <Col></Col>
              <Col md="5">
                    <Card border='primary'>
                        <Card.Header as='h5' className="text-center text-white" style={{ backgroundColor : '#3575dd' }}>
                            <Form.Label> WELCOME</Form.Label>
                            <Form.Text>Nice to see you again, Please Login.</Form.Text>
                        </Card.Header>
                        <Card.Body>
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label><i className="fas fa-user-alt"></i> Email/Username</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email or Username" />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label><i className="fas fa-key"></i> Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="text-muted text-center">
                                            Don't have an account. <Link to='/register'> Register Now. </Link>
                                        </Form.Label>
                                    </Form.Group>
                            
                                    <Form.Group className="text-center">
                                            <Button style={{backgroundColor : '#3575dd'}} className="text-center" type="submit">
                                                <i className="fas fa-sign-in-alt"></i> Login
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

export default Login; 