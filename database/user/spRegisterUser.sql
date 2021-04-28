USE bowspace;
IF OBJECT_ID('spRegisterUser') IS NOT NULL
    DROP PROC spRegisterUser
GO
CREATE PROC spRegisterUser
    @FirstName VARCHAR(80),
    @LastName VARCHAR(80),
    @MiddleName VARCHAR(80),
    @UserName VARCHAR(80),
    @Email VARCHAR(80),
    @Password VARCHAR(80)
As
    BEGIN TRY
        -- Check for empty inputs
        IF @FirstName IS NULL OR @FirstName = '' OR @LastName IS NULL OR @LastName = ''
            OR @Email IS NULL OR @Email = '' OR @UserName IS NULL OR @UserName = ''
            OR @Password IS NULL OR @Password = '' OR @MiddleName IS NULL
            THROW 50001, 'Empty input is not allowed.', 1;
        
        -- Check if email and username already registered.
        IF @Email IN (SELECT fldEmail FROM tblUser WHERE fldEmail = @Email)
            THROW 50001, 'An account with this email is already registered', 1;
        IF @UserName IN (SELECT fldUserName FROM tblUser WHERE fldUserName = @UserName)
            THROW 50001, 'Username is already registered.', 1;
        
        -- Insert user details in tblUser
        DECLARE @UserId INT;
        SELECT @UserId = NEXT VALUE FOR dbo.Sequence_UserId;
        INSERT INTO tblUser(fldUserId, fldFirstName, fldLastName, fldMiddleName, fldUserName, fldPassword, fldEmail)
            VALUES(@UserId, @FirstName, @LastName, @MiddleName, @UserName, PWDENCRYPT(@Password), @Email)

        -- Return User with and success message
        SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
            FROM tblUser
            WHERE fldUserId = @UserId
    END TRY
    BEGIN CATCH
        PRINT 'ERROR!'
        PRINT 'ERROR NUMBER: ' + CONVERT(VARCHAR, ERROR_NUMBER());
        PRINT 'Error Message: ' + CONVERT(VARCHAR(MAX), ERROR_MESSAGE());
        SELECT 'Error' AS 'Status', CONVERT(VARCHAR(MAX), ERROR_MESSAGE()) AS 'Guidance';
    End CATCH
GO

-- TEST REGISTER USER
EXEC spRegisterUser 'Brijesh', 'Patel', '','b.patel405', 'b.patel405@mybvc.ca', '1234';
EXEC spRegisterUser 'Hai', 'Do', '','h.do12', 'h.do12@mybvc.ca', '1234';
EXEC spRegisterUser 'Saad', 'Agha', '','s.agha56','s.agha@mybvc.ca', '1234';