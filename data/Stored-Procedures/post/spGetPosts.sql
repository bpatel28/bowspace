/**
* Stored procedure to get post from database
*/

USE bowspace;
IF OBJECT_ID('spGetPosts') IS NOT NULL
	DROP PROC spGetPosts
GO
CREATE PROC spGetPosts
	@PostId INT,
	@SenderId INT,
	@ReceiverId INT,
	@Keywords VARCHAR(1000),
	@Timestamp DATETIME2
AS
	BEGIN TRY
		IF @Keywords <> ''
			SET @Keywords = '%' + @Keywords + '%';
		-- no null values allowed
		IF @PostId IS NULL OR @SenderId IS NULL OR @ReceiverId IS NULL OR @Keywords IS NULL OR @Timestamp IS NULL
			THROW 50001, 'param can not be null!', 1;

		-- DECLARE Temp talbe
		CREATE TABLE #TempResult (
			PostId INT,
			SenderId INT,
			ReceiverId INT,
			PostHtml VARCHAR(1000),
			TimeStamp DATETIME2
		)
		
		--filter with postid or senderid and receiverid or senderid or receiverid
		IF @PostId <> '' 
			BEGIN 
				--only post id allowed as input param
				IF @SenderId <> '' OR @ReceiverId <> '' OR @Keywords <> '' OR @Timestamp <> ''
					THROW 50001, 'Invalid prams! no extra pram with post id', 1;
				SELECT PostId, ReceiverId, SenderId, PostHtml, TimeStamp FROM TPosts WHERE PostId = @PostId
			END
		ELSE IF @SenderId <> '' AND @ReceiverId <> ''
			INSERT INTO #TempResult SELECT PostId, SenderId, ReceiverId, PostHtml, TimeStamp FROM TPosts WHERE SenderId = @SenderId AND ReceiverId = @ReceiverId
		ELSE IF @SenderId <> '' 
			BEGIN
			INSERT INTO #TempResult SELECT PostId, SenderId, ReceiverId, PostHtml, TimeStamp FROM TPosts WHERE SenderId = @SenderId
			END
		ELSE IF @ReceiverId <> '' 
			INSERT INTO #TempResult SELECT PostId, SenderId, ReceiverId, PostHtml, TimeStamp FROM TPosts WHERE ReceiverId = @ReceiverId
		ELSE 
			INSERT INTO #TempResult SELECT PostId, SenderId, ReceiverId, PostHtml, TimeStamp FROM TPosts

		--filter keywords and timestamp
		IF @Keywords <> ''
			DELETE FROM #TempResult WHERE PostHtml NOT LIKE @Keywords
		IF @Timestamp <> ''
			DELETE FROM #TempResult WHERE NOT TimeStamp = @Timestamp
		-- show final result
		SELECT PostId, SenderId, ReceiverId, PostHtml, TimeStamp FROM #TempResult
	END TRY
	BEGIN CATCH
		PRINT 'Error!';
		PRINT 'Error Number: ' + CONVERT(VARCHAR, ERROR_NUMBER());
		PRINT 'Error Message: ' + CONVERT(VARCHAR, ERROR_MESSAGE());
	END CATCH
GO

EXEC spGetPosts '', '', '1002', '', ''
GO