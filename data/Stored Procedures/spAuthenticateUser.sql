/*
* Stored Procedure to allow user login
* Returns true or false (1 or 0)
*/
USE bowspace;
IF OBJECT_ID('spAuthenticateUser') IS NOT NULL
	DROP PROC spAuthenticateUser
GO
CREATE PROC spAuthenticateUser
	@Username VARCHAR(80),
	@Email VARCHAR(80),
	@Password VARCHAR(80)
AS
	BEGIN TRY

		DECLARE @UserId INT = NULL;
		PRINT @UserId;
		-- if valid user make variable value 1
		IF @Username IN (SELECT TUsers.UserName FROM TUsers WHERE TUsers.ValidTo IS NULL AND TUsers.UserName = @Username AND PWDCOMPARE(@Password, TUsers.Password) = 1)
			SET @UserId = (SELECT TUsers.UserId FROM TUsers WHERE TUsers.ValidTo IS NULL AND TUsers.UserName = @Username AND PWDCOMPARE(@Password, TUsers.Password) = 1);
		
		IF @UserId IS NULL AND @Email IN (SELECT TUsers.Email FROM TUsers WHERE TUsers.ValidTo IS NULL AND TUsers.Email = @Email AND PWDCOMPARE(@Password, TUsers.Password) = 1)
			SET @UserId = (SELECT TUsers.UserId FROM TUsers WHERE TUsers.ValidTo IS NULL AND TUsers.Email = @Email AND PWDCOMPARE(@Password, TUsers.Password) = 1);
		
		IF @UserId IS NOT NULL
			SELECT TUsers.UserId, TUsers.FirstName, TUsers.LastName, TUsers.UserName, TUsers.Email, 'Success' AS Status FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL
		ELSE 
			SELECT 'Failure' AS Status, @UserId AS UserId
		
	END TRY
	BEGIN CATCH
		SELECT 'Failure' AS Status, @UserId AS UserId
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
		SELECT 'Failure' AS Status
	END CATCH
GO

--test 
EXEC spAuthenticateUser 'b.patel405', '', '1234';

select * from TUsers

