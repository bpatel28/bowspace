USE bowspace;

--Drop Tables if already in database 
DROP TABLE IF EXISTS TLikes
GO
DROP TABLE IF EXISTS TPosts
GO
DROP TABLE IF EXISTS TUsers
GO

-- Users Table
CREATE TABLE TUsers (
	UserId INT NOT NULL,
	FirstName VARCHAR(80) NOT NULL,
	LastName VARCHAR(80) NOT NULL,
	UserName VARCHAR(80) NOT NULL,
	Password VARBINARY(128) NOT NULL,
	Email VARCHAR(80) NOT NULL,
	ValidFrom DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
	ValidTo DATETIME2 DEFAULT NULL,	
	PRIMARY KEY (UserId, ValidFrom)
)
GO
DROP INDEX IF EXISTS TUsers.IX_TUsers_Username
CREATE INDEX IX_TUsers_Username
	ON TUsers(Username)
GO
DROP INDEX IF EXISTS TUsers.IX_TUsers_Email
CREATE INDEX IX_TUsers_Email
	ON TUsers(Email)
GO
DROP INDEX IF EXISTS TUsers.IX_TUsers_ValidFrom
CREATE INDEX IX_TUsers_ValidFrom
	ON TUsers(ValidFrom)
GO

-- Posts Table
CREATE TABLE TPosts (
	PostId INT NOT NULL PRIMARY KEY,
	SenderId INT NOT NULL,
	ReceiverId INT NOT NULL,
	PostHtml VARCHAR(1000) NOT NULL,
	TimeStamp DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP
)
GO
DROP INDEX IF EXISTS TPosts.IX_TPosts_SenderId
CREATE INDEX IX_TPosts_SenderId
	ON TPosts(SenderId)
GO
DROP INDEX IF EXISTS TPosts.IX_TPosts_ReceiverId
CREATE INDEX IX_TPosts_ReceiverId
	ON TPosts(ReceiverId)
GO

-- Likes Table
CREATE TABLE TLikes (
	UserId INT NOT NULL,
	PostId INT FOREIGN KEY REFERENCES TPosts(PostId),
	PRIMARY KEY (UserId, PostId)
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
