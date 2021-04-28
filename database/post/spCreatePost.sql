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
		IF	@SenderId IS NULL OR @SenderId = '' 
			THROW 50001, 'Invalid Sender Id!', 1;
		IF	@ReceiverId IS NULL OR @ReceiverId = '' 
			THROW 50001, 'Invalid Reciever Id!', 1;

        DECLARE @UserCounts INT;
        SET @UserCounts = (SELECT Count(fldUserId) FROM tblUser WHERE fldValidTo IS NULL AND (fldUserId = @ReceiverId OR fldUserId = @SenderId))
        IF @UserCounts < 1
            THROW 50001, 'Invalid Sender Id or Receiver Id.', 1;

        -- get post id
		DECLARE @PostId INT;
		SET @PostId = NEXT VALUE FOR dbo.Sequence_PostId;
		-- update table
		INSERT INTO tblPost
			(fldPostId, fldSenderId, fldReceiverId, fldPostHtml, fldTimeStamp)
			VALUES
			(@PostId, @SenderId, @ReceiverId, @PostHtml, GETUTCDATE())
            
		SELECT fldPostId AS 'PostId', fldSenderId AS 'SenderId', fldReceiverId AS 'ReceiverId', fldPostHtml AS 'PostHtml', fldTimestamp AS 'Timestamp', 'Success' AS 'Status'
            FROM tblPost WHERE fldPostId = @PostId
	END TRY
	BEGIN CATCH
		SELECT 'Error' AS Status;
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
	END CATCH
GO

-- test
EXEC spCreatePost '1001', '1002', 'Hello Post';
GO