import io
import json
import os
import requests
import tweepy
from google.cloud import vision
from google.cloud.vision import types

# Load config file
with open('config.json', 'r') as f:
    config = json.load(f)

# Authenticate to Google Vision API
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = config['google']['application-credentials-file']

# Authenticate to Twitter
auth = tweepy.OAuthHandler(config['twitter']['apiKey'], config['twitter']['apiSecret'])
auth.set_access_token(config['twitter']['accessToken'], config['twitter']['accessSecret'])

api = tweepy.API(auth, wait_on_rate_limit=True,
                 wait_on_rate_limit_notify=True)


class TweetStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        if (status.user.id == int(config['twitter']['userId'])
                and 'media' in status.entities and not status.retweeted):
            image = status.entities['media'][0]['media_url']
            report(annotate(image), image, status.id)


def annotate(path):
    client = vision.ImageAnnotatorClient()

    if path.startswith('http') or path.startswith('gs:'):
        image = types.Image()
        image.source.image_uri = path

    else:
        with io.open(path, 'rb') as image_file:
            content = image_file.read()

        image = types.Image(content=content)

    web_detection = client.web_detection(image=image).web_detection

    return web_detection


def report(annotations, imageUrl, tweetId):
    pages = []
    matches = []
    partialMatches = []
    keywords = {}
    if annotations.pages_with_matching_images:
        for page in annotations.pages_with_matching_images:
            pages.append(page.url)

    if annotations.full_matching_images:
        for image in annotations.full_matching_images:
            matches.append(image.url)

    if annotations.partial_matching_images:
        for image in annotations.partial_matching_images:
            partialMatches.append(image.url)

    if annotations.web_entities:
        for entity in annotations.web_entities:
            if len(entity.description) > 0:
                keywords[entity.description] = entity.score
        limit = 230 if config['contextMonster']['includeUrl'] else 265
        tweet = '. @archillect Related keywords: "'
        for entity in annotations.web_entities:
            keyword = entity.description
            if len(tweet) + len(keyword) <= limit:
                if len(keyword) > 0:
                    tweet += keyword + ', '
            else:
                break
        data = {
            'image': imageUrl,
            'pages': pages,
            'matches': matches,
            'partialMatches': partialMatches,
            'keywords': keywords,
            'archillectTweet': tweetId,
            'tweet': 0,
            'key': config['contextMonster']['apiKey']
        }
        r = requests.post(url=config['contextMonster']['apiUrl'], json=data)
        if r.status_code == requests.codes.created:
            tweet = tweet[:-2]
            if config['contextMonster']['includeUrl']:
                tweet += '" Full report: ' + config['contextMonster']['reportUrl'] + str(json.loads(r.text)['id'])
            else:
                tweet += '"'
            api.update_status(tweet, in_reply_to_status_id=tweetId)
            print(tweet)


tweetStreamListener = TweetStreamListener()
myStream = tweepy.Stream(auth=api.auth, listener=tweetStreamListener)
myStream.filter(follow=[config['twitter']['userId']])
