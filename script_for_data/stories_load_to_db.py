import MySQLdb as mysqldb
import json
import re

db = mysqldb.connect(host="localhost", user="elaine", passwd="0829mj", db="hackers_news")

for story_line in open("filtered_stories_shorter"):

    story = json.loads(story_line)
    title = story["title"]
    sid = story["id"]
    descendants = story["descendants"]
    time = story["time"]
    score = story["score"]

    try:
        author = story["author"]
    except KeyError:
        author = ""

    try:
        edit_by = story["by"]
    except KeyError:
        edit_by = ""

    try:
        time_ts  = story["time_ts"]
    except KeyError:
        time_ts = ""

    try:
        url = story["url"]
    except KeyError:
        url = ""

    try:
        content = story["text"]
        p = re.compile('(\r\n|\r|\n)+')
        content = p.sub(' ', content)
    except KeyError:
        content = ""

    add_new_story_record = """INSERT INTO stories_short (id, author, edit_by, descendants, time, time_ts, \
    score, title, url, content) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    dbc = db.cursor()

    try:
        dbc.execute(add_new_story_record, \
        (sid, author, edit_by, descendants, time, time_ts, score, title, url, content))
        db.commit()
    except Exception as e:
        print(sid);
        print(e)
