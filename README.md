# Archillect Context Bot
Source code for the Twitter bot [@archicontext](https://twitter.com/archicontext).

Archillect Context gets images posted by [@archillect](https://twitter.com/archillect) with the Twitter API and fetches related keywords and similar pictures from the [Google Vision API](https://cloud.google.com/vision/).

Then, it posts this information on Twitter as a response to [@archillect](https://twitter.com/archillect)'s 
original tweet and stores the image and its details in the [context.monster](https://context.monster) database. 

The bot misses half of the images that [@archillect](https://twitter.com/archillect) posts to avoid being banned by Twitter. There's also a delay between [@archillect](https://twitter.com/archillect)'s tweets and the bot's response.

Here's an example of a tweet that the bot has posted:

![Tweet: @archillect Related keywords: "International Space Station, Space debris, RemoveDEBRIS, Space, Outer space, NASA, Spacecraft, Satellite, Space station" Ref: 588](https://i.imgur.com/82DLUwl.png)
```
. @archillect
 Related keywords: "International Space Station, Space debris, RemoveDEBRIS, Space, Outer space, NASA, Spacecraft, Satellite, Space station" Ref: 588
```

More information about any picture can be found at [context.monster](https://context.monster) using the Ref. number. For instance: [https://context.monster/588](https://context.monster/588)
