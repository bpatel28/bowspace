# Bowspace

Chat Application to post messages on different users wall.

## Tools

- [Node.js](server.js) - API Server
- [React.js](client) - Client Application
- [MS SQL Server](data) - Database
- [Mocha and Chai](test) - Unit testing for server side code

## API Server Database Connection Requirement

### Install database with [scripts](data)

### Add `config/config.js` file

    Please include following code in config.js

    `module.exports = {
        'secret': 'bowspacecode',
        'database': {
            database: 'bowspace',
            server: '_ServerName_',
            user : '_UserName_',
            password : '_Password_',
        }
    };`

## Run Application

1. Run all the script inside [data](data)
2. Configure Database - add config file
3. Start API Server - `npm start`
4. Start Client App - `cd client` & `npm start`

## API Specification

### Summary

1. Log In - This API will return Login Token if user provided correct credentials otherwise return error message with guidance.

2. Register New Account - This API will help user to register new account. API will return UserId with Success message if user provided valid data otherwise it will return error with guidance.

3. Get Users information - This API will return list of users with their details. Users could be filtered with different params like UserId, UserName, Keywords.

4. Get Posts - This API will return list of posted messages on wall. Messages could be filtered with SenderId, ReceiverId, Keywords, TimeStamp or PostId.

5. Create Post - This API will accept new post and return PostId with success message or return error with guidance.

6. Delete Post - This API will delete post from database with the help of PostId provided in the Request Body.

7. Update User - This API will update user information and expires old user information. API return new information with success message or error with guidance.

### Service 1 - Log In

    This API will return Web token which will be used in subsequent requests to access service. If credentials are incorrect it will return access-denied and error message.

    **[API END POINT](routes/auth.js)** - http://localhost:5000/rest/auth

    **Request Method** - POST

    **JSON BODY** - { "UserName" : "user123", "Email" : "email@xyz.com", "Password" : "afso*ik3wemf$"  }

    User can provide UserName or Email, and password for login

    **Response Success** - {"Login" : { "UserId" : "1u", "UserName" : "user123", "FirstName" : "firstName", "LastName" : "lname", "Email" : "email@xyz.com", "Token" : "fyg2ukehj23nqrewio23i32jkenwfio23jnf34ui843uii3uuui4" }, "Status" : "Success"}

    **Response Error** - { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}

### Service 2 - Register New Account

    This API will help user to register new account. API will return UserId with message and status if the information are valid otherwise it will return error with status.

    **[API END POINT](routes/user.js)** - http://localhost:5000/rest/register-user

    **Request Method** - POST

    **JSON BODY** - { "FirstName" : "fname", "LastName" : "lname", "UserName" : "user123", "Email" : "email@xyz.com", "Password" : "afso*ik3wemf$"  }

    All body inputs are mandatory

    **Response Success** - {"UserId" : "u1", "Message" : "User successfully registered",  "Status" : "Success"}

    **Response Error** - { "Guidance" : "Invalid Request. Check your inputs.", "Status" : "Error"} OR { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}

### Service 3 - Get User Information

    This API will return list of users with their information like firstname, lastname, email and username. List can be filtered with keywords, username or userId. If params are wrong it will return error with guidance.

    **[API END POINT](routes/user.js)** - http://localhost:5000/rest/user

    **Request Method** - GET

    **Headers** - { "Content-Type" : "application/json", "x-access-token" : "newjfi34uiewdj3i2e9in320ioewn2oasdfasdffadsfqafweefwa" }

    **Query Params** - UserName, UserId, Keywords

    all params are optional. supply empty string to avoid filter or do not provide that in input.

    **Response Success** - {"Users" : [ { "UserId": "u1", "FirstName": "fname",  "LastName": "lname", "UserName": "user123", "Email": "user@xyz.ca" "ValidFrom": "2019-05-30T15:45:38.343Z" } , {...} ],  "Status" : "Success"}

    **Response Error** - { "Guidance" : "Invalid Request. Check your inputs.", "Status" : "Error"} OR { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}

### Service 4 - Get Posts

    This API will return list of messages posted on wall. List could be filtered with SenderId, ReceiverId, TimeStamp, Keywords, PostId or Combination of those. If PostId provided no other params are required.

    **[API END POINT](routes/post.js)** - http://localhost:5000/rest/post

    **Request Method** - GET

    **Headers** - { "Content-Type" : "application/json", "x-access-token" : "newjfi34uiewdj3i2e9in320ioewn2oasdfasdffadsfqafweefwa" }

    **Query Params** - SenderId, ReceiverId, PostId, Keywords, Timestamp

    all params are optional. supply empty string to avoid filter or do not provide that in input.

    **Response Success** - {"Posts" : [ { "PostId": p1, "SenderId": u1, "ReceiverId": "u2", "PostHtml": "Hii", "TimeStamp": "2019-05-29T20:56:07.166Z" }, {...} ],  "Status" : "Success"}

    **Response Error** - { "Guidance" : "Invalid Request. Check your inputs.", "Status" : "Error"} OR { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}

### Service 5 - Create Post

    This API will accept new post for user. It will return PostId with success message or error with guidance.

    **[API END POINT](routes/post.js)** - http://localhost:5000/rest/post

    **Request Method** - PUT

    **Headers** - { "Content-Type" : "application/json", "x-access-token" : "newjfi34uiewdj3i2e9in320ioewn2oasdfasdffadsfqafweefwa" }

    **JSON BODY** - SenderId, ReceiverId, PostHtml

    all inputs in body are Mandatory.

    **Response Success** - {"PostId" : "p1",  "Status" : "Success"}

    **Response Error** - { "Guidance" : "Invalid Request.", "Status" : "Error"} OR { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}

### Service 6 - Delete Post

    This API will help to delete post from database. It will return deletedPostId and success message or error with guidance.

    **[API END POINT](routes/post.js)** - http://localhost:5000/rest/post

    **Request Method** - DELETE

    **Headers** - { "Content-Type" : "application/json", "x-access-token" : "newjfi34uiewdj3i2e9in320ioewn2oasdfasdffadsfqafweefwa" }

    **JSON BODY** - PostID

    all inputs in body are Mandatory.

    **Response Success** - {"DeletedPostId" : "p1",  "Status" : "Success"}

    **Response Error** - { "Guidance" : "Invalid Request.", "Status" : "Error"} OR { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}

### Service 7 - Update User

    This API will update user information like their Email, Password, FirstName, LastName, UserName. It will return update information with success message on successful update or error with guidance.

    **[API END POINT](routes/user.js)** - http://localhost:5000/rest/User

    **Request Method** - POST

    **Headers** - { "Content-Type" : "application/json", "x-access-token" : "newjfi34uiewdj3i2e9in320ioewn2oasdfasdffadsfqafweefwa" }

    **JSON BODY** - { "UserId": "u1", "FirstName": "fname",  "LastName": "lname", "UserName": "user123", "Email": "user@xyz.ca" "Password": "asfioewhf823we" }

    Minimum one input is required along with UserId to update.

    **Response Success** - { "UserId": "u1", "FirstName": "fname",  "LastName": "lname", "UserName": "user123", "Email": "user@xyz.ca" "ValidFrom": "2019-05-30T15:45:38.343Z",  "Status" : "Success"}

    **Response Error** - { "Guidance" : "Invalid Request.", "Status" : "Error"} OR { "Guidance" : "Access denied (A4483).", "Status" : "access-denied"}