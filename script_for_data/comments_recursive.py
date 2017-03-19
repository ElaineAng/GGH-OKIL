import MySQLdb as mysqldb
# import sys

def get_comments(prnt_id, cmt_fd, dbc, q, depth):
    if depth >= 2:
        return
    else:
        rslt_num = dbc.execute(q.format(prnt_id))
        if rslt_num == 0:
            return
        else:
            for cmt in dbc:
                cmt_record = ",".join(str(i) for i in cmt)
                cmt_fd.write(cmt_record+'\n')
                print("{}...done!".format(cmt[0]))
                get_comments(cmt[0], cmt_fd, dbc, q, depth+1)
        return

def main():
    db = mysqldb.connect(host="localhost", user="elaine", passwd="***", db="hackers_news")

    all_story_query = "SELECT DISTINCT id FROM stories_short;"
    comments_query = "SELECT * FROM comment where parent={};"

    dbc = db.cursor()

    dbc.execute(all_story_query);
    all_stories = []
    for result in dbc:
        all_stories.append(result[0])

    # for story_id in all_stories:
    story_id = all_stories[0]
    cmt_fd = open("{}".format(story_id), "w")

    get_comments(story_id, cmt_fd, dbc, comments_query, 0)

    cmt_fd.close()
    print("{}.........done!".format(story_id))

if __name__=="__main__":
    main();
