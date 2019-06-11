import React from "react";
import {Form, Button, Modal} from "react-bootstrap"
import { SendPost } from "../api/api"
import Loader from "react-loader-spinner"

class NewPostModal extends React.Component {


    onSend = () => {
        const SenderId = this.props.Sender.UserId;
        const ReceiverId = this.props.Receiver.UserId;
        const PostHtml = this.refs.postHtml.value;
        const token = this.props.Sender.Token;
        if (PostHtml.replace(" ", "") === "") {
            alert("Empty Message is not allowed!");
            return;
        }
        this.props.onSendingMessage();
        SendPost(token, SenderId, ReceiverId, PostHtml)
            .then((res) => {
                if (res.Status === "Success") {
                    this.props.onSend();
                } else {
                    throw new Error("Please try again!");
                }
            })
            .catch((err) => {
                alert(err.Guidance);
                this.props.onHide();
            })
    }

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
                    { 
                        !this.props.Wait ?
                            <div className="d-flex justify-content-center mt-3"><Loader type="Oval" color="white" height="50" width="50"/></div> 
                        :
                            (
                                <div>
                                    <Form.Label><i className="fas fa-pen"></i> Create Post:</Form.Label>
                                    <Form.Control as="textarea" rows="7" type="text" placeholder="Enter message..." ref="postHtml"/>
                                </div>
                            )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.props.onHide}>Close</Button>
                    <Button variant="primary" onClick={this.onSend}>Send</Button>
                </Modal.Footer>
            </Modal>
        );
  }
}

export default NewPostModal;