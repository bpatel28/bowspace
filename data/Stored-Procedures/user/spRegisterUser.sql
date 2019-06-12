/*
* stored procedure to register user account
*/
USE bowspace;
IF OBJECT_ID('spRegisterUser') IS NOT NULL
	DROP PROC spRegisterUser
GO
CREATE PROC spRegisterUser
	@FirstName VARCHAR(80),
	@LastName VARCHAR(80),
	@UserName VARCHAR(80),
	@Email VARCHAR(80),
	@Password VARCHAR(80)
AS 
	BEGIN TRY

		-- check for empty inputs
		IF @FirstName IS NULL OR @FirstName = ''OR @LastName IS NULL OR @LastName = ''
			OR @Email IS NULL OR @Email = '' OR @UserName IS NULL OR @UserName = '' OR
			@Password IS NULL OR @Password = ''
			THROW 50001, 'Empty Input not allowed', 1;

		-- Check if email and username already registered
		IF @Email IN (SELECT Email FROM TUsers WHERE Email = @Email)
			THROW 50001, 'An account with this email is already registered', 1;
		IF @UserName IN (SELECT UserName FROM TUsers WHERE UserName = @UserName)
			THROW 50001, 'Username is already registered', 1;

		-- insert user details in TUsers
		DECLARE @UserId INT;
		SELECT @UserId = NEXT VALUE FOR dbo.Sequence_UserId;
		INSERT INTO TUsers(UserId, FirstName, LastName, UserName, Password, Email)
			VALUES(@UserId, @FirstName, @LastName, @UserName, PWDENCRYPT(@Password), @Email)
		SELECT @UserId AS UserId,'Success' AS Status;
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
		SELECT CONVERT(VARCHAR(80), ERROR_MESSAGE()) AS Guidance, 'Error' AS Status;
	END CATCH
GO

-- Test register user store procedure
EXEC spRegisterUser 'Brijesh', 'Patel', 'b.patel405', 'b.patel405@mybvc.ca', '1234';
EXEC spRegisterUser 'Hai', 'Do', 'h.do12', 'h.do12@mybvc.ca', '1234';
EXEC spRegisterUser 'Saad', 'Agha', 's.agha56','s.agha@mybvc.ca', '1234';
