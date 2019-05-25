/*
* Stored Procedure to allow user login
* Returns true or false (1 or 0)
*/
USE bowspace;
IF OBJECT_ID('spUserLogin') IS NOT NULL
	DROP PROC spUserLogin
GO
CREATE PROC spUserLogin
	@Username VARCHAR(80),
	@Password VARCHAR(80),
	@ValidUser INT OUTPUT
AS
	BEGIN TRY

		-- input validation
		IF @Username IS NULL OR @Password IS NULL
			THROW 50001, 'Username or password cannot be null', 1;
		SET @ValidUser = 0;

		-- if valid user make variable value 1
		IF @Username IN (SELECT TUsers.UserName FROM TUsers WHERE TUsers.ValidTo IS NULL AND TUsers.UserName = @Username AND PWDCOMPARE(@Password, TUsers.Password) = 1)
			SET @ValidUser = 1;
		
		--return result
		RETURN @ValidUser;
		
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
	END CATCH
GO

--test 
DECLARE	@ValidUser INT
EXEC spUserLogin 'b.patel405', '1234', @ValidUser OUTPUT;
SELECT @ValidUser AS Result

