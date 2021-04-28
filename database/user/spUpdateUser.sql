USE bowspace;
IF OBJECT_ID('spUpdateUser') IS NOT NULL
    DROP PROC spUpdateUser
GO
CREATE PROC spUpdateUser
    @UserId INT,
    @FirstName VARCHAR(80),
    @LastName VARCHAR(80),
    @MiddleName VARCHAR(80),
    @Email VARCHAR(80),
    @UserName VARCHAR(80),    
    @Password VARCHAR(80)
AS
    BEGIN TRY
        BEGIN TRAN
            -- Validation
            IF @UserId IS NULL OR @UserId = '' OR @UserId NOT IN (SELECT fldUserId FROM tblUser WHERE fldValidTo IS NULL AND fldIsAdmin = 0)
                THROW 50001, 'Invalid UserID.', 1

            DECLARE @MyFirstName VARCHAR(80), @MyLastName VARCHAR(80), @MyMiddleName VARCHAR(80), @MyEmail VARCHAR(80), 
                @MyUserName VARCHAR(80), @MyPassword VARBINARY(128), @MyValidFrom DATETIME2, @MyValidTo DATETIME2

            -- Collect current information for given User ID.
            SELECT @MyFirstName = fldFirstName, @MyLastName = fldLastName, @MyMiddleName = fldMiddleName, @MyEmail = fldEmail, 
                @MyUserName = fldUserName, @MyPassword = fldPassword, @MyValidFrom = fldValidFrom, @MyValidTo = fldValidTo 
                FROM tblUser WHERE fldUserId = @UserId AND fldIsAdmin = 0
            
            -- Check if update needed or not.
            IF (@FirstName = @MyFirstName OR @FirstName = '' OR @FirstName IS NULL) AND
					(@LastName = @MyLastName OR @LastName = '' OR @LastName IS NULL) AND
					(@MiddleName = @MyMiddleName OR @MiddleName = '' OR @MiddleName IS NULL) AND
					(@Email = @MyEmail OR @Email = '' OR @Email IS NULL) AND
					(@UserName = @MyUserName OR @Username = '' OR @Username IS NULL) AND
					(PWDCOMPARE(@Password, @MyPassword) = 1 OR @Password = '' OR @Password IS NULL)
				THROW 50001, 'No information provided to update!', 1;
            
            -- Get old data to copy if no changes are needed for that
			IF @FirstName IS NULL OR @FirstName  = ''
				SET @FirstName = @MyFirstName;
			IF @LastName IS NULL OR @LastName  = ''
				SET @LastName = @MyLastName;
            IF @MiddleName IS NULL OR @MiddleName  = ''
				SET @MiddleName = @MyMiddleName;
			IF @Username IS NULL OR @Username  = ''
				SET @Username = @MyUserName;
			IF @Email IS NULL OR @Email  = ''
				SET @Email = @MyEmail;

            -- create var binary password to store.
			DECLARE @Pwd VARBINARY(128);
			IF @Password IS NULL OR @Password  = ''
				SET @Pwd = @MyPassword;
			ELSE 
				SET @Pwd = PWDENCRYPT(@Password);     

            -- setting expiry for last user data
			UPDATE tblUser
				SET fldValidTo = GETUTCDATE()
				WHERE fldUserId = @UserId AND fldValidTo IS NULL;

            -- inserting new user info
			INSERT INTO tblUser
				(fldUserId, fldFirstName, fldLastName, fldMiddleName, fldEmail, fldUserName, fldPassword, fldValidFrom)
				VALUES
				(@UserId, @FirstName, @LastName, @MiddleName, @Email, @Username, @Pwd, GETUTCDATE())

			--show updated info
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
				FROM tblUser WHERE fldUserId = @UserId AND fldValidTo IS NULL;

        COMMIT TRAN
    END TRY
    BEGIN CATCH
        PRINT 'ERROR!'
        PRINT 'ERROR NUMBER: ' + CONVERT(VARCHAR, ERROR_NUMBER());
        PRINT 'Error Message: ' + CONVERT(VARCHAR(MAX), ERROR_MESSAGE());
        SELECT 'Error' AS 'Status', CONVERT(VARCHAR(MAX), ERROR_MESSAGE()) AS 'Guidance';
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN
    END CATCH
GO

-- test update user info store procedure
EXEC spUpdateUser 1002, NULL, NULL, NULL,'h.do123@mybvc.ca', 'h.do12' ,'12345'
EXEC spUpdateUser 1003, NULL, NULL, NULL,'s.agha@gmail.com', NULL, NULL
--GO

