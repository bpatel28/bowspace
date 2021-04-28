USE bowspace;
If OBJECT_ID('spGetUsers') IS NOT NULL
    DROP PROC spGetUsers
GO
CREATE PROC spGetUsers
    @UserId INT,
	@Email VARCHAR(80),
    @UserName VARCHAR(80),
    @Keywords VARCHAR(80)
As
    BEGIN TRY
        -- Input Validation.
        IF @UserId IS NULL OR @Email IS NULL OR @UserName IS NULL OR @Keywords IS NULL
            THROW 50001, 'Params can not be null.', 1;
        SET @Keywords = RTRIM(LTRIM(@Keywords))
        IF NOT @Keywords = ''
            SET @Keywords = '%' + @Keywords + '%';
        
        -- Return all users if no filters.
        IF @UserId = '' AND @Email = '' AND @UserName = '' AND @Keywords = ''
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
                FROM tblUser 
                WHERE fldValidTo IS NULL;

		-- If UserId, Email and UserName provided, all need to be correct
        ELSE IF @UserId <> '' AND @Email <> '' AND @UserName <> ''
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
                FROM tblUser
                WHERE fldValidTo IS NULL AND fldUserId = @UserId AND fldEmail = @Email AND  fldUserName = @UserName;

		-- If UserId and Email provided, both has to be correct
        ELSE IF @UserId <> '' AND @Email <> ''
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
                FROM tblUser
                WHERE fldValidTo IS NULL AND fldUserId = @UserId AND fldEmail = @Email;

        -- If UserId and username provided, both has to be correct
        ELSE IF @UserId <> '' AND @UserName <> ''
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
                FROM tblUser
                WHERE fldValidTo IS NULL AND fldUserId = @UserId AND fldUserName = @UserName;
        
        -- search with all filters
        ELSE
            SELECT fldUserId AS 'UserId', fldFirstName AS 'FirstName', fldLastName AS 'LastName', fldMiddleName AS 'MiddleName', fldEmail AS 'Email', fldUserName AS 'UserName', fldValidFrom As 'ValidFrom', 'Success' AS 'Status'
                FROM tblUser
                WHERE fldValidTo IS NULL AND (fldUserId = @UserId OR fldEmail = @Email OR fldUserName = @UserName OR fldFirstName LIKE @Keywords OR fldLastName LIKE @Keywords);

    END TRY
    BEGIN CATCH
        PRINT 'ERROR!'
        PRINT 'ERROR NUMBER: ' + CONVERT(VARCHAR, ERROR_NUMBER());
        PRINT 'Error Message: ' + CONVERT(VARCHAR(MAX), ERROR_MESSAGE());
        SELECT 'Error' AS 'Status', CONVERT(VARCHAR(MAX), ERROR_MESSAGE()) AS 'Guidance';
    END CATCH
GO


-- Test SP
EXEC spGetUsers '', '', '', '';
GO