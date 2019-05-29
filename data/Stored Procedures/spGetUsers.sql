/**
* Stored procedure to get users info
*/
USE bowspace;
IF OBJECT_ID('spGetUsers') IS NOT NULL
	DROP PROC spGetUsers
GO
CREATE PROC spGetUsers
	@UserId INT,
	@UserName VARCHAR(80),
	@Keywords VARCHAR(80)
AS 
	BEGIN TRY
		SET @Keywords = RTRIM(LTRIM(@Keywords));
		IF NOT @Keywords = '' 
			SET @Keywords = '%' + @Keywords + '%';
		IF @UserId = '' AND @UserName = '' AND @Keywords = ''
			SELECT UserId, FirstName, LastName, UserName, Email, ValidFrom FROM TUsers WHERE ValidTo IS NULL
		ELSE
			SELECT UserId, FirstName, LastName, UserName, Email, ValidFrom FROM TUsers
				WHERE ValidTo IS NULL AND (UserId = @UserId OR Username = @UserName OR FirstName LIKE @Keywords OR LastName LIKE @Keywords)
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
	END CATCH
GO

-- Test SP
EXEC spGetUsers '', '', '';
GO