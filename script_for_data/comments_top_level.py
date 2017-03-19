import MySQLdb as mysqldb
import os

this_dir = os.path.dirname(os.path.abspath(__file__))

def main():
    db = mysqldb.connect(host="localhost", user="elaine", passwd="***", db="hackers_news")

    all_story_query = "SELECT DISTINCT id FROM stories_short;"
    comments_query = "SELECT * FROM comment where parent={};"

    dbc = db.cursor()

    dbc.execute(all_story_query);
    all_stories = []
    for result in dbc:
        all_stories.append(result[0])

    for story_id in all_stories:
        cmt_fd = open("{}/comments_topx/{}.tsv".format(this_dir, story_id), "w")
        dbc.execute(comments_query.format(story_id))
        for cmts in dbc:
            cmt = "\t".join(str(c) for c in cmts)
            cmt_fd.write(cmt+'\r\n')
        cmt_fd.close()
        print("{}.........done!".format(story_id))

if __name__=="__main__":
    main();
