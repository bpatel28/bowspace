USE bowspace;
IF OBJECT_ID('spDeletePost') IS NOT NULL
	DROP PROC spDeletePost
GO
CREATE PROC spDeletePost
	@PostId INT
AS
	BEGIN TRY
		IF @PostId IS NULL OR @PostId = '' OR @PostId NOT IN (SELECT fldPostId FROM tblPost)
			THROW 50001, 'Invalid PostId.', 1;
		DELETE FROM tblPost
			WHERE fldPostId = @PostId;
		SELECT @PostId AS PostId, 'Success' As 'Status';
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR(MAX), ERROR_MESSAGE());
        SELECT 'Error' AS 'Status', CONVERT(VARCHAR(MAX), ERROR_MESSAGE()) AS 'Guidance';
	END CATCH
GO

EXEC spDeletePost '1000'