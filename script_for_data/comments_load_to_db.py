import MySQLdb as mysqldb
import json, re, os

this_dir = os.path.dirname(os.path.abspath(__file__))

db = mysqldb.connect(host="localhost", user="elaine", passwd="***", db="hackers_news")

for i in range(0, 32):
    cfd = open("{}/comments_all/comments_{}".format(this_dir, i), "r")
    for comment_line in cfd:
        comment = json.loads(comment_line)
        is_delete = False;
        is_dead = False;

        sid = comment["id"]
        parent = comment["parent"]
        time = comment["time"]
        ranking = comment["ranking"]

        try:
            deleted = comment["deleted"]
            is_delete = True
        except:
            is_delete = False;

        try:
            dead = comment["dead"]
            is_dead = True
        except:
            is_dead = False;

        try:
            author = comment["author"]
        except KeyError:
            author = ""

        try:
            edit_by = comment["by"]
        except KeyError:
            edit_by = ""

        try:
            time_ts  = comment["time_ts"]
        except KeyError:
            time_ts = ""

        try:
            content = comment["text"]
            p = re.compile('(\r\n|\r|\n)+')
            content = p.sub(' ', content)
        except KeyError:
            content = ""

        if (not is_dead) and (not is_delete):
            add_new_comment_record = """INSERT INTO comment (id, author, edit_by, parent, time, time_ts, \
            ranking, content) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""

            dbc = db.cursor()

            try:
                dbc.execute(add_new_comment_record, \
                (sid, author, edit_by, parent, time, time_ts, ranking, content))

            except:
                pass
    cfd.close()
    print("{} done!".format(i))

db.commit()
