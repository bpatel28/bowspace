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
			IF @UserId IS NULL
				THROW 50001, 'UserId can not be null!', 1;
			IF @UserId NOT IN (SELECT TUsers.UserId FROM TUsers WHERE TUsers.ValidTo IS NULL OR TUsers.ValidTo > GETDATE())
				THROW 50001, 'UserId not valid!', 1;
			IF @Username IS NULL AND @Email IS NULL AND @Password IS NULL AND @FirstName IS NULL AND @LastName IS NULL
				THROW 50001, 'No information provided to update!', 1;
			
			--getting old data to copy if no changes are needed for that
			IF @FirstName IS NULL
				SET @FirstName = (SELECT TUsers.FirstName FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			IF @LastName IS NULL
				SET @LastName = (SELECT TUsers.LastName FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			IF @Username IS NULL
				SET @Username = (SELECT TUsers.Username FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			IF @Email IS NULL
				SET @Email = (SELECT TUsers.Email FROM TUsers WHERE TUsers.UserId = @UserId AND TUsers.ValidTo IS NULL);
			DECLARE @Pwd VARBINARY(128);
			IF @Password IS NULL
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

		COMMIT TRAN
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
		ROLLBACK TRAN;
	END CATCH
GO

-- test update user info store procedure
EXEC spUpdateUserInfo 1001, NULL, NULL, 'h.do123', 'h.do12@mybvc.ca' ,'12345'
EXEC spUpdateUserInfo 1002, NULL, NULL, 's.agha', NULL, NULL
SELECT * FROM TUsers
GO