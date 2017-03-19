import json

fs = open("filtered_stories_shorter", "w")

for story_line in open('stories'):
    story = json.loads(story_line)
    try:
        desc_num = story["descendants"]
        # first 3k -- 200
        # first 100 -- 550
        # first 20 -- 800
        if int(desc_num) >= 550:
            fs.write(json.dumps(story)+'\n')
    except KeyError:
        pass
