SELECT id,author,edit_by,descendants,time,time_ts,score FROM stories LIMIT INTO OUTFILE '/Users/elaine/Desktop/stories-300.csv'
        FIELDS TERMINATED BY '\t'
        ENCLOSED BY '"'
        LINES TERMINATED BY '\r\n';
