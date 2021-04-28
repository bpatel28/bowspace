USE bowspace;

-- Drop tables if already in database
DROP TABLE IF EXISTS tblLike
GO
DROP TABLE IF EXISTS tblPost
GO
DROP TABLE IF EXISTS tblUser
GO

--User table
CREATE TABLE tblUser(
    fldUserId INT NOT NULL,
    fldFirstName VARCHAR(80) NOT NULL,
    fldMiddleName VARCHAR(80) NOT NULL,
    fldLastName VARCHAR(80) NOT NULL,
    fldUserName VARCHAR(80) NOT NULL,
    fldPassword VARBINARY(128) NOT NULL,
    fldEmail VARCHAR(80) NOT NULL,
    fldValidFrom DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    fldValidTo DATETIME2 DEFAULT NULL,
    fldIsAdmin INT DEFAULT 0,
    PRIMARY KEY (fldUserId, fldValidFrom),
    CONSTRAINT CK_fldIsAdmin_IsAdmin CHECK (fldIsAdmin = 0 OR fldIsAdmin = 1)
)
GO
DROP INDEX IF EXISTS tblUser.IX_tblUser_fldUserName
CREATE NONCLUSTERED INDEX IX_tblUser_fldUserName
    ON tblUser(fldUserName)
GO
DROP INDEX IF EXISTS tblUser.IX_tblUser_fldEmail
CREATE NONCLUSTERED INDEX IX_tblUser_fldEmail
    ON tblUser(fldEmail)
GO
DROP INDEX IF EXISTS tblUser.IX_tblUser_fldValidFrom
CREATE NONCLUSTERED INDEX IX_tblUser_fldValidFrom
    ON tblUser(fldValidFrom)
GO

-- Post Table
CREATE TABLE tblPost(
    fldPostId INT NOT NULL 
        CONSTRAINT PK_tblPost PRIMARY KEY,
    fldSenderId INT NOT NULL,
    fldReceiverId INT NOT NULL,
    fldPostHtml NVARCHAR(1000) NOT NULL,
    fldTimestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE()
)
DROP INDEX IF EXISTS tblPost.IX_tblPost_fldSenderId
CREATE NONCLUSTERED INDEX IX_tblPost_fldSenderId
    ON tblPost(fldSenderId)
GO
DROP INDEX IF EXISTS tblPost.IX_tblPost_fldReceiverId
CREATE NONCLUSTERED INDEX IX_tblPost_fldReceiverId
    ON tblPost(fldReceiverId)
GO

-- Like Table
CREATE TABLE tblLike(
    fldUserId INT NOT NULL,
    fldPostId INT 
        CONSTRAINT FK_tblLike_To_tblPost REFERENCES tblPost(fldPostId)
    PRIMARY KEY (fldUserId, fldPostId)
)
GO

DROP SEQUENCE IF EXISTS dbo.Sequence_UserId
GO
CREATE SEQUENCE dbo.Sequence_UserId
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    CYCLE;
GO

DROP SEQUENCE IF EXISTS dbo.Sequence_PostId
GO
CREATE SEQUENCE dbo.Sequence_PostId
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    CYCLE;
GO

DECLARE @UserId INT;
    SELECT @UserId = NEXT VALUE FOR dbo.Sequence_UserId;
