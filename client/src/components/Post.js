import React from "react"
import {Card} from "react-bootstrap"

const getContact = (contacts, userId) => {
    let filteredContacts = contacts.filter(contact => contact.UserId === userId);
    return filteredContacts[0];
};

const Post = props => {
    let msg = props.msg;
    let contacts = props.contacts;
    let contact = getContact(contacts, msg.SenderId);
    return (
        <Card className=" my-4 bg-light" >
            <Card.Body>
                <Card.Text>
                    {msg.PostHtml}
                </Card.Text>
                <Card.Text className="d-flex justify-content-end text-muted" >- {contact.FirstName + " " + contact.LastName} ({contact.UserName}) {(msg.TimeStamp).toUTCString()}</Card.Text>
            </Card.Body>
        </Card>
    );
}

const Posts = (props) => {
    const posts = props.Posts;
    const contacts = props.Contacts;
    return (
        <div className="p-3" style={{height : "75%", overflow : "auto", margin: "0 auto"}}>
            {
                posts.map((post, index) => <Post key={index} msg={post} contacts={contacts}/>)
            }
        </div>
    );
}


export default Posts;