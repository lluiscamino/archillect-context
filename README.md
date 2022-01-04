<div align="center">
 
  [![Node.js CI status](https://github.com/lluiscamino/archillect-context/actions/workflows/node.js.yml/badge.svg)](https://github.com/lluiscamino/archillect-context/actions/workflows/node.js.yml)
 [![CodeQl analysis status](https://github.com/lluiscamino/archillect-context/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/lluiscamino/archillect-context/actions/workflows/codeql-analysis.yml)
 [![Follow @archicontext on Twitter](https://img.shields.io/twitter/follow/archicontext?style=social)](https://twitter.com/archicontext)
 
</div>

# Archillect Context Bot
Source code for the Twitter bot [@archicontext](https://twitter.com/archicontext).

Archillect Context analyzes every image posted by [@archillect](https://twitter.com/archillect) and responds with keywords related to it.

## Example

![Tweet: @archillect Related keywords: "International Space Station, Space debris, RemoveDEBRIS, Space, Outer space, NASA, Spacecraft, Satellite, Space station" Ref: 588](https://i.imgur.com/82DLUwl.png)
```
. @archillect
 Related keywords: "International Space Station, Space debris, RemoveDEBRIS, Space, Outer space, NASA, Spacecraft, Satellite, Space station" Ref: 588
```

## Built using
* [Google Cloud Vision API](https://cloud.google.com/vision)
* [Twit](https://github.com/ttezel/twit)
