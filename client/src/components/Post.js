import React from "react"
import {Container, Card, Badge, Row, Col, Button} from "react-bootstrap"

const Post = props => {
    let msg = props.msg;
    return (
        <Card className=" my-4 bg-light" >
            <Card.Body>
                <Card.Text>
                    {msg.PostHtml}
                </Card.Text>
                <Card.Text className="d-flex justify-content-end text-muted" >- {msg.SenderId} {msg.TimeStamp}</Card.Text>
            </Card.Body>
        </Card>
    );
}

class Posts extends React.Component {
    render() {
        const posts = [
            {
                TimeStamp: "2019-05-30 16:24:23.0033333",
                PostHtml : "hii",
                PostId : 1001,
                SenderId : 1000,
                ReceiverId : 10001
            },
            {
                TimeStamp: "2019-05-30 16:24:23.0033333",
                PostHtml: "hii",
                PostId: 1001,
                SenderId: 1000,
                ReceiverId: 10001
            },
        ];
        const Username = "BrijeshPatel_";
        const FirstName = "Brijesh";
        const LastName = "Patel";
        const initials = "BP";
        return (
            <div className="p-3" style={{height : "75%", overflow : "auto", margin: "0 auto"}}>
                {
                    posts.map((post, index) => <Post key={index} msg={post}/>)
                }
            </div>
        );
    }
}


export default Posts;