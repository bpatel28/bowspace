/**
* Stored procedure to delete post
*/
USE bowspace;
IF OBJECT_ID('spDeletePost') IS NOT NULL
	DROP PROC spDeletePost
GO
CREATE PROC spDeletePost
	@PostId INT
AS
	BEGIN TRY
		IF @PostId IS NULL OR @PostId = '' OR @PostId NOT IN (SELECT PostId FROM TPosts)
			THROW 50001, 'Invalid PostId', 1;
		DELETE FROM TPosts
			WHERE PostId = @PostId;
		SELECT @PostId AS PostId;
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
	END CATCH
GO

EXEC spDeletePost '1000'