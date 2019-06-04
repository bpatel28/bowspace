import React from "react"
import {Card} from "react-bootstrap"

/**
 * filter contact from contact list
 * @param {*} contacts 
 * @param {*} userId 
 */
const getContact = (contacts, userId) => {
    let filteredContacts = contacts.filter(contact => contact.UserId === userId);
    return filteredContacts[0];
};

/**
 * stateless component post to display single post
 * @param {*} props 
 */
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

/**
 * Show list of posts as per the state data
 * @param {*} props 
 */
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