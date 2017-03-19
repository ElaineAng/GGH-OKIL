import MySQLdb as mysqldb
import os

this_dir = os.path.dirname(os.path.abspath(__file__))

def main():
    db = mysqldb.connect(host="localhost", user="elaine", passwd="***", db="hackers_news")

    comments_query = "SELECT * FROM comment where parent={};"
    story_id = 9784470

    dbc = db.cursor()

    cmt_fd = open("{}/tmp/{}.tsv".format(this_dir, story_id), "w")
    dbc.execute(comments_query.format(story_id))
    for cmts in dbc:
        cmt = "\t".join(str(c) for c in cmts)
        cmt_fd.write(cmt+'\r\n')
    cmt_fd.close()
    print("{}.........done!".format(story_id))

if __name__=="__main__":
    main();
