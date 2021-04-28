# Bowspace database

## Database Requirement

- `MS SQL Server`
- `database name: bowspace`

## Scripts

**Please run it in following sequence**

- [create-tables.sql](create-tables.sql)- Script to create tables
- [spRegisterUser.sql](Stored-Procedures/user/spRegisterUser.sql) - Stored Procedure to register new account
- [spUpdateUserInfo.sql](Stored-Procedures/user/spUpdateUserInfo.sql) - Stored Procedure to update user information
- [spAuthenticateUser.sql](Stored-Procedures/user/spAuthenticateUser.sql) - Stored Procedure to authenticate user
- [spGetUsers.sql](Stored-Procedures/user/spGetUsers.sql) - Stored Procedure to get list of users with their information
- [spCreatePost.sql](Stored-Procedures/post/spCreatePost.sql) - Stored Procedure to create new post
- [spDeletePost.sql](Stored-Procedures/post/spDeletePost.sql) - Stored Procedure to delete a post
- [spGetPosts.sql](Stored-Procedures/post/spGetPosts.sql) - Stored Procedure to get post from database
