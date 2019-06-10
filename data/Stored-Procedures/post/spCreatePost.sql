/**
* Stored procedure to create new post
*/
USE bowspace;
IF OBJECT_ID('spCreatePost') IS NOT NULL
	DROP PROC spCreatePost
GO
CREATE PROC spCreatePost
	@SenderId INT,
	@ReceiverId INT,
	@PostHtml VARCHAR(1000)
AS
	BEGIN TRY
		--sanitize input
		IF	@SenderId IS NULL OR @SenderId = '' OR @SenderId NOT IN (SELECT TUsers.UserId FROM TUsers WHERE ValidTo IS NULL)
			THROW 50001, 'Invalid Sender Id!', 1;
		IF	@ReceiverId IS NULL OR @ReceiverId = '' OR @ReceiverId NOT IN (SELECT TUsers.UserId FROM TUsers WHERE ValidTo IS NULL)
			THROW 50001, 'Invalid Reciever Id!', 1;
		-- get post id
		DECLARE @PostId INT;
		SELECT @PostId = NEXT VALUE FOR dbo.Sequence_PostId;
		-- update table
		INSERT INTO TPosts
			(PostId, SenderId, ReceiverId, PostHtml, TimeStamp)
			VALUES
			(@PostId, @SenderId, @ReceiverId, @PostHtml, GETUTCDATE())
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
	END CATCH
GO

-- test
EXEC spCreatePost '1001', '1002', 'New Post'
GO