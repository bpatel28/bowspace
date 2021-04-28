USE bowspace;
IF OBJECT_ID('spGetPosts') IS NOT NULL
	DROP PROC spGetPosts
GO
CREATE PROC spGetPosts
	@PostId INT,
	@SenderId INT,
	@ReceiverId INT,
	@Keywords NVARCHAR(1000),
	@Timestamp VARCHAR(126)
AS
	BEGIN TRY
		IF @Keywords <> ''
			SET @Keywords = '%' + @Keywords + '%';
		-- no null values allowed
		IF @PostId IS NULL OR @SenderId IS NULL OR @ReceiverId IS NULL OR @Keywords IS NULL OR @Timestamp IS NULL
			THROW 50001, 'Param can not be null.', 1;

		-- DECLARE Temp tabl.
		CREATE TABLE #TempResult (
			fldPostId INT,
			fldSenderId INT,
			fldReceiverId INT,
			fldPostHtml VARCHAR(1000),
			fldTimestamp DATETIME2
		)
		
		--filter with postid or senderid and receiverid or senderid or receiverid
		IF @PostId <> '' 
			BEGIN 
				--only post id allowed as input param
				IF @SenderId <> '' OR @ReceiverId <> '' OR @Keywords <> '' OR @Timestamp <> ''
					THROW 50001, 'Invalid prams! no extra pram with post id.', 1;
				INSERT INTO #TempResult SELECT fldPostId, fldSenderId, fldReceiverId, fldPostHtml, fldTimestamp FROM tblPost WHERE fldPostId = @PostId
			END
		ELSE IF @SenderId <> '' AND @ReceiverId <> ''
			INSERT INTO #TempResult SELECT fldPostId, fldSenderId, fldReceiverId, fldPostHtml, fldTimestamp FROM tblPost WHERE fldSenderId = @SenderId AND fldReceiverId = @ReceiverId
		ELSE IF @SenderId <> '' 
			INSERT INTO #TempResult SELECT fldPostId, fldSenderId, fldReceiverId, fldPostHtml, fldTimestamp FROM tblPost WHERE fldSenderId = @SenderId
		ELSE IF @ReceiverId <> '' 
			INSERT INTO #TempResult SELECT fldPostId, fldSenderId, fldReceiverId, fldPostHtml, fldTimestamp FROM tblPost WHERE fldReceiverId = @ReceiverId
		ELSE 
			INSERT INTO #TempResult SELECT fldPostId, fldSenderId, fldReceiverId, fldPostHtml, fldTimestamp FROM tblPost

		--filter keywords and timestamp from temp table.
		IF @Keywords <> ''
			DELETE FROM #TempResult WHERE fldPostHtml NOT LIKE @Keywords
		IF @Timestamp <> ''
			DELETE FROM #TempResult WHERE CONVERT(DATE, fldTimestamp) <> CONVERT(DATE, @Timestamp)

		-- show final result from temp table.
		IF (SELECT COUNT(*) FROM #TempResult) > 0 
			SELECT fldPostId AS 'PostId', fldSenderId AS 'SenderId', fldReceiverId AS 'ReceiverId', fldPostHtml AS 'PostHtml', fldTimestamp AS 'Timestamp', 'Success' AS 'Status' 
            	FROM #TempResult
		ELSE
			SELECT 'Success' AS Status
	END TRY
	BEGIN CATCH
		PRINT 'ERROR!'
        PRINT 'ERROR NUMBER: ' + CONVERT(VARCHAR, ERROR_NUMBER());
        PRINT 'Error Message: ' + CONVERT(VARCHAR(MAX), ERROR_MESSAGE());
        SELECT 'Error' AS 'Status', CONVERT(VARCHAR(MAX), ERROR_MESSAGE()) AS 'Guidance';
	END CATCH
GO

EXEC spGetPosts '', '', '', 'hello', ''
GO
