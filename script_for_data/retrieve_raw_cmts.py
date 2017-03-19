from urllib.request import *;
import os

this_dir = os.path.dirname(os.path.abspath(__file__))

for i in range(0, 32):
    print("{}...".format(i))
    if i<=9:
        urlretrieve("https://storage.googleapis.com/jinhu-experimental/hacker_news/comments_00000000000"+str(i),
        "{}/comments_all/comments_{}".format(this_dir, i))
    else:
        urlretrieve("https://storage.googleapis.com/jinhu-experimental/hacker_news/comments_0000000000"+str(i),
        "{}/comments_all/comments_{}".format(this_dir, i))
    print("done!")
