import React from "react";
import {Form, Button, Modal} from "react-bootstrap"

class NewPostModal extends React.Component {
    render() {
        const user = this.props.Receiver;
        return (
            <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {user.FirstName + " " + user.LastName} ({user.UserName})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label><i className="fas fa-pen"></i> Create Post:</Form.Label>
                    <Form.Control as="textarea" rows="7" type="text" placeholder="Enter message..."/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.props.onHide}>Close</Button>
                    <Button variant="primary" onClick={this.props.onSend}>Send</Button>
                </Modal.Footer>
            </Modal>
        );
  }
}

export default NewPostModal;