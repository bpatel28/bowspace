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
		IF @UserId IS NULL OR @UserName IS NULL OR @Keywords IS NULL
			THROW 50001, 'Params can not be null!', 1;
		SET @Keywords = RTRIM(LTRIM(@Keywords));
		IF NOT @Keywords = '' 
			SET @Keywords = '%' + @Keywords + '%';
		IF @UserId = '' AND @UserName = '' AND @Keywords = ''
			SELECT UserId, FirstName, LastName, UserName, Email, ValidFrom FROM TUsers WHERE ValidTo IS NULL
		-- if userid and username both provided both has to be correct
		ELSE IF @UserId <> '' AND @UserName <> ''
			SELECT UserId, FirstName, LastName, UserName, Email, ValidFrom FROM TUsers
				WHERE ValidTo IS NULL AND UserId = @UserId AND UserName = @UserName
		ElSE
			SELECT UserId, FirstName, LastName, UserName, Email, ValidFrom FROM TUsers
				WHERE ValidTo IS NULL AND (UserId = @UserId OR Username = @UserName OR FirstName LIKE @Keywords OR LastName LIKE @Keywords);
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