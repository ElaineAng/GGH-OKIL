import MySQLdb as mysqldb
import os

this_dir = os.path.dirname(os.path.abspath(__file__))

def main():
    db = mysqldb.connect(host="localhost", user="elaine", passwd="***", db="hackers_news")

    all_story_query = "SELECT id FROM stories WHERE author={};"
    comments_query = "SELECT * FROM comment where parent={};"

    dbc = db.cursor()
    vip_authors = ["pg", "whoishiring"]
    for author in vip_authors:
        print("For author {}...".format(author))
        dbc.execute(all_story_query.format(author));
        all_stories = []
        for story_id in dbc:
            all_stories.append(story_id[0])

        for story_id in all_stories:
            cmt_fd = open("{}/vip_authors/{}_{}.tsv".\
            format(this_dir, author, story_id), "w")

            dbc.execute(comments_query.format(story_id))
            for cmts in dbc:
                cmt = "\t".join(str(c) for c in cmts)
                cmt_fd.write(cmt+'\r\n')
            cmt_fd.close()
            print("{}.........done!".format(story_id))

if __name__=="__main__":
    main();
