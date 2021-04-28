USE bowspace;
IF OBJECT_ID('spAuthenticateUser') IS NOT NULL
    DROP PROC spAuthenticateUser
GO
CREATE PROC spAuthenticateUser
	@Email VARCHAR(80),
    @UserName VARCHAR(80),
    @Password VARCHAR(80)
AS
    BEGIN TRY
        DECLARE  @UserId INT = NULL;
        
        -- validate input
		IF (@UserName IS NULL AND @Email IS NULL) OR (@UserName = '' AND @Email = '')
			THROW 50001, 'Please provide username or email.', 1
		IF @Password IS NULL OR @Password = ''
			THROW 50001, 'Invalid Password.', 1

		-- If both username and  email provided. both need to match with account.
		IF @Email <> '' AND @UserName <> ''		
			SET @UserId = (SELECT TOP 1 fldUserId FROM tblUser WHERE fldValidTo IS NULL AND fldUserName = @UserName AND fldEmail = @Email AND (PWDCOMPARE(@Password, fldPassword) = 1))
		ELSE
			SET @UserId = (SELECT TOP 1 fldUserId FROM tblUser WHERE fldValidTo IS NULL AND (fldUserName = @UserName OR fldEmail = @Email) AND (PWDCOMPARE(@Password, fldPassword) = 1))
		
        -- results
        IF @UserId IS NOT NULL
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
                FROM tblUser
                WHERE fldUserId = @UserId AND fldValidTo IS NULL
        ELSE
            SELECT 'Failure' AS Status, 'Can''t find user!' AS 'Guidance';
    END TRY
    BEGIN CATCH
        PRINT 'ERROR!'
        PRINT 'ERROR NUMBER: ' + CONVERT(VARCHAR, ERROR_NUMBER());
        PRINT 'Error Message: ' + CONVERT(VARCHAR(MAX), ERROR_MESSAGE());
        SELECT 'Error' AS 'Status', CONVERT(VARCHAR(MAX), ERROR_MESSAGE()) AS 'Guidance';
    END CATCH
GO

--test 
EXEC spAuthenticateUser 'b.patel405@mybvc.ca', 'b.patel405', '1234';
GO