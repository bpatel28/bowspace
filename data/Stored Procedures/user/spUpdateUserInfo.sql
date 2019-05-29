/*
* Stored Procedure to Update User information
*/
USE bowspace;
IF OBJECT_ID('spUpdateUserInfo') IS NOT NULL
	DROP PROC spUpdateUserInfo
GO
CREATE PROC spUpdateUserInfo
	@UserId INT,
	@FirstName VARCHAR(80),
	@LastName VARCHAR(80),
	@Username VARCHAR(80),
	@Email VARCHAR(80),
	@Password VARCHAR(40)
AS
	BEGIN TRY
		BEGIN TRAN

			--validation
			IF @UserId IS NULL OR @UserId = ''
				THROW 50001, 'UserId can not be null!', 1;
			IF @UserId NOT IN (SELECT TUsers.UserId FROM TUsers WHERE TUsers.ValidTo IS NULL OR TUsers.ValidTo > GETDATE())
				THROW 50001, 'UserId not valid!', 1;
			IF ((@FirstName IN (SELECT FirstName FROM TUsers WHERE UserId = @UserId AND ValidTo IS NULL)) OR @FirstName = '' OR @FirstName IS NULL) AND
					((@LastName IN (SELECT LastName FROM TUsers WHERE UserId = @UserId AND ValidTo IS NULL)) OR @LastName = '' OR @LastName IS NULL) AND
					((@Email IN (SELECT Email FROM TUsers WHERE UserId = @UserId AND ValidTo IS NULL)) OR @Email = '' OR @Email IS NULL) AND
					((@UserName IN (SELECT UserName FROM TUsers WHERE UserId = @UserId AND ValidTo IS NULL)) OR @Username = '' OR @Username IS NULL) AND
					(((SELECT PWDCOMPARE(@Password, Password) FROM TUsers WHERE UserId = @UserId AND ValidTo IS NULL) = 1) OR @Password = '' OR @Password IS NULL)
				THROW 50001, 'No information provided to update!', 1;
			
			--getting old data to copy if no changes are needed for that
			IF @FirstName IS NULL OR @FirstName  = ''
				SET @FirstName = (SELECT TUsers.FirstName FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			IF @LastName IS NULL OR @LastName  = ''
				SET @LastName = (SELECT TUsers.LastName FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			IF @Username IS NULL OR @Username  = ''
				SET @Username = (SELECT TUsers.Username FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			IF @Email IS NULL OR @Email  = ''
				SET @Email = (SELECT TUsers.Email FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			DECLARE @Pwd VARBINARY(128);
			IF @Password IS NULL OR @Password  = ''
				SET @Pwd = (SELECT TUsers.Password FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			ELSE 
				SET @Pwd = PWDENCRYPT(@Password);

			-- setting expiry for last user data
			UPDATE TUsers
				SET TUsers.ValidTo = GETUTCDATE()
				WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL;

			-- inserting new user info
			INSERT INTO TUsers
				(UserId, FirstName, LastName, Username, Email, Password, ValidFrom)
				VALUES
				(@UserId, @FirstName, @LastName, @Username, @Email, @Pwd, GETUTCDATE())	

			--show updated info
			SELECT UserId, FirstName, LastName, Username, Email, ValidFrom, 'Success' AS Status FROM TUsers
				WHERE UserId = @UserId AND ValidTo IS NULL;

		COMMIT TRAN
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
		SELECT 'Error' AS Status, CONVERT(VARCHAR(80), ERROR_MESSAGE()) AS Guidance;
		ROLLBACK TRAN;
	END CATCH
GO

-- test update user info store procedure
EXEC spUpdateUserInfo 1001, NULL, NULL, 'h.do123', 'h.do12@mybvc.ca' ,'12345'
EXEC spUpdateUserInfo 1002, NULL, NULL, 's.agha', NULL, NULL
SELECT * FROM TUsers
GO