CREATE TABLE stories
(id     VARCHAR(8),
author  VARCHAR(20),
edit_by VARCHAR(20),
descendants INT(10),
time    INT(12),
time_ts VARCHAR(40),
score   INT(12),
title   TEXT(2048),
url     TEXT(8192),
content TEXT(65535));


CREATE TABLE comment
(id       VARCHAR(8),
author    VARCHAR(20),
edit_by   VARCHAR(20),
parent    INT(10),
time      INT(12),
time_ts   VARCHAR(40),
ranking   INT(5),
content   TEXT(65535));

CREATE TABLE stories_short
(id VARCHAR(8),
author VARCHAR(20),
edit_by VARCHAR(20),
descendants INT(10),
time INT(12),
time_ts VARCHAR(40),
score INT(12),
title TEXT(2048),
url TEXT(8192),
content TEXT(65535));
