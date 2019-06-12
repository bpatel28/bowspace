import React from "react"
import {Link} from "react-router-dom"
import {Container, Row, Col, Form, Button, Card} from "react-bootstrap"
import Loader from "react-loader-spinner"
import {RegisterUser} from '../api/api'


class Register extends React.Component {

    /**
     * Register new account and redirect to login page on success
     */
    signUpUser = (e) => {
        e.preventDefault();
        this.props.onProcessRegister();
        const FirstName = this.refs.fname.value;
        const LastName = this.refs.lname.value;
        const UserName = this.refs.username.value;
        const Email = this.refs.email.value;
        const Password = this.refs.pwd.value;
        const ConfirmPassword = this.refs.cpwd.value;
        // input validation
        if ((FirstName || LastName || UserName || Email || Password || ConfirmPassword) === "") {
            alert("Please fill all the field!");
            this.props.onSuccessRegister();
            return;
        }
        if (Password !== ConfirmPassword) {
            alert("Password does not match!");
            this.props.onSuccessRegister();
            return;
        }
        let data = {
            FirstName,
            LastName,
            UserName,
            Email,
            Password,
        }
        //api call
        RegisterUser(data)
            .then((result) => {
                if (result.Status === "Success") {
                    alert("User Register Successfully!");
                    //redirect
                    this.props.props.history.push('/login');
                } else {
                    throw new Error(result.Guidance);
                }
            }).catch(err => {
                //show error
                alert(err);
            }).then(() => {
                this.props.onSuccessRegister();
            }); 
    }

    render () {
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
                                        <Form.Control type="fname" placeholder="Enter First Name" ref="fname"/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicTextLname">
                                        <Form.Label><i className="fas fa-user"></i> Last Name</Form.Label>
                                        <Form.Control type="lname" placeholder="Enter Last Name" ref="lname"/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicTextUsername">
                                        <Form.Label><i className="fas fa-user-alt"></i> User Name</Form.Label>
                                        <Form.Control type="username" placeholder="Enter User Name" ref="username"/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label><i className="fas fa-envelope"></i> Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Email" ref="email"/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label><i className="fas fa-key"></i> Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" ref="pwd"/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicConfirmPassword">
                                        <Form.Label><i className="fas fa-key"></i> Confirm Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" ref="cpwd"/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="text-muted text-center">
                                            Already have an account. <Link to='/login'> Login here. </Link>
                                        </Form.Label>
                                    </Form.Group>

                                    {
                                        this.props.Wait ?
                                            <div className="d-flex justify-content-center mt-3"><Loader type="Oval" color="#3575dd" height="50" width="50"/></div>
                                        :
                            
                                            <Form.Group className="text-center">
                                                <Link to="/login">
                                                    <Button style={{backgroundColor : '#3575dd'}} className="text-center" type="submit" onClick={this.signUpUser}>
                                                        <i className="fas fa-sign-in-alt"></i> Sign Up
                                                    </Button>
                                                </Link>
                                            </Form.Group>
                                    }
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
}

export default Register;