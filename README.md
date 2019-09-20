# Archillect Context Bot
Source code for the bot [@archicontext](https://twitter.com/archicontext).

Archillect Context gets every image that [@archillect](https://twitter.com/archillect) 
tweets via the Twitter API and gets details like web pages which include the same or a similar
image and keywords related to the it using the [Google Cloud Vision API](https://cloud.google.com/vision/).

In this version, there's a delay between [@archillect](https://twitter.com/archillect)'s posts
and this bots' response.

Then, it posts this information on Twitter as a response to [@archillect](https://twitter.com/archillect)'s
original tweet and stores the image and its details in the [context.monster](https://context.monster) database. 
Here's an example of tweet that the bot would post:
```
. @archillect
 Related keywords: "Car, Touring car racing, British Touring Car Championship, Group B, Racing, Auto racing, Compact car, Race track, Motorsport, Stock car racing" Full report: https://context.monster/19
```